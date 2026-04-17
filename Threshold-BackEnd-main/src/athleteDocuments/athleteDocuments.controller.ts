import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Param,
    Delete,
    Body,
    Patch,
    Get,
    UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiParam,
} from "@nestjs/swagger";
import { AthleteDocumentsService } from "./athleteDocuments.service";
import { UpdateAthleteDocumentDto } from "src/dto/athleteDocument/update-athlete-document.dto";
import { DocumentType } from "src/enums/document-type.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import CustomResponseType from "src/types/customResponseType";
import { AthleteDocument } from "src/entities/athleteDocument.entity";

@ApiTags("Athlete Documents")
@Controller("athletes/:id/documents")
export class AthleteDocumentsController {
    constructor(
        private readonly athleteDocumentsService: AthleteDocumentsService
    ) {}

    @Post("upload/:type")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({
        summary: "Upload an athlete's document",
        description:
            "Upload a document for a specific athlete. The document is uploaded to an S3 bucket, and its metadata is saved in the database.",
    })
    @ApiConsumes("multipart/form-data")
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiParam({
        name: "type",
        description: "The type of document being uploaded",
        enum: DocumentType,
    })
    @ApiBody({
        description: "The file to be uploaded",
        required: true,
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: "Document uploaded successfully",
        schema: {
            example: {
                message: "Document uploaded successfully",
                payload: {
                    id: "123e4567-e89b-12d3-a456-426614174001",
                    type: "passport",
                    url: "https://s3/bucketname/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                    lastUpdated: "2024-01-01T00:00:00.000Z",
                },
                status: 201,
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: "Failed to upload document",
        schema: {
            example: {
                message: "Error occurred: Failed to upload document",
                payload: null,
                status: 500,
            },
        },
    })
    async uploadDocument(
        @Param("id") athleteId: string,
        @Param("type") type: DocumentType,
        @UploadedFile() file: Express.Multer.File
    ): Promise<CustomResponseType<AthleteDocument | null>> {
        return await this.athleteDocumentsService.uploadDocument(
            athleteId,
            file,
            type
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(":documentId")
    @ApiOperation({
        summary: "Delete an athlete's document",
        description:
            "Delete a specific document for an athlete. The document is deleted from the S3 bucket and the metadata is removed from the database.",
    })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiParam({
        name: "documentId",
        description: "The ID of the document to be deleted",
        example: "123e4567-e89b-12d3-a456-426614174001",
    })
    @ApiResponse({
        status: 200,
        description: "Document deleted successfully",
        schema: {
            example: {
                message: "Document deleted successfully",
                payload: {
                    id: "123e4567-e89b-12d3-a456-426614174001",
                    url: "https://s3.buckename/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                    type: "passport",
                    lastUpdated: "2024-01-01T00:00:00.000Z",
                },
                status: 200,
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: "Document not found",
        schema: {
            example: {
                message: "Error occurred: Document not found",
                payload: null,
                status: 404,
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: "Failed to delete document",
        schema: {
            example: {
                message: "Error occurred: Failed to delete document",
                payload: null,
                status: 500,
            },
        },
    })
    async deleteDocument(
        @Param("id") athleteId: string,
        @Param("documentId") documentId: string
    ): Promise<CustomResponseType<AthleteDocument | null>> {
        return await this.athleteDocumentsService.deleteDocument(
            athleteId,
            documentId
        );
    }

    @Get()
    @ApiOperation({
        summary: "Retrieve all documents for an athlete",
        description:
            "Get a list of all documents associated with a specific athlete.",
    })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 200,
        description: "Successfully retrieved athlete's documents",
        schema: {
            example: {
                message: "Documents retrieved successfully",
                payload: [
                    {
                        id: "123e4567-e89b-12d3-a456-426614174001",
                        type: "passport",
                        url: "https://s3/bucketname/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                        lastUpdated: "2024-01-01T00:00:00.000Z",
                    },
                    {
                        id: "123e4567-e89b-12d3-a456-426614174002",
                        type: "id_card",
                        url: "https://s3/bucketname/athletes/athleteId/documents/id_card/id_card-2024-01-01T00:00:00.000Z.pdf",
                        lastUpdated: "2024-01-01T00:00:00.000Z",
                    },
                ],
                status: 200,
            },
        },
    })
    async getDocumentsByAthleteId(
        @Param("id") athleteId: string
    ): Promise<CustomResponseType<AthleteDocument[]>> {
        return await this.athleteDocumentsService.getDocumentsByAthleteId(
            athleteId
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(":documentId")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({
        summary: "Update an athlete's document",
        description:
            "Update the details of a specific document associated with an athlete.",
    })
    @ApiConsumes("multipart/form-data")
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiParam({
        name: "documentId",
        description: "The ID of the document to be updated",
        example: "123e4567-e89b-12d3-a456-426614174001",
    })
    @ApiBody({
        description: "The updated document file",
        required: false,
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
                type: {
                    type: "string",
                    enum: Object.values(DocumentType),
                    example: DocumentType.PASSPORT,
                    description: "The type of document being updated",
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Document updated successfully",
        schema: {
            example: {
                message: "Document updated successfully",
                payload: {
                    id: "123e4567-e89b-12d3-a456-426614174001",
                    type: "passport",
                    url: "https://s3/bucketname/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                    lastUpdated: "2024-01-01T00:00:00.000Z",
                },
                status: 200,
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: "Document not found",
        schema: {
            example: {
                message: "Error occurred: Document not found",
                payload: null,
                status: 404,
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: "Failed to update document",
        schema: {
            example: {
                message: "Error occurred: Failed to update document",
                payload: null,
                status: 500,
            },
        },
    })
    async updateDocument(
        @Param("id") athleteId: string,
        @Param("documentId") documentId: string,
        @Body() updateAthleteDocumentDto: UpdateAthleteDocumentDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<CustomResponseType<AthleteDocument | null>> {
        return await this.athleteDocumentsService.updateDocument(
            athleteId,
            documentId,
            updateAthleteDocumentDto,
            file
        );
    }
}
