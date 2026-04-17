import {
    ConflictException,
    HttpStatus,
    Injectable,
    Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Manager } from "src/entities/manager.entity";
import { Branch } from "src/entities/branch.entity";
import { Contract } from "src/entities/contract.entity";
import { Academy } from "src/entities/academy.entity";
import { CreateManagerDTO } from "src/dto/manager/manager.dto";
import { UpdateManagerDTO } from "src/dto/manager/update-manager.dto";
import CustomResponseType from "src/types/customResponseType";
import {
    foundRes,
    newInstanceRes,
    deletedRes,
    notFoundRes,
    errorRes,
} from "src/lib/responses/restResponse";
import { S3Service } from "src/s3/s3.service";
import { PaginationParams } from "src/types/paginationParams";
import { User } from "src/entities/user.entity";
import { MailerService } from "src/mailer/mailer.service";
import { AuthUtil } from "src/lib/helpers/auth.util";
import { UserRole } from "src/enums/users.enum";
import {
    UpdateContractDto,
    CreateContractDto,
} from "src/dto/contracts/contract.dto";
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
import { MedicalFiles } from "src/entities/medical-files.entity";
import { MedicalHistory } from "src/entities/medical-history.entity";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { Documents } from "src/entities/documents.entity";
import { Team } from "src/entities/team.entity";

@Injectable()
export class ClubManagerService {
    private readonly logger = new Logger(ClubManagerService.name);

    constructor(
        @InjectRepository(Manager)
        private readonly managerRepo: Repository<Manager>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly mailerService: MailerService,
        @InjectRepository(Branch)
        private readonly branchRepo: Repository<Branch>,
        @InjectRepository(Contract)
        private readonly contractRepo: Repository<Contract>,
        @InjectRepository(Academy)
        private readonly academyRepo: Repository<Academy>,
        private readonly s3Service: S3Service
    ) {}

    /**
     * Helper method to check if a status code represents success
     * @param status HTTP status code
     * @returns boolean indicating if the status code represents success
     */
    private isSuccessStatus(status: number): boolean {
        return status >= 200 && status < 300;
    }

    private async signAvatarUrls(data: any): Promise<any> {
        if (!data) return data;

        // Handle array of managers
        if (Array.isArray(data)) {
            return Promise.all(data.map((item) => this.signAvatarUrls(item)));
        }

        // Handle single manager object
        if (data.avatar) {
            data.avatar = await this.s3Service.getFileUrl(data.avatar);
        }
        if (data.user?.avatar) {
            data.user.avatar = await this.s3Service.getFileUrl(
                data.user.avatar
            );
        }

        return data;
    }

    async getManagers(
        academyId: string,
        branchId?: string,
        paginationParams?: PaginationParams
    ): Promise<{ data: Manager[]; total: number }> {
        try {
            const page = paginationParams?.page || 1;
            const limit = paginationParams?.limit || 10;
            const skip = (page - 1) * limit;

            const query = this.managerRepo
                .createQueryBuilder("manager")
                .leftJoinAndSelect("manager.academy", "academy")
                .leftJoinAndSelect("manager.branch", "branch")
                .leftJoinAndSelect("manager.contract", "contract")
                .leftJoin("manager.user", "user")
                .addSelect("user.role")
                .where("academy.id = :academyId", { academyId });

            if (branchId) {
                query.andWhere("branch.id = :branchId", { branchId });
            }

            query.skip(skip).take(limit);

            const [data, total] = await query.getManyAndCount();

            // Sign all avatar URLs
            const signedData = await this.signAvatarUrls(data);

            return { data: signedData, total };
        } catch (error) {
            this.logger.error(
                `Error fetching managers: ${error.message}`,
                error.stack
            );
            throw errorRes(`Error fetching managers: ${error.message}`);
        }
    }

