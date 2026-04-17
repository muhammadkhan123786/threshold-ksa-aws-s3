import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    HttpStatus,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
    ApiQuery,
    ApiConsumes,
    ApiBody,
} from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { ConflictException } from "@nestjs/common";

import { CreateClubAdminDto } from "src/dto/clubAdmin/create-club-admin.dto";

import { ClubAdminService } from "./clubAdmin.service";

import {
    SWAGGER_TAGS,
    SWAGGER_OPERATIONS,
    SWAGGER_PARAMS,
    SWAGGER_RESPONSES,
    SWAGGER_BODIES,
} from "./swagger.constants";
import { UpdateClubAdminDto } from "src/dto/clubAdmin/update-clubAdmin.dto";
import { GetClubAdminsQueryDto } from "src/dto/clubAdmin/get-club-admins-query.dto";
import {
    SWAGGER_DOCUMENTS,
    SWAGGER_MEDICAL_FILES,
    SWAGGER_MEDICAL_HISTORY,
    SWAGGER_UPDATE_MEDICAL_FILES,
} from "../clubCoaches/swagger.constants";
import { UpdateMedicalFileDto } from "src/dto/clubCoaches/update-medical-file.dto";
import { CreateMedicalFileDto } from "src/dto/clubCoaches/create-medical-file.dto";
import { UpdateDocumentDto } from "src/dto/clubCoaches/update-document.dto";
import { CreateDocumentDto } from "src/dto/clubCoaches/create-document.dto";
import { UpdateBankDetailsDto } from "src/dto/clubCoaches/update-bank-details.dto";
import { UpdateMedicalInformationDto } from "src/dto/clubCoaches/update-medical-information.dto";
import { UpdateContactDto } from "src/dto/clubCoaches/update-contract.dto";
import { UpdatePersonalInformationDto } from "src/dto/clubAdmin/update-personal-information.dto";
import {
    UpdateContractDto,
    CreateContractDto,
} from "src/dto/contracts/contract.dto";
import {
    SWAGGER_CONTRACT_CREATE,
    SWAGGER_CONTRACT_GET,
    SWAGGER_CONTRACT_UPDATE,
} from "../contracts/swagger.constants";

@ApiTags(SWAGGER_TAGS.CLUB_ADMINS)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("sportClubProfile/:sportClubProfileId/club-admin")
export class ClubAdminController {
    constructor(private readonly clubAdminService: ClubAdminService) {}

