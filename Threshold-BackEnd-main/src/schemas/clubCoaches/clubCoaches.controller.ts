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

import { CreateClubCoachDto } from "src/dto/clubCoaches/create-club-coach.dto";
import { UpdateClubCoachDto } from "src/dto/clubCoaches/update-club-coach.dto";
import { GetClubCoachesQueryDto } from "src/dto/clubCoaches/get-club-coaches-query.dto";

import { ClubCoachesService } from "./clubCoaches.service";

import {
    SWAGGER_TAGS,
    SWAGGER_OPERATIONS,
    SWAGGER_PARAMS,
    SWAGGER_RESPONSES,
    SWAGGER_BODIES,
    SWAGGER_MEDICAL_FILES,
    SWAGGER_UPDATE_MEDICAL_FILES,
    SWAGGER_DOCUMENTS,
    SWAGGER_MEDICAL_HISTORY,
} from "./swagger.constants";
import { UpdatePersonalInformationDto } from "src/dto/clubCoaches/update-personal-information.dto";
import { UpdateContactDto } from "src/dto/clubCoaches/update-contract.dto";
import { UpdateBankDetailsDto } from "src/dto/clubCoaches/update-bank-details.dto";
import { UpdateMedicalInformationDto } from "src/dto/clubCoaches/update-medical-information.dto";
import { CreateMedicalFileDto } from "src/dto/clubCoaches/create-medical-file.dto";
import { UpdateMedicalFileDto } from "src/dto/clubCoaches/update-medical-file.dto";
import { CreateDocumentDto } from "src/dto/clubCoaches/create-document.dto";
import { UpdateDocumentDto } from "src/dto/clubCoaches/update-document.dto";
import {
    CreateContractDto,
    UpdateContractDto,
} from "src/dto/contracts/contract.dto";
import {
    SWAGGER_CONTRACT_CREATE,
    SWAGGER_CONTRACT_GET,
    SWAGGER_CONTRACT_UPDATE,
} from "../contracts/swagger.constants";

@ApiTags(SWAGGER_TAGS.CLUB_COACHES)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("sportClubProfile/:sportClubProfileId/club-coaches")
export class ClubCoachesController {
    constructor(private readonly clubCoachesService: ClubCoachesService) {}