    async getManagerById(id: string): Promise<CustomResponseType<Manager>> {
        try {
            this.logger.debug(`Fetching manager with ID: ${id}`);

            const manager = await this.managerRepo.findOne({
                where: { id },
                relations: ["user", "academy", "contract", "branch", "playingFor"], // Expanded relations
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${id}" not found.`);
            }

            // Ensure manager data includes educationalLevel and languages
            const enhancedManager = {
                ...manager,
                // For backward compatibility
                levelEducation: manager.educationalLevel
            };

            // Sign avatar URLs
            const signedManager = await this.signAvatarUrls(enhancedManager);

            return foundRes("Manager fetched successfully", signedManager);
        } catch (error) {
            this.logger.error(
                `Error fetching manager with ID: ${id}. Error type: ${error.constructor.name}`,
                error.stack
            );
            return errorRes(`Error fetching manager: ${error.message}`);
        }
    }

    async createManager(
        academyId: string,
        createDto: CreateManagerDTO,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Starting manager creation for academy: ${academyId}`);
        try {
            const academy = await this.academyRepo.findOne({
                where: { id: academyId },
            });
            if (!academy) {
                this.logger.warn(`Academy with ID "${academyId}" not found.`);
                return notFoundRes(`Academy with ID "${academyId}" not found.`);
            }

            this.logger.log(`Checking for existing email: ${createDto.email}`);
            const existingUserByEmail = await this.userRepository.findOne({
                where: { email: createDto.email },
            });
            if (existingUserByEmail) {
                this.logger.warn(`Email already exists: ${createDto.email}`);
                throw new ConflictException("Email already exists.");
            }

            this.logger.log(
                `Checking for existing username: ${createDto.username}`
            );
            const existingUserByUsername = await this.userRepository.findOne({
                where: { username: createDto.username },
            });
            if (existingUserByUsername) {
                this.logger.warn(
                    `Username already exists: ${createDto.username}`
                );
                throw new ConflictException("Username already exists.");
            }

            this.logger.log(`Hashing password for user: ${createDto.username}`);
            const hashedPassword = await AuthUtil.hashPassword(
                createDto.password
            );

            return await this.managerRepo.manager.transaction(
                async (transactionalEntityManager) => {
                    this.logger.log("Starting transaction to create manager");

                    try {
                        if (avatar) {
                            this.logger.log("Processing avatar upload to S3");
                            const s3Path = this.generateS3Path(
                                createDto.firstName
                            );
                            createDto.avatar = await this.s3Service.uploadFile(
                                s3Path,
                                avatar
                            );
                            this.logger.log(
                                `Avatar uploaded successfully: ${createDto.avatar}`
                            );
                        }

                        this.logger.log("Creating user account");
                        const user = this.userRepository.create({
                            email: createDto.email,
                            username: createDto.username,
                            password: hashedPassword,
                            role: createDto.position as UserRole,
                            avatar: createDto.avatar || null,
                            academy,
                        });
                        const savedUser =
                            await transactionalEntityManager.save(user);
                        this.logger.log(
                            `User account created with ID: ${savedUser.id}`
                        );

                        this.logger.log("Creating manager record");
                        const manager = this.managerRepo.create({
                            ...createDto,
                            academy,
                            user: savedUser,
                        });

                        const savedManager =
                            await transactionalEntityManager.save(manager);
                        this.logger.log(
                            `Manager record created with ID: ${savedManager.id}`
                        );

                        try {
                            this.logger.log(
                                `Sending registration email to: ${createDto.email}`
                            );
                            await this.mailerService.sendRegistrationEmail(
                                createDto.email,
                                createDto.username,
                                academy.name
                            );
                            this.logger.log(
                                "Registration email sent successfully"
                            );
                        } catch (emailError) {
                            // Don't fail manager creation if email fails
                            this.logger.error(
                                `Failed to send registration email: ${emailError.message}`
                            );
                        }

                        this.logger.log(
                            "Manager creation completed successfully"
                        );
                        return newInstanceRes("Manager created successfully", {
                            manager: savedManager,
                        });
                    } catch (txError) {
                        this.logger.error(
                            `Transaction failed: ${txError.message}`,
                            txError.stack
                        );
                        throw txError;
                    }
                }
            );
        } catch (error) {
            this.logger.error(
                `Error creating manager: ${error.message}`,
                error.stack
            );

            if (error instanceof ConflictException) {
                return errorRes(error.message);
            }

            return errorRes(`Error creating manager: ${error.message}`);
        }
    }

    async updateManager(
        academyId: string,
        id: string,
        updateDto: UpdateManagerDTO,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<Manager>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id },
                relations: ["academy", "branch", "contract"],
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${id}" not found.`);
            }

            if (avatar) {
                const s3Path = this.generateS3Path(updateDto.firstName);
                if (manager.avatar) {
                    await this.s3Service.deleteFile(manager.avatar);
                }
                updateDto.avatar = await this.s3Service.uploadFile(
                    s3Path,
                    avatar
                );
            }

