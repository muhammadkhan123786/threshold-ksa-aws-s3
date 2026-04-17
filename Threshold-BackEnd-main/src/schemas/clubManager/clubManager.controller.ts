import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Logger,
    ConflictException,
    UploadedFiles,
    RequestTimeoutException,
} from "@nestjs/common";
import {
    ApiConsumes,
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiBody,
} from "@nestjs/swagger";
import { Response } from "express";
import {
    FileFieldsInterceptor,
    FileInterceptor,
} from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateManagerDTO } from "src/dto/manager/manager.dto";
import { UpdateManagerDTO } from "src/dto/manager/update-manager.dto";
import {
    SwaggerManagerTags,
    SwaggerGetManagers,
    SwaggerGetManagerById,
    SwaggerCreateManager,
    SwaggerUpdateManager,
    SwaggerDeleteManager,
} from "./swagger.constants";
import { ClubManagerService } from "./clubManager.service";
import { GetManagersDto } from "src/dto/manager/get-manager.dto";
import {
    UpdateContractDto,
    CreateContractDto,
} from "src/dto/contracts/contract.dto";
import {
    SWAGGER_CONTRACT_CREATE,
    SWAGGER_CONTRACT_GET,
    SWAGGER_CONTRACT_UPDATE,
} from "../contracts/swagger.constants";
import { S3Service } from "src/s3/s3.service";
import { UpdatePersonalInformationDto } from "src/dto/manager/update-personal-information.dto";
import { UpdateContactDto } from "src/dto/manager/update-contact.dto";
import {
    CreateDocumentDto,
    UpdateDocumentDto,
} from "src/dto/manager/document.dto";
import {
    CreateMedicalFileDto,
    UpdateMedicalFileDto,
} from "src/dto/manager/medical-file.dto";
import { UpdateBankDetailsDto } from "src/dto/manager/update-bank-details.dto";
import CustomResponseType from "src/types/customResponseType";

@ApiTags("Club Manager")
@SwaggerManagerTags()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("club/:clubId/manager")
export class ClubManagerController {
    private readonly logger = new Logger(ClubManagerController.name);

    constructor(
        private readonly managerService: ClubManagerService,
        private readonly s3Service: S3Service
    ) {}