    @Get(":id/personal-information")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.GET_PERSONAL_INFORMATION.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_PERSONAL_INFORMATION_SUCCESS)
    async getPersonalInformation(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const personalInfo =
                await this.clubAdminService.getPersonalInformation(id);
            return res.status(200).json({
                message: "Personal information fetched successfully",
                data: personalInfo,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while fetching personal information",
                error: error.message,
            });
        }
    }

    @Patch(":id/personal-information")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("avatar", {
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    cb(
                        new ConflictException(
                            "Only JPG, JPEG, PNG files are allowed!"
                        ),
                        false
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.UPDATE_PERSONAL_INFORMATION.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiBody(SWAGGER_BODIES.UPDATE_PERSONAL_INFORMATION)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_PERSONAL_INFORMATION_SUCCESS)
    async updatePersonalInformation(
        @Param("id") id: string,
        @Body() updateDto: UpdatePersonalInformationDto,

        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const updatedInfo =
                await this.clubAdminService.updatePersonalInformation(
                    id,
                    updateDto,
                    avatar
                );
            return res.status(200).json({
                message: "Personal information updated successfully",
                data: updatedInfo,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating personal information",
                error: error.message,
            });
        }
    }

    @Get(":id/contact")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.GET_CONTACT_DETAILS.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_CONTACT_DETAILS_SUCCESS)
    async getContactDetails(@Param("id") id: string, @Res() res: Response) {
        try {
            const contactDetails =
                await this.clubAdminService.getContactDetails(id);
            return res.status(200).json({
                message: "Contact details fetched successfully",
                data: contactDetails,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while fetching contact details",
                error: error.message,
            });
        }
    }

    @Patch(":id/contact")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.UPDATE_CONTACT_DETAILS.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_CONTACT_DETAILS_SUCCESS)
    async updateContactDetails(
        @Param("id") id: string,
        @Body() updateDto: UpdateContactDto,
        @Res() res: Response
    ) {
        try {
            const updatedContactDetails =
                await this.clubAdminService.updateContactDetails(id, updateDto);
            return res.status(200).json({
                message: "Contact details updated successfully",
                data: updatedContactDetails,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating contact details",
                error: error.message,
            });
        }
    }

    @Get(":id/details")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_COACH_DETAILS.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getCoachDetails(@Param("id") id: string, @Res() res: Response) {
        try {
            const coachDetails =
                await this.clubAdminService.getAdminDetails(id);

            return res.status(200).json({
                message: "Coach details fetched successfully.",
                data: coachDetails,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while fetching coach details.",
                error: error.message,
            });
        }
    }
    @Get(":id/medical-history")
    @ApiOperation(SWAGGER_MEDICAL_HISTORY.GET_OPERATION)
    @ApiParam(SWAGGER_MEDICAL_HISTORY.COACH_ID_PARAM)
    @ApiResponse(SWAGGER_MEDICAL_HISTORY.GET_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getMedicalHistory(@Param("id") id: string, @Res() res: Response) {
        try {
            const medicalHistory =
                await this.clubAdminService.getMedicalHistory(id);
            return res.status(200).json({
                message: "Medical history fetched successfully",
                data: medicalHistory,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error fetching medical history",
                error: error.message,
            });
        }
    }

    @Post(":id/medical-history")
    @ApiConsumes("application/json")
    @ApiOperation(SWAGGER_MEDICAL_HISTORY.ADD_OPERATION)
    @ApiParam(SWAGGER_MEDICAL_HISTORY.COACH_ID_PARAM)
    @ApiBody(SWAGGER_MEDICAL_HISTORY.ADD_BODY)
    @ApiResponse(SWAGGER_MEDICAL_HISTORY.ADD_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_MEDICAL_HISTORY.SERVER_ERROR_RESPONSE)
    async addMedicalHistory(
        @Param("id") id: string,
        @Body() body: { date: string; type: string; description: string },
        @Res() res: Response
    ) {
        try {
            const addedHistory = await this.clubAdminService.addMedicalHistory(
                id,
                body
            );
            return res.status(201).json({
                message: "Medical history record added successfully",
                data: addedHistory,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error adding medical history record",
                error: error.message,
            });
        }
    }

    @Patch(":id/medical-history/:historyId")
    @ApiConsumes("application/json")
    @ApiOperation(SWAGGER_MEDICAL_HISTORY.UPDATE_OPERATION)
    @ApiParam(SWAGGER_MEDICAL_HISTORY.COACH_ID_PARAM)
    @ApiParam(SWAGGER_MEDICAL_HISTORY.HISTORY_ID_PARAM)
    @ApiBody(SWAGGER_MEDICAL_HISTORY.UPDATE_BODY)
    @ApiResponse(SWAGGER_MEDICAL_HISTORY.UPDATE_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_MEDICAL_HISTORY.SERVER_ERROR_RESPONSE)
    async updateMedicalHistory(
        @Param("id") id: string,
        @Param("historyId") historyId: string,
        @Body() body: { date: string; type: string; description: string },
        @Res() res: Response
    ) {
        try {
            const updatedHistory =
                await this.clubAdminService.updateMedicalHistory(
                    id,
                    historyId,
                    body
                );
            return res.status(200).json({
                message: "Medical history record updated successfully",
                data: updatedHistory,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error updating medical history record",
                error: error.message,
            });
        }
    }

    @Post(":id/document")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation(SWAGGER_DOCUMENTS.UPLOAD_OPERATION)
    @ApiParam(SWAGGER_DOCUMENTS.COACH_ID_PARAM)
    @ApiBody(SWAGGER_DOCUMENTS.UPLOAD_BODY)
    @ApiResponse(SWAGGER_DOCUMENTS.SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_DOCUMENTS.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_DOCUMENTS.SERVER_ERROR_RESPONSE)
    async addDocument(
        @Param("id") id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createDocumentDto: CreateDocumentDto,
        @Res() res: Response
    ) {
        try {
            const addedDocument = await this.clubAdminService.addDocument(
                id,
                file,
                createDocumentDto
            );
            return res.status(201).json({
                message: "Document added successfully",
                data: addedDocument,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while adding the document",
                error: error.message,
            });
        }
    }

    @Get(":id/document")
    @ApiOperation(SWAGGER_DOCUMENTS.GET_OPERATION)
    @ApiParam(SWAGGER_DOCUMENTS.COACH_ID_PARAM)
    @ApiResponse(SWAGGER_DOCUMENTS.SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_DOCUMENTS.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_DOCUMENTS.SERVER_ERROR_RESPONSE)
    async getDocuments(@Param("id") id: string, @Res() res: Response) {
        try {
            const documents = await this.clubAdminService.getDocuments(id);
            return res.status(200).json({
                message: "Documents fetched successfully",
                data: documents,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while fetching documents",
                error: error.message,
            });
        }
    }

    @Patch(":id/:documentId/document")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation(SWAGGER_DOCUMENTS.UPDATE_OPERATION)
    @ApiParam(SWAGGER_DOCUMENTS.COACH_ID_PARAM)
    @ApiParam(SWAGGER_DOCUMENTS.DOCUMENT_ID_PARAM)
    @ApiBody(SWAGGER_DOCUMENTS.UPDATE_BODY)
    @ApiResponse(SWAGGER_DOCUMENTS.SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_DOCUMENTS.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_DOCUMENTS.SERVER_ERROR_RESPONSE)
    async updateDocument(
        @Param("id") id: string,
        @Param("documentId") documentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateDocumentDto: UpdateDocumentDto,
        @Res() res: Response
    ) {
        try {
            const updatedDocument = await this.clubAdminService.updateDocument(
                id,
                documentId,
                file,
                updateDocumentDto
            );
            return res.status(200).json({
                message: "Document updated successfully",
                data: updatedDocument,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating the document",
                error: error.message,
            });
        }
    }

    @Get(":id/medical-files")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.GET_MEDICAL_FILES.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_MEDICAL_FILES_SUCCESS)
    async getMedicalFiles(@Param("id") id: string, @Res() res: Response) {
        try {
            const medicalFiles =
                await this.clubAdminService.getMedicalFiles(id);
            return res.status(200).json({
                message: "Medical files fetched successfully",
                data: medicalFiles,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while fetching medical files",
                error: error.message,
            });
        }
    }

    @Post(":id/medical-files")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation(SWAGGER_MEDICAL_FILES.UPLOAD_OPERATION)
    @ApiParam(SWAGGER_MEDICAL_FILES.COACH_ID_PARAM)
    @ApiBody(SWAGGER_MEDICAL_FILES.UPLOAD_BODY)
    @ApiResponse(SWAGGER_MEDICAL_FILES.SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_MEDICAL_FILES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_MEDICAL_FILES.SERVER_ERROR_RESPONSE)
    async addMedicalFile(
        @Param("id") id: string,
        @Body() createMedicalFileDto: CreateMedicalFileDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const addedMedicalFile = await this.clubAdminService.addMedicalFile(
                id,
                file,
                createMedicalFileDto.description
            );
            return res.status(200).json({
                message: "Medical file updated successfully",
                data: addedMedicalFile,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating medical file",
                error: error.message,
            });
        }
    }

    @Patch(":id/medical-files/:fileId")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation(SWAGGER_UPDATE_MEDICAL_FILES.UPDATE_OPERATION)
    @ApiParam(SWAGGER_UPDATE_MEDICAL_FILES.COACH_ID_PARAM)
    @ApiParam(SWAGGER_UPDATE_MEDICAL_FILES.FILE_ID_PARAM)
    @ApiBody(SWAGGER_UPDATE_MEDICAL_FILES.UPDATE_BODY)
    @ApiResponse(SWAGGER_UPDATE_MEDICAL_FILES.SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_UPDATE_MEDICAL_FILES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_UPDATE_MEDICAL_FILES.SERVER_ERROR_RESPONSE)
    async updateMedicalFile(
        @Param("fileId") fileId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateMedicalFileDto: UpdateMedicalFileDto,
        @Res() res: Response
    ) {
        try {
            const updatedMedicalFile =
                await this.clubAdminService.updateMedicalFile(
                    fileId,
                    file,
                    updateMedicalFileDto.description
                );
            return res.status(200).json({
                message: "Medical file updated successfully",
                data: updatedMedicalFile,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating medical file",
                error: error.message,
            });
        }
    }

    @Get(":id/medical")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.GET_MEDICAL_INFORMATION.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_MEDICAL_INFORMATION_SUCCESS)
    async getMedicalInformation(@Param("id") id: string, @Res() res: Response) {
        try {
            const medicalInformation =
                await this.clubAdminService.getMedicalInformation(id);
            return res.status(200).json({
                message: "Medical information fetched successfully",
                data: medicalInformation,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while fetching medical information",
                error: error.message,
            });
        }
    }

    @Patch(":id/medical")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.UPDATE_MEDICAL_INFORMATION.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_MEDICAL_INFORMATION_SUCCESS)
    async updateMedicalInformation(
        @Param("id") id: string,
        @Body() updateDto: UpdateMedicalInformationDto,
        @Res() res: Response
    ) {
        try {
            const updatedMedicalInformation =
                await this.clubAdminService.updateMedicalInformation(
                    id,
                    updateDto
                );
            return res.status(200).json({
                message: "Medical information updated successfully",
                data: updatedMedicalInformation,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating medical information",
                error: error.message,
            });
        }
    }

    @Get(":id/bank")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.GET_BANK_DETAILS.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_BANK_DETAILS_SUCCESS)
    async getBankDetails(@Param("id") id: string, @Res() res: Response) {
        try {
            const bankDetails = await this.clubAdminService.getBankDetails(id);
            return res.status(200).json({
                message: "Bank details fetched successfully",
                data: bankDetails,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while fetching bank details",
                error: error.message,
            });
        }
    }

    @Patch(":id/bank")
    @ApiOperation({
        summary: SWAGGER_OPERATIONS.UPDATE_BANK_DETAILS.summary,
    })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_BANK_DETAILS_SUCCESS)
    async updateBankDetails(
        @Param("id") id: string,
        @Body() updateDto: UpdateBankDetailsDto,
        @Res() res: Response
    ) {
        try {
            const updatedBankDetails =
                await this.clubAdminService.updateBankDetails(id, updateDto);
            return res.status(200).json({
                message: "Bank details updated successfully",
                data: updatedBankDetails,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating bank details",
                error: error.message,
            });
        }
    }

    @Get()
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUB_ADMINS.summary })
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiQuery(SWAGGER_PARAMS.SEARCH_QUERY)
    @ApiQuery(SWAGGER_PARAMS.PAGE_QUERY)
    @ApiQuery(SWAGGER_PARAMS.LIMIT_QUERY)
    @ApiQuery(SWAGGER_PARAMS.SORT_FIELD_QUERY)
    @ApiQuery(SWAGGER_PARAMS.SORT_ORDER_QUERY)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUB_ADMINS_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getClubAdmins(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Query() query: GetClubAdminsQueryDto,
        @Res() res: Response
    ) {
        try {
            const { search, page, limit, sortField, sortOrder } = query;
            const response = await this.clubAdminService.getClubAdmins(
                search,
                sportClubProfileId,
                page,
                limit,
                sortField,
                sortOrder
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving club admins",
                error: error.message,
            });
        }
    }

    @Get(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUB_ADMIN_BY_ID.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUB_ADMIN_BY_ID_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getClubAdminById(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubAdminService.getClubAdminById(
                id,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving the club admin",
                error: error.message,
            });
        }
    }

    @Post()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("avatar", {
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    cb(
                        new ConflictException(
                            "Only JPG, JPEG, PNG files are allowed!"
                        ),
                        false
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
    @ApiOperation({ summary: SWAGGER_OPERATIONS.CREATE_CLUB_ADMIN.summary })
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiBody(SWAGGER_BODIES.CREATE_CLUB_ADMIN)
    @ApiResponse(SWAGGER_RESPONSES.CREATE_CLUB_ADMIN_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    @UsePipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    )
    async createClubAdmin(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Body() createDto: CreateClubAdminDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubAdminService.createUserForClubAdmin(
                createDto,
                avatar,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while creating the club admin",
                error: error.message,
            });
        }
    }

    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("avatar", {
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    cb(
                        new ConflictException(
                            "Only JPG, JPEG, PNG files are allowed!"
                        ),
                        false
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
    @ApiOperation({ summary: SWAGGER_OPERATIONS.UPDATE_CLUB_ADMIN.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiBody(SWAGGER_BODIES.UPDATE_CLUB_ADMIN)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_CLUB_ADMIN_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async updateClubAdmin(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Body() updateDto: UpdateClubAdminDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubAdminService.updateClubAdmin(
                id,
                updateDto,
                avatar,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while updating the club admin",
                error: error.message,
            });
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.DELETE_CLUB_ADMIN.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.DELETE_CLUB_ADMIN_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async deleteClubAdmin(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubAdminService.deleteClubAdmin(
                id,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while deleting the club admin",
                error: error.message,
            });
        }
    }

    @Get(":adminId/contract")
    @ApiOperation({ summary: "Get contract for club admin" })
    @ApiParam({ name: "adminId", type: String, description: "Club Admin ID" })
    @ApiResponse({
        status: 200,
        description: "Contract retrieved successfully",
    })
    async getContract(@Param("adminId") adminId: string, @Res() res: Response) {
        try {
            const result = await this.clubAdminService.getContract(adminId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error retrieving contract",
                error: error.message,
            });
        }
    }

    @Patch(":adminId/contract")
    @ApiOperation({ summary: "Update contract for club admin" })
    @ApiParam({ name: "adminId", description: "Club Admin ID", type: String })
    @ApiConsumes("multipart/form-data")
    @ApiBody(SWAGGER_CONTRACT_UPDATE)
    @ApiResponse(SWAGGER_CONTRACT_GET)
    @UseInterceptors(FileInterceptor("contractFile"))
    async updateContract(
        @Param("adminId") adminId: string,
        @Body() updateContractDto: UpdateContractDto,
        @UploadedFile() contractFile: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const result = await this.clubAdminService.updateContract(
                adminId,
                updateContractDto,
                contractFile
            );
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error updating contract",
                error: error.message,
            });
        }
    }

    @Post(":adminId/contract")
    @ApiOperation({ summary: "Create contract for club admin" })
    @ApiParam({ name: "adminId", description: "Club Admin ID", type: String })
    @ApiConsumes("multipart/form-data")
    @ApiBody(SWAGGER_CONTRACT_CREATE)
    @ApiResponse(SWAGGER_CONTRACT_GET)
    @UseInterceptors(FileInterceptor("contractFile"))
    async createContract(
        @Param("adminId") adminId: string,
        @Body() createContractDto: CreateContractDto,
        @UploadedFile() contractFile: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const result = await this.clubAdminService.createContract(
                adminId,
                createContractDto,
                contractFile
            );
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error creating contract",
                error: error.message,
            });
        }
    }
}