            if (academyId) {
                const academy = await this.academyRepo.findOne({
                    where: { id: academyId },
                });
                if (!academy) {
                    return notFoundRes(
                        `Academy with ID "${academyId}" not found.`
                    );
                }
                manager.academy = academy;
            }

            const updatedManager = this.managerRepo.merge(manager, updateDto);
            const savedManager = await this.managerRepo.save(updatedManager);

            return foundRes("Manager updated successfully", savedManager);
        } catch (error) {
            this.logger.error("Error updating manager:", error.stack);
            return errorRes(`Error updating manager: ${error.message}`);
        }
    }

    async deleteManager(id: string): Promise<CustomResponseType<null>> {
        try {
            const manager = await this.managerRepo.findOne({ where: { id } });
            if (!manager) {
                return notFoundRes(`Manager with ID "${id}" not found.`);
            }

            await this.managerRepo.remove(manager);

            return deletedRes("Manager deleted successfully", null);
        } catch (error) {
            this.logger.error("Error deleting manager:", error.stack);
            return errorRes(`Error deleting manager: ${error.message}`);
        }
    }

    private generateS3Path(fileName: string): string {
        const sanitizedFileName = fileName
            .replace(/[^a-zA-Z0-9_-]/g, "")
            .toLowerCase();
        const timestamp = Date.now();
        return `managers/${sanitizedFileName}-${timestamp}/avatar.png`;
    }

    async getContract(
        managerId: string
    ): Promise<CustomResponseType<Contract>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["contract"],
            });
            if (!manager) {
                this.logger.warn(`Manager with ID ${managerId} not found`);
                return notFoundRes(`Manager with ID ${managerId} not found`);
            }
            if (!manager.contract) {
                this.logger.warn(`Contract for manager ${managerId} not found`);
                return notFoundRes(
                    `Contract for manager ${managerId} not found`
                );
            }

            if (manager.contract.contractUrl) {
                manager.contract.contractUrl = await this.s3Service.getFileUrl(
                    manager.contract.contractUrl
                );
            }
            return foundRes(
                "Contract retrieved successfully",
                manager.contract
            );
        } catch (error) {
            this.logger.error(
                `Error retrieving contract for manager ${managerId}`,
                error.stack
            );
            return errorRes(`Error retrieving contract: ${error.message}`);
        }
    }

    async updateContract(
        managerId: string,
        updateContractDto: UpdateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["contract"],
            });
            if (!manager) {
                this.logger.warn(`Manager with ID ${managerId} not found`);
                return notFoundRes(`Manager with ID ${managerId} not found`);
            }
            if (!manager.contract) {
                this.logger.warn(`Contract for manager ${managerId} not found`);
                return notFoundRes(
                    `Contract for manager ${managerId} not found`
                );
            }
            const updatedContract = this.contractRepo.merge(
                manager.contract,
                updateContractDto
            );

            if (contractFile) {
                const s3Path = `contracts/${managerId}/${Date.now()}`;
                const fileUrl = await this.s3Service.uploadFile(
                    s3Path,
                    contractFile
                );
                updatedContract.contractUrl = fileUrl;
            }
            const savedContract = await this.contractRepo.save(updatedContract);
            return foundRes("Contract updated successfully", savedContract);
        } catch (error) {
            this.logger.error(
                `Error updating contract for manager ${managerId}`,
                error.stack
            );
            return errorRes(`Error updating contract: ${error.message}`);
        }
    }

    async createContract(
        managerId: string,
        createContractDto: CreateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["contract"],
            });
            if (!manager) {
                this.logger.warn(`Manager with ID ${managerId} not found`);
                return notFoundRes(`Manager with ID ${managerId} not found`);
            }
            let newContract = this.contractRepo.create(createContractDto);

            if (contractFile) {
                const contractUrl = await this.s3Service.uploadFile(
                    "contracts/",
                    contractFile
                );
                newContract.contractUrl = contractUrl;
            }

            const savedContract = await this.contractRepo.save(newContract);
            manager.contract = savedContract;
            await this.managerRepo.save(manager);

            return foundRes("Contract created successfully", savedContract);
        } catch (error) {
            this.logger.error(
                `Error creating contract for manager ${managerId}`,
                error.stack
            );
            return errorRes(`Error creating contract: ${error.message}`);
        }
    }

    async getPersonalInformation(id: string): Promise<CustomResponseType<any>> {
        this.logger.log(`Fetching personal information for manager ID: ${id}`);

        try {
            const personalInfo = await this.managerRepo
                .createQueryBuilder("manager")
                .leftJoinAndSelect("manager.playingFor", "team")
                .leftJoinAndSelect("manager.user", "user")
                .select([
                    "manager.id",
                    "manager.firstName",
                    "manager.lastName",
                    "user.role",
                    "manager.country",
                    "manager.languages",
                    "manager.gender",
                    "manager.birthday",
                    "manager.avatar",
                    "manager.height",
                    "manager.weight",
                    "manager.nationality",
                    "manager.educationalLevel",
                    "manager.schoolName",
                    "manager.joinDate",
                    "manager.experience",
                    "manager.nationalId",
                    "manager.nationalIdExpiration",
                    "team.id",
                    "team.name",
                    "team.branch",
                    "team.updatedAt",
                    "team.createdAt",
                    "team.creationDate",
                ])
                .where("manager.id = :id", { id })
                .getOne();

            if (!personalInfo) {
                this.logger.warn(`Manager with ID "${id}" not found.`);
                return notFoundRes(`Manager with ID "${id}" not found`);
            }

            if (personalInfo.avatar) {
                personalInfo.avatar = await this.s3Service.getFileUrl(
                    personalInfo.avatar
                );
            }

            // Transform the response to ensure proper field mapping for client
            const responseData = {
                ...personalInfo,
                // For backward compatibility, include both educationalLevel and levelEducation
                levelEducation: personalInfo.educationalLevel
            };

            this.logger.log(
                `Fetched personal information for manager ID: ${id}`
            );
            return foundRes(
                "Personal information fetched successfully",
                responseData
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching personal information for manager ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updatePersonalInformation(
        id: string,
        updateDto: UpdatePersonalInformationDto,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<Manager>> {
        this.logger.log(`Updating personal information for manager ID: ${id}`);

        try {
            const manager = await this.managerRepo.findOne({
                where: { id },
                relations: ["user", "playingFor"],
            });

            if (!manager) {
                this.logger.warn(`Manager with ID "${id}" not found`);
                return notFoundRes(`Manager with ID "${id}" not found`);
            }

            if (avatar) {
                if (manager.avatar) {
                    try {
                        await this.s3Service.deleteFile(manager.avatar);
                        this.logger.log(
                            `Deleted old avatar from S3: ${manager.avatar}`
                        );
                    } catch (error) {
                        this.logger.warn(
                            `Failed to delete avatar from S3: ${manager.avatar}`,
                            error.stack
                        );
                    }
                }

                try {
                    const s3Path = `managers/${id}/${Date.now()}-avatar`;
                    const newAvatarUrl = await this.s3Service.uploadFile(
                        s3Path,
                        avatar
                    );

                    manager.avatar = newAvatarUrl;
                    if (manager.user) {
                        manager.user.avatar = newAvatarUrl;
                    }

                    this.logger.log(
                        `Uploaded new avatar to S3: ${newAvatarUrl}`
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to upload new avatar for Manager ID: ${id}`,
                        error.stack
                    );
                    return errorRes(
                        "Failed to upload new avatar. Please try again."
                    );
                }
            }

            if (updateDto.playingFor) {
                const team = await this.managerRepo.manager.findOne(Team, {
                    where: { id: updateDto.playingFor },
                });

                if (!team) {
                    this.logger.warn(
                        `Team with ID "${updateDto.playingFor}" not found`
                    );
                    return notFoundRes(
                        `Team with ID "${updateDto.playingFor}" not found`
                    );
                }

                manager.playingFor = team;
            }

            // Map levelEducation to educationalLevel if it exists
            if (updateDto.levelEducation !== undefined) {
                manager.educationalLevel = updateDto.levelEducation;
            }

            // Ensure languages are properly processed
            if (updateDto.languages !== undefined) {
                manager.languages = updateDto.languages;
            }

            // Update all other fields from the DTO
            Object.entries(updateDto).forEach(([key, value]) => {
                if (
                    key !== "playingFor" && 
                    key !== "levelEducation" && 
                    key !== "languages" && 
                    value !== undefined
                ) {
                    if (key === "nationalIdExpiration") {
                        manager.nationalIdExpiration = new Date(value);
                    } else {
                        (manager as any)[key] = value;
                    }
                }
            });

            const updatedManager = await this.managerRepo.save(manager);

            this.logger.log(
                `Personal information for manager ID: ${id} updated successfully`
            );
            return foundRes(
                "Personal information updated successfully",
                updatedManager
            );
        } catch (error) {
            this.logger.error(
                `Error updating personal information for manager ID: ${id}`,
                error.stack
            );
            return errorRes(
                "An error occurred while updating personal information"
            );
        }
    }

    async getContactDetails(
        managerId: string
    ): Promise<CustomResponseType<any>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            const responsePayload = {
                id: manager.id,
                firstName: manager.firstName,
                lastName: manager.lastName,
                phone: manager.phone,
                emergencyPhone: manager.emergencyPhone,
                nationalId: manager.nationalId,
                nationalIdExpiration: manager.nationalIdExpiration,
                relationship: manager.relationship,
            };

            return foundRes(
                "Contact details fetched successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error fetching contact details for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateContactDetails(
        managerId: string,
        updateDto: UpdateContactDto
    ): Promise<CustomResponseType<any>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            Object.assign(manager, updateDto);

            await this.managerRepo.save(manager);

            return foundRes("Contact details updated successfully", manager);
        } catch (error) {
            this.logger.error(
                `Error updating contact details for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getMedicalHistory(
        managerId: string
    ): Promise<CustomResponseType<MedicalHistory[]>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["medicalHistory"],
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            return foundRes(
                "Medical history fetched successfully",
                manager.medicalHistory
            );
        } catch (error) {
            this.logger.error(
                `Error fetching medical history for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async addMedicalHistory(
        managerId: string,
        body: { date: string; type: string; description: string }
    ): Promise<CustomResponseType<MedicalHistory>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            const newHistory = this.managerRepo.manager.create(MedicalHistory, {
                ...body,
                manager,
            });

            const savedHistory = await this.managerRepo.manager.save(
                MedicalHistory,
                newHistory
            );

            return foundRes(
                "Medical history record added successfully",
                savedHistory
            );
        } catch (error) {
            this.logger.error(
                `Error adding medical history for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateMedicalHistory(
        managerId: string,
        historyId: string,
        body: { date: string; type: string; description: string }
    ): Promise<CustomResponseType<MedicalHistory>> {
        try {
            const history = await this.managerRepo.manager.findOne(
                MedicalHistory,
                {
                    where: { id: historyId, manager: { id: managerId } },
                }
            );

            if (!history) {
                return notFoundRes(
                    `Medical history with ID "${historyId}" not found`
                );
            }

            Object.assign(history, body);

            const updatedHistory = await this.managerRepo.manager.save(
                MedicalHistory,
                history
            );

            return foundRes(
                "Medical history record updated successfully",
                updatedHistory
            );
        } catch (error) {
            this.logger.error(
                `Error updating medical history for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getDocuments(
        managerId: string
    ): Promise<CustomResponseType<Documents[]>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["documents"],
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            return foundRes(
                "Documents fetched successfully",
                manager.documents
            );
        } catch (error) {
            this.logger.error(
                `Error fetching documents for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async addDocument(
        managerId: string,
        file: Express.Multer.File,
        createDocumentDto: CreateDocumentDto
    ): Promise<CustomResponseType<Documents>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            const s3Path = `documents/${managerId}/${Date.now()}`;
            const fileUrl = await this.s3Service.uploadFile(s3Path, file);

            const document = this.managerRepo.manager.create(Documents, {
                manager,
                ...createDocumentDto,
                documentUrl: fileUrl,
            });

            const savedDocument = await this.managerRepo.manager.save(
                Documents,
                document
            );

            return foundRes("Document added successfully", savedDocument);
        } catch (error) {
            this.logger.error(
                `Error adding document for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateDocument(
        managerId: string,
        documentId: string,
        file: Express.Multer.File,
        updateDocumentDto: UpdateDocumentDto
    ): Promise<CustomResponseType<Documents>> {
        try {
            const document = await this.managerRepo.manager.findOne(Documents, {
                where: { id: documentId, manager: { id: managerId } },
            });

            if (!document) {
                return notFoundRes(
                    `Document with ID "${documentId}" not found`
                );
            }

            if (file) {
                const s3Path = `documents/${managerId}/${Date.now()}`;
                const newFileUrl = await this.s3Service.uploadFile(
                    s3Path,
                    file
                );

                if (document.documentUrl) {
                    await this.s3Service.deleteFile(document.documentUrl);
                }

                document.documentUrl = newFileUrl;
            }

            Object.assign(document, updateDocumentDto);

            const updatedDocument = await this.managerRepo.manager.save(
                Documents,
                document
            );

            return foundRes("Document updated successfully", updatedDocument);
        } catch (error) {
            this.logger.error(
                `Error updating document for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getMedicalFiles(
        managerId: string
    ): Promise<CustomResponseType<MedicalFiles[]>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["medicalFiles"],
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            return foundRes(
                "Medical files fetched successfully",
                manager.medicalFiles
            );
        } catch (error) {
            this.logger.error(
                `Error fetching medical files for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async addMedicalFile(
        managerId: string,
        file: Express.Multer.File,
        description?: string
    ): Promise<CustomResponseType<MedicalFiles>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            const s3Path = `medical-files/${managerId}/${Date.now()}`;
            const fileUrl = await this.s3Service.uploadFile(s3Path, file);

            const medicalFile = this.managerRepo.manager.create(MedicalFiles, {
                manager,
                fileName: file.originalname,
                fileUrl,
                description,
            });

            const savedMedicalFile = await this.managerRepo.manager.save(
                MedicalFiles,
                medicalFile
            );

            return foundRes(
                "Medical file added successfully",
                savedMedicalFile
            );
        } catch (error) {
            this.logger.error(
                `Error adding medical file for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateMedicalFile(
        managerId: string,
        fileId: string,
        file: Express.Multer.File,
        description?: string
    ): Promise<CustomResponseType<MedicalFiles>> {
        try {
            const medicalFile = await this.managerRepo.manager.findOne(
                MedicalFiles,
                {
                    where: { id: fileId, manager: { id: managerId } },
                }
            );

            if (!medicalFile) {
                return notFoundRes(
                    `Medical file with ID "${fileId}" not found`
                );
            }

            if (file) {
                const s3Path = `medical-files/${managerId}/${Date.now()}`;
                const newFileUrl = await this.s3Service.uploadFile(
                    s3Path,
                    file
                );

                if (medicalFile.fileUrl) {
                    await this.s3Service.deleteFile(medicalFile.fileUrl);
                }

                medicalFile.fileUrl = newFileUrl;
            }

            medicalFile.fileName = file?.originalname || medicalFile.fileName;
            medicalFile.description = description || medicalFile.description;

            const updatedMedicalFile = await this.managerRepo.manager.save(
                MedicalFiles,
                medicalFile
            );

            return foundRes(
                "Medical file updated successfully",
                updatedMedicalFile
            );
        } catch (error) {
            this.logger.error(
                `Error updating medical file for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getBankDetails(managerId: string): Promise<CustomResponseType<any>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["bankDetails"],
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            const bankDetails = manager.bankDetails
                ? {
                      accountHolder: manager.bankDetails.accountHolder,
                      iban: manager.bankDetails.iban,
                      bank: manager.bankDetails.bank,
                  }
                : null;

            return foundRes("Bank details fetched successfully", bankDetails);
        } catch (error) {
            this.logger.error(
                `Error fetching bank details for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateBankDetails(
        managerId: string,
        updateDto: UpdateBankDetailsDto
    ): Promise<CustomResponseType<any>> {
        try {
            const manager = await this.managerRepo.findOne({
                where: { id: managerId },
                relations: ["bankDetails"],
            });

            if (!manager) {
                return notFoundRes(`Manager with ID "${managerId}" not found`);
            }

            let updatedBankDetails: AthleteBankDetails;

            if (!manager.bankDetails) {
                const newBankDetails = this.managerRepo.manager.create(
                    AthleteBankDetails,
                    {
                        manager: { id: manager.id },
                        accountHolder: updateDto.accountHolder,
                        iban: updateDto.iban,
                        bank: updateDto.bank,
                    }
                );

                updatedBankDetails =
                    await this.managerRepo.manager.save(newBankDetails);
            } else {
                const existingBankDetails = manager.bankDetails;

                if (updateDto.accountHolder !== undefined) {
                    existingBankDetails.accountHolder = updateDto.accountHolder;
                }
                if (updateDto.iban !== undefined) {
                    existingBankDetails.iban = updateDto.iban;
                }
                if (updateDto.bank !== undefined) {
                    existingBankDetails.bank = updateDto.bank;
                }

                updatedBankDetails =
                    await this.managerRepo.manager.save(existingBankDetails);
            }

            return foundRes(
                "Bank details updated successfully",
                updatedBankDetails
            );
        } catch (error) {
            this.logger.error(
                `Error updating bank details for manager ID: ${managerId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }
}