    @Get()
    @SwaggerGetManagers()
    async getManagers(
        @Res() res: Response,
        @Param("clubId") clubId: string,
        @Query() query: GetManagersDto
    ) {
        if (!clubId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Club ID is required",
            });
        }

        try {
            const { data, total } = await this.managerService.getManagers(
                clubId,
                query.branchId,
                { limit: query.limit, page: query.page }
            );

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Managers retrieved successfully",
                data,
                total,
                page: query?.page || 1,
                limit: query?.limit || 10,
            });
        } catch (error) {
            this.logger.error(
                `Error in getManagers: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while retrieving managers",
                error: error.message,
            });
        }
    }

    @Get(":managerId")
    @SwaggerGetManagerById()
    async getManagerById(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        if (!managerId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Manager ID is required",
            });
        }

        try {
            const response =
                await this.managerService.getManagerById(managerId);
            return res.status(response.status).json(response);
        } catch (error) {
            this.logger.error(
                `Error in getManagerById: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while retrieving the manager",
                error: error.message,
            });
        }
    }

    @Post()
    @SwaggerCreateManager()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], {
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                    cb(
                        new ConflictException(
                            "Only JPG, JPEG, PNG and PDF files are allowed!"
                        ),
                        false
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
    async createManager(
        @Res() res: Response,
        @Param("clubId") clubId: string,
        @Body() createDto: CreateManagerDTO,
        @UploadedFiles()
        files: {
            avatar?: Express.Multer.File[];
        }
    ) {
        if (!clubId) {
            this.logger.warn("Club ID is missing in request");
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Club ID is required",
            });
        }

        try {
            this.logger.log(`Creating manager for club ${clubId}`);

            // Set a timeout for the operation
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(
                    () =>
                        reject(
                            new RequestTimeoutException("Request timed out")
                        ),
                    30000
                );
            });

            // Race the manager creation against the timeout
            const response = (await Promise.race([
                this.managerService.createManager(
                    clubId,
                    createDto,
                    files?.avatar?.[0]
                ),
                timeoutPromise,
            ])) as CustomResponseType<any>;

            this.logger.log(
                `Manager creation response status: ${response.status}`
            );

            return res.status(response.status).json(response);
        } catch (error) {
            this.logger.error(
                `Error in createManager: ${error.message}`,
                error.stack
            );

            if (error instanceof RequestTimeoutException) {
                return res.status(HttpStatus.REQUEST_TIMEOUT).json({
                    success: false,
                    message: "Request timed out while creating the manager",
                    error: "The operation took too long to complete",
                });
            }

            if (error instanceof ConflictException) {
                return res.status(HttpStatus.CONFLICT).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while creating the manager",
                error: error.message,
            });
        }
    }

    @Patch(":managerId")
    @SwaggerUpdateManager()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], {
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                    cb(
                        new ConflictException(
                            "Only JPG, JPEG, PNG and PDF files are allowed!"
                        ),
                        false
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
    async updateManager(
        @Body() updateDto: UpdateManagerDTO,
        @UploadedFiles()
        files: {
            avatar?: Express.Multer.File[];
        },
        @Res() res: Response,
        @Param("managerId") managerId: string,
        @Param("clubId") clubId: string
    ) {
        if (!clubId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Club ID is required",
            });
        }

        if (!managerId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Manager ID is required",
            });
        }

        try {
            const response = await this.managerService.updateManager(
                clubId,
                managerId,
                updateDto,
                files.avatar?.[0]
            );

            if (!response.payload) {
                return res.status(response.status).json(response);
            }

            return res.status(response.status).json(response);
        } catch (error) {
            this.logger.error(
                `Error in updateManager: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while updating the manager",
                error: error.message,
            });
        }
    }

    @Delete(":managerId")
    @SwaggerDeleteManager()
    async deleteManager(
        @Param("managerId") managerId: string,
        @Param("clubId") clubId: string,
        @Res() res: Response
    ) {
        if (!managerId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Manager ID is required",
            });
        }

        try {
            const response = await this.managerService.deleteManager(managerId);

            if (!response.payload) {
                return res.status(response.status).json(response);
            }

            return res.status(response.status).json(response);
        } catch (error) {
            this.logger.error(
                `Error in deleteManager: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while deleting the manager",
                error: error.message,
            });
        }
    }

    @Get(":managerId/contract")
    @ApiOperation({ summary: "Get contract for club manager" })
    @ApiParam({
        name: "managerId",
        type: String,
        description: "Club Manager ID",
    })
    @ApiResponse({
        status: 200,
        description: "Contract retrieved successfully",
    })
    async getContract(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.managerService.getContract(managerId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error retrieving contract",
                error: error.message,
            });
        }
    }

    @Patch(":managerId/contract")
    @ApiOperation({ summary: "Update contract for club manager" })
    @ApiParam({
        name: "managerId",
        description: "Club Manager ID",
        type: String,
    })
    @ApiConsumes("multipart/form-data")
    @ApiBody(SWAGGER_CONTRACT_UPDATE)
    @ApiResponse(SWAGGER_CONTRACT_GET)
    @UseInterceptors(FileInterceptor("contractFile"))
    async updateContract(
        @Param("managerId") managerId: string,
        @Body() updateContractDto: UpdateContractDto,
        @UploadedFile() contractFile: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const result = await this.managerService.updateContract(
                managerId,
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

    @Post(":managerId/contract")
    @ApiOperation({ summary: "Create contract for club manager" })
    @ApiConsumes("multipart/form-data")
    @ApiBody(SWAGGER_CONTRACT_CREATE)
    @ApiResponse(SWAGGER_CONTRACT_GET)
    @UseInterceptors(FileInterceptor("contractFile"))
    async createContract(
        @Param("managerId") managerId: string,
        @Body() createContractDto: CreateContractDto,
        @UploadedFile() contractFile: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const result = await this.managerService.createContract(
                managerId,
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

    @Get(":managerId/personal-information")
    @ApiOperation({ summary: "Get personal information for manager" })
    async getPersonalInformation(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        try {
            const personalInfo =
                await this.managerService.getPersonalInformation(managerId);
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

    @Patch(":managerId/personal-information")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("avatar", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation({ summary: "Update personal information for manager" })
    async updatePersonalInformation(
        @Param("managerId") managerId: string,
        @Body() updateDto: UpdatePersonalInformationDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const updatedInfo =
                await this.managerService.updatePersonalInformation(
                    managerId,
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

    @Get(":managerId/contact")
    @ApiOperation({ summary: "Get contact details for manager" })
    async getContactDetails(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        try {
            const contactDetails =
                await this.managerService.getContactDetails(managerId);
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

    @Patch(":managerId/contact")
    @ApiOperation({ summary: "Update contact details for manager" })
    async updateContactDetails(
        @Param("managerId") managerId: string,
        @Body() updateDto: UpdateContactDto,
        @Res() res: Response
    ) {
        try {
            const updatedContactDetails =
                await this.managerService.updateContactDetails(
                    managerId,
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

    @Get(":managerId/medical-history")
    @ApiOperation({ summary: "Get medical history for manager" })
    async getMedicalHistory(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        try {
            const medicalHistory =
                await this.managerService.getMedicalHistory(managerId);
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

    @Post(":managerId/medical-history")
    @ApiConsumes("application/json")
    @ApiOperation({ summary: "Add medical history for manager" })
    async addMedicalHistory(
        @Param("managerId") managerId: string,
        @Body() body: { date: string; type: string; description: string },
        @Res() res: Response
    ) {
        try {
            const addedHistory = await this.managerService.addMedicalHistory(
                managerId,
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

    @Patch(":managerId/medical-history/:historyId")
    @ApiConsumes("application/json")
    @ApiOperation({ summary: "Update medical history for manager" })
    async updateMedicalHistory(
        @Param("managerId") managerId: string,
        @Param("historyId") historyId: string,
        @Body() body: { date: string; type: string; description: string },
        @Res() res: Response
    ) {
        try {
            const updatedHistory =
                await this.managerService.updateMedicalHistory(
                    managerId,
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

    @Get(":managerId/document")
    @ApiOperation({ summary: "Get documents for manager" })
    async getDocuments(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        try {
            const documents = await this.managerService.getDocuments(managerId);
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

    @Post(":managerId/document")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation({ summary: "Add document for manager" })
    async addDocument(
        @Param("managerId") managerId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createDocumentDto: CreateDocumentDto,
        @Res() res: Response
    ) {
        try {
            const addedDocument = await this.managerService.addDocument(
                managerId,
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

    @Patch(":managerId/:documentId/document")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation({ summary: "Update document for manager" })
    async updateDocument(
        @Param("managerId") managerId: string,
        @Param("documentId") documentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateDocumentDto: UpdateDocumentDto,
        @Res() res: Response
    ) {
        try {
            const updatedDocument = await this.managerService.updateDocument(
                managerId,
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

    @Get(":managerId/medical-files")
    @ApiOperation({ summary: "Get medical files for manager" })
    async getMedicalFiles(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        try {
            const medicalFiles =
                await this.managerService.getMedicalFiles(managerId);
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

    @Post(":managerId/medical-files")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation({ summary: "Add medical file for manager" })
    async addMedicalFile(
        @Param("managerId") managerId: string,
        @Body() createMedicalFileDto: CreateMedicalFileDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response
    ) {
        try {
            const addedMedicalFile = await this.managerService.addMedicalFile(
                managerId,
                file,
                createMedicalFileDto.description
            );
            return res.status(200).json({
                message: "Medical file added successfully",
                data: addedMedicalFile,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error occurred while adding medical file",
                error: error.message,
            });
        }
    }

    @Patch(":managerId/medical-files/:fileId")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
    )
    @ApiOperation({ summary: "Update medical file for manager" })
    async updateMedicalFile(
        @Param("managerId") managerId: string,
        @Param("fileId") fileId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateMedicalFileDto: UpdateMedicalFileDto,
        @Res() res: Response
    ) {
        try {
            const updatedMedicalFile =
                await this.managerService.updateMedicalFile(
                    managerId,
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

    @Get(":managerId/bank")
    @ApiOperation({ summary: "Get bank details for manager" })
    async getBankDetails(
        @Param("managerId") managerId: string,
        @Res() res: Response
    ) {
        try {
            const bankDetails =
                await this.managerService.getBankDetails(managerId);
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

    @Patch(":managerId/bank")
    @ApiOperation({ summary: "Update bank details for manager" })
    async updateBankDetails(
        @Param("managerId") managerId: string,
        @Body() updateDto: UpdateBankDetailsDto,
        @Res() res: Response
    ) {
        try {
            const updatedBankDetails =
                await this.managerService.updateBankDetails(
                    managerId,
                    updateDto
                );
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
}