    @Get(":id/details")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_COACH_DETAILS.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.SUCCESS_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getCoachDetails(@Param("id") id: string, @Res() res: Response) {
        try {
            const coachDetails =
                await this.clubCoachesService.getCoachDetails(id);

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
    @ApiTags(`${SWAGGER_TAGS.CLUB_COACHES} - ${SWAGGER_TAGS.MEDICAL_HISTORY}`)
    @ApiOperation(SWAGGER_MEDICAL_HISTORY.GET_OPERATION)
    @ApiParam(SWAGGER_MEDICAL_HISTORY.COACH_ID_PARAM)
    @ApiResponse(SWAGGER_MEDICAL_HISTORY.GET_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getMedicalHistory(@Param("id") id: string, @Res() res: Response) {
        try {
            const medicalHistory =
                await this.clubCoachesService.getMedicalHistory(id);
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
    @ApiTags(`${SWAGGER_TAGS.CLUB_COACHES} - ${SWAGGER_TAGS.MEDICAL_HISTORY}`)
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
            const addedHistory =
                await this.clubCoachesService.addMedicalHistory(id, body);
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
    @ApiTags(`${SWAGGER_TAGS.CLUB_COACHES} - ${SWAGGER_TAGS.MEDICAL_HISTORY}`)
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
                await this.clubCoachesService.updateMedicalHistory(
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
            const addedDocument = await this.clubCoachesService.addDocument(
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
            const documents = await this.clubCoachesService.getDocuments(id);
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
            const updatedDocument =
                await this.clubCoachesService.updateDocument(
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
                await this.clubCoachesService.getMedicalFiles(id);
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
            const addedMedicalFile =
                await this.clubCoachesService.addMedicalFile(
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
                await this.clubCoachesService.updateMedicalFile(
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

    @Get()
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUB_COACHES.summary })
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiQuery(SWAGGER_PARAMS.SEARCH_QUERY)
    @ApiQuery(SWAGGER_PARAMS.PAGE_QUERY)
    @ApiQuery(SWAGGER_PARAMS.LIMIT_QUERY)
    @ApiQuery(SWAGGER_PARAMS.SORT_FIELD_QUERY)
    @ApiQuery(SWAGGER_PARAMS.SORT_ORDER_QUERY)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUB_COACHES_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getClubCoaches(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Query() query: GetClubCoachesQueryDto,
        @Res() res: Response
    ) {
        try {
            const { search, page, limit, sortField, sortOrder } = query;
            const response = await this.clubCoachesService.getClubCoaches(
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
                message: "An error occurred while retrieving club coaches",
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
                await this.clubCoachesService.getMedicalInformation(id);
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
                await this.clubCoachesService.updateMedicalInformation(
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
            const bankDetails =
                await this.clubCoachesService.getBankDetails(id);
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
                await this.clubCoachesService.updateBankDetails(id, updateDto);
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

    @Get(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUB_COACH_BY_ID.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUB_COACH_BY_ID_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getClubCoachById(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubCoachesService.getClubCoachById(
                id,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving the club coach",
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
                await this.clubCoachesService.getContactDetails(id);
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
                await this.clubCoachesService.updateContactDetails(
                    id,
                    updateDto
                );
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
                await this.clubCoachesService.getPersonalInformation(id);
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
                await this.clubCoachesService.updatePersonalInformation(
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
    @ApiOperation({ summary: SWAGGER_OPERATIONS.CREATE_CLUB_COACH.summary })
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiBody(SWAGGER_BODIES.CREATE_CLUB_COACH)
    @ApiResponse(SWAGGER_RESPONSES.CREATE_CLUB_COACH_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async createClubCoach(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Body() createDto: CreateClubCoachDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const response =
                await this.clubCoachesService.createUserForClubCoach(
                    createDto,
                    avatar,
                    sportClubProfileId
                );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while creating the club coach",
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
    @ApiOperation({ summary: SWAGGER_OPERATIONS.UPDATE_CLUB_COACH.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiBody(SWAGGER_BODIES.UPDATE_CLUB_COACH)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_CLUB_COACH_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async updateClubCoach(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Body() updateDto: UpdateClubCoachDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubCoachesService.updateClubCoach(
                id,
                updateDto,
                avatar,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while updating the club coach",
                error: error.message,
            });
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.DELETE_CLUB_COACH.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiParam(SWAGGER_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.DELETE_CLUB_COACH_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async deleteClubCoach(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubCoachesService.deleteClubCoach(
                id,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while deleting the club coach",
                error: error.message,
            });
        }
    }

    @Post(":coachId/contract")
    @ApiOperation({ summary: "Create contract for club coach" })
    @ApiParam({ name: "coachId", description: "Club Coach ID", type: String })
    @ApiConsumes("multipart/form-data")
    @ApiBody(SWAGGER_CONTRACT_CREATE)
    @ApiResponse(SWAGGER_CONTRACT_GET)
    @UseInterceptors(FileInterceptor("contractFile"))
    async createContract(
        @Param("coachId") coachId: string,
        @Body() createContractDto: CreateContractDto,
        @UploadedFile() contractFile: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const result = await this.clubCoachesService.createContract(
                coachId,
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

    @Patch(":coachId/contract")
    @ApiOperation({ summary: "Update contract for club coach" })
    @ApiParam({ name: "coachId", description: "Club Coach ID", type: String })
    @ApiConsumes("multipart/form-data")
    @ApiBody(SWAGGER_CONTRACT_UPDATE)
    @ApiResponse(SWAGGER_CONTRACT_GET)
    @UseInterceptors(FileInterceptor("contractFile"))
    async updateContract(
        @Param("coachId") coachId: string,
        @Body() updateContractDto: UpdateContractDto,
        @UploadedFile() contractFile: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const result = await this.clubCoachesService.updateContract(
                coachId,
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

    @Get(":coachId/contract")
    @ApiOperation({ summary: "Get contract for club coach" })
    @ApiParam({ name: "coachId", description: "Club Coach ID", type: String })
    @ApiResponse(SWAGGER_CONTRACT_GET)
    async getContract(@Param("coachId") coachId: string, @Res() res: Response) {
        const result = await this.clubCoachesService.getContract(coachId);
        return res.status(result.status).json(result);
    }
}
