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
import { PlayerDocumentsService } from "./playerDocuments.service";
import { UpdateAthleteDocumentDto } from "src/dto/athleteDocument/update-athlete-document.dto";
import { DocumentType } from "src/enums/document-type.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import CustomResponseType from "src/types/customResponseType";
import { AthleteDocument } from "src/entities/athleteDocument.entity";

import {
    PLAYER_DOCUMENTS_TAG,
    SWAGGER_PLAYER_DOCUMENTS,
} from "./swagger.constants";

@ApiTags(PLAYER_DOCUMENTS_TAG)
@Controller("players/:id/documents")
export class PlayerDocumentsController {
    constructor(
        private readonly athleteDocumentsService: PlayerDocumentsService
    ) {}

    @Post("upload/:type")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation(SWAGGER_PLAYER_DOCUMENTS.UPLOAD_OPERATION)
    @ApiConsumes("multipart/form-data")
    @ApiParam(SWAGGER_PLAYER_DOCUMENTS.UPLOAD_ATHLETE_ID_PARAM)
    @ApiParam(SWAGGER_PLAYER_DOCUMENTS.UPLOAD_DOCUMENT_TYPE_PARAM)
    @ApiBody(SWAGGER_PLAYER_DOCUMENTS.UPLOAD_BODY)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.UPLOAD_SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.UPLOAD_ERROR_RESPONSE)
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
    @ApiOperation(SWAGGER_PLAYER_DOCUMENTS.DELETE_OPERATION)
    @ApiParam(SWAGGER_PLAYER_DOCUMENTS.DELETE_ATHLETE_ID_PARAM)
    @ApiParam(SWAGGER_PLAYER_DOCUMENTS.DELETE_DOCUMENT_ID_PARAM)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.DELETE_SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.DELETE_NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.DELETE_ERROR_RESPONSE)
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
    @ApiOperation(SWAGGER_PLAYER_DOCUMENTS.GET_OPERATION)
    @ApiParam(SWAGGER_PLAYER_DOCUMENTS.GET_ATHLETE_ID_PARAM)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.GET_SUCCESS_RESPONSE)
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
    @ApiOperation(SWAGGER_PLAYER_DOCUMENTS.PATCH_OPERATION)
    @ApiConsumes("multipart/form-data")
    @ApiParam(SWAGGER_PLAYER_DOCUMENTS.PATCH_ATHLETE_ID_PARAM)
    @ApiParam(SWAGGER_PLAYER_DOCUMENTS.PATCH_DOCUMENT_ID_PARAM)
    @ApiBody(SWAGGER_PLAYER_DOCUMENTS.PATCH_BODY)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.PATCH_SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.PATCH_NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER_DOCUMENTS.PATCH_ERROR_RESPONSE)
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
