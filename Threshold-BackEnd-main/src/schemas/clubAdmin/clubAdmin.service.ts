import {
    Injectable,
    Logger,
    ConflictException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { ClubAdmin } from "src/entities/clubAdmin.entity";
import { User } from "src/entities/user.entity";
import { Academy } from "src/entities/academy.entity";
import { Branch } from "src/entities/branch.entity";
import CustomResponseType from "src/types/customResponseType";
import {
    foundRes,
    notFoundRes,
    errorRes,
    deletedRes,
} from "src/lib/responses/restResponse";
import { S3Service } from "src/s3/s3.service";
import { CreateClubAdminDto } from "src/dto/clubAdmin/create-club-admin.dto";
import { AuthUtil } from "src/lib/helpers/auth.util";
import { UpdateClubAdminDto } from "src/dto/clubAdmin/update-clubAdmin.dto";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import {
    IPaginationOptions,
    paginate,
    Pagination,
    PaginationTypeEnum,
} from "nestjs-typeorm-paginate";
import { PaginationMeta } from "src/types/paginationMeta.interface";
import { MedicalHistory } from "src/entities/medical-history.entity";
import { MedicalInformation } from "src/entities/medical-information.entity";
import { UpdateMedicalInformationDto } from "src/dto/clubCoaches/update-medical-information.dto";
import moment from "moment";
import { CreateDocumentDto } from "src/dto/clubCoaches/create-document.dto";
import { Documents } from "src/entities/documents.entity";
import { MedicalFiles } from "src/entities/medical-files.entity";
import { UpdateDocumentDto } from "src/dto/clubCoaches/update-document.dto";
import { UpdateBankDetailsDto } from "src/dto/clubCoaches/update-bank-details.dto";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { UpdateContactDto } from "src/dto/clubCoaches/update-contract.dto";
import { UpdatePersonalInformationDto } from "src/dto/clubAdmin/update-personal-information.dto";
import { Team } from "src/entities/team.entity";
import { Contract } from "src/entities/contract.entity";
import {
    UpdateContractDto,
    CreateContractDto,
} from "src/dto/contracts/contract.dto";

@Injectable()
export class ClubAdminService {
    private readonly logger = new Logger(ClubAdminService.name);

    constructor(
        @InjectRepository(ClubAdmin)
        private readonly clubAdminRepository: Repository<ClubAdmin>,
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
        private readonly s3Service: S3Service
    ) {}

    private generateS3Path(adminName: string): string {
        const timestamp = Date.now();
        return `clubAdmins/${adminName}-${timestamp}/avatar`;
    }

    async getContactDetails(id: string): Promise<CustomResponseType<any>> {
        this.logger.log(`Fetching contact details for ClubAdmin ID: ${id}`);

        try {
            const clubAdmin = await this.clubAdminRepository.findOne({
                where: { id },
            });

            if (!clubAdmin) {
                this.logger.warn(`ClubAdmin with ID "${id}" not found.`);
                return notFoundRes(`ClubAdmin with ID "${id}" not found`);
            }

            const responsePayload = {
                id: clubAdmin.id,
                firstName: clubAdmin.firstName,
                lastName: clubAdmin.lastName,
                phone: clubAdmin.phone,
                emergencyPhone: clubAdmin.emergencyPhone,
                nationalId: clubAdmin.nationalId,
                nationalIdExpiration: clubAdmin.nationalIdExpiration,
                relationship: clubAdmin.relationship,
            };

            this.logger.log(`Contact details for ClubAdmin ID: ${id} fetched.`);
            return foundRes(
                "Contact details fetched successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching contact details for ClubAdmin ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateContactDetails(
        id: string,
        updateDto: UpdateContactDto
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Updating contact details for ClubAdmin ID: ${id}`);

        try {
            const clubAdmin = await this.clubAdminRepository.findOne({
                where: { id },
            });

            if (!clubAdmin) {
                this.logger.warn(`ClubAdmin with ID "${id}" not found.`);
                return notFoundRes(`ClubAdmin with ID "${id}" not found`);
            }

            if (updateDto.phone) {
                clubAdmin.phone = updateDto.phone;
            }
            if (updateDto.emergencyPhone) {
                clubAdmin.emergencyPhone = updateDto.emergencyPhone;
            }
            if (updateDto.nationalId) {
                clubAdmin.nationalId = updateDto.nationalId;
            }
            if (updateDto.nationalIdExpiration) {
                clubAdmin.nationalIdExpiration = updateDto.nationalIdExpiration;
            }
            if (updateDto.relationship) {
                clubAdmin.relationship = updateDto.relationship;
            }

            await this.clubAdminRepository.save(clubAdmin);

            const responsePayload = {
                clubAdmin: {
                    id: clubAdmin.id,
                    firstName: clubAdmin.firstName,
                    lastName: clubAdmin.lastName,
                    phone: clubAdmin.phone,
                    emergencyPhone: clubAdmin.emergencyPhone,
                    nationalId: clubAdmin.nationalId,
                    nationalIdExpiration: clubAdmin.nationalIdExpiration,
                    relationship: clubAdmin.relationship,
                },
            };

            this.logger.log(
                `Contact details for ClubAdmin ID: ${id} updated successfully.`
            );
            return foundRes(
                "Contact details updated successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while updating contact details for ClubAdmin ID: ${id}`,
                error.stack
            );

            if (error.code === "23505") {
                return errorRes(
                    "Duplicate entry detected. Please check the provided national ID."
                );
            }

            return errorRes("An unexpected error occurred");
        }
    }

    async updatePersonalInformation(
        id: string,
        updateDto: UpdatePersonalInformationDto,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<ClubAdmin>> {
        this.logger.log(
            `Updating personal information for ClubAdmin with ID: ${id}`
        );

        try {
            const clubAdmin = await this.clubAdminRepository.findOne({
                where: { id },
                relations: ["academy", "branch", "playingFor", "user"],

                select: {
                    user: {
                        id: true,
                        avatar: true,
                        username: true,
                    },
                },
            });

            if (!clubAdmin) {
                this.logger.warn(`ClubAdmin with ID "${id}" not found`);
                return notFoundRes(`ClubAdmin with ID "${id}" not found`);
            }

            if (avatar) {
                if (clubAdmin.user?.avatar) {
                    try {
                        await this.s3Service.deleteFile(clubAdmin.user.avatar);
                        this.logger.log(
                            `Deleted old avatar from S3: ${clubAdmin.user.avatar}`
                        );
                    } catch (error) {
                        this.logger.warn(
                            `Failed to delete avatar from S3: ${clubAdmin.user.avatar}`,
                            error.stack
                        );
                    }
                }

                try {
                    const s3Path = `clubAdmins/${id}/${Date.now()}-avatar`;
                    const newAvatarUrl = await this.s3Service.uploadFile(
                        s3Path,
                        avatar
                    );

                    clubAdmin.user.avatar = newAvatarUrl;
                    clubAdmin.avatarUrl = newAvatarUrl;

                    this.logger.log(
                        `Uploaded new avatar to S3: ${newAvatarUrl}`
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to upload new avatar for ClubAdmin ID: ${id}`,
                        error.stack
                    );
                    return errorRes(
                        "Failed to upload new avatar. Please try again."
                    );
                }
            }

            if (updateDto.playingFor) {
                const team = await this.clubAdminRepository.manager.findOne(
                    Team,
                    {
                        where: { id: updateDto.playingFor },
                    }
                );

                if (!team) {
                    this.logger.warn(
                        `Team with ID "${updateDto.playingFor}" not found`
                    );
                    return notFoundRes(
                        `Team with ID "${updateDto.playingFor}" not found`
                    );
                }

                clubAdmin.playingFor = team;
            }

            // Handle nationalId and nationalIdExpiration specifically
            if (updateDto.nationalId !== undefined) {
                clubAdmin.nationalId = updateDto.nationalId;
            }

            if (updateDto.nationalIdExpiration !== undefined) {
                clubAdmin.nationalIdExpiration = new Date(
                    updateDto.nationalIdExpiration
                );
            }

            // Update all other fields from the DTO
            Object.entries(updateDto).forEach(([key, value]) => {
                if (
                    key !== "playingFor" &&
                    key !== "nationalId" &&
                    key !== "nationalIdExpiration" &&
                    value !== undefined
                ) {
                    (clubAdmin as any)[
                        key as keyof UpdatePersonalInformationDto
                    ] = value;
                }
            });

            const updatedClubAdmin =
                await this.clubAdminRepository.save(clubAdmin);

            this.logger.log(
                `Personal information for ClubAdmin ID: ${id} updated successfully`
            );
            return foundRes(
                "Personal information updated successfully",
                updatedClubAdmin
            );
        } catch (error) {
            this.logger.error(
                `Error updating personal information for ClubAdmin ID: ${id}`,
                error.stack
            );
            return errorRes(
                "An error occurred while updating personal information"
            );
        }
    }

    async getPersonalInformation(
        id: string
    ): Promise<CustomResponseType<Partial<ClubAdmin>>> {
        this.logger.log(`Fetching personal information for admin ID: ${id}`);

        try {
            const personalInfo = await this.clubAdminRepository
                .createQueryBuilder("admin")
                .leftJoinAndSelect("admin.playingFor", "team")
                .leftJoinAndSelect("admin.user", "user")
                .select([
                    "admin.id",
                    "admin.firstName",
                    "admin.lastName",
                    "user.role",
                    "admin.languages",
                    "admin.gender",
                    "admin.birthday",
                    "admin.avatarUrl",
                    "admin.height",
                    "admin.weight",
                    "admin.nationality",
                    "admin.levelEducation",
                    "admin.schoolName",
                    "admin.joinDate",
                    "admin.experience",
                    "admin.nationalId",
                    "admin.nationalIdExpiration",
                    "team.id",
                    "team.name",
                    "team.branch",
                    "team.updatedAt",
                    "team.createdAt",
                    "team.creationDate",
                ])
                .where("admin.id = :id", { id })
                .getOne();

            if (!personalInfo) {
                this.logger.warn(`admin with ID "${id}" not found.`);
                return notFoundRes(`admin with ID "${id}" not found`);
            }

            personalInfo.avatarUrl = personalInfo.avatarUrl
                ? await this.s3Service.getFileUrl(personalInfo.avatarUrl)
                : null;

            const enhancedPersonalInfo = {
                ...personalInfo,
                // Include Arabic label in the field name for better frontend display
                nationalId_ar: "رقم الهوية الوطنية/الإقامة",
                nationalIdExpirationDate_ar:
                    "تاريخ انتهاء الهوية الوطنية/الإقامة",
            };

            this.logger.log(`Fetched personal information for admin ID: ${id}`);

            return foundRes(
                "Personal information fetched successfully",
                enhancedPersonalInfo
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching personal information for admin ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateBankDetails(
        id: string,
        updateDto: UpdateBankDetailsDto
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Updating bank details for admin ID: ${id}`);

        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!admin) {
                this.logger.warn(`Admin with ID "${id}" not found.`);
                return notFoundRes(`Admin with ID "${id}" not found`);
            }

            let updatedBankDetails: AthleteBankDetails;

            if (!admin.bankDetails) {
                const newBankDetails = this.clubAdminRepository.manager.create(
                    AthleteBankDetails,
                    {
                        clubAdmin: { id: admin.id },
                        accountHolder: updateDto.accountHolder,
                        iban: updateDto.iban,
                        bank: updateDto.bank,
                    }
                );

                updatedBankDetails =
                    await this.clubAdminRepository.manager.save(newBankDetails);
                this.logger.log(
                    `Initialized new bank details for admin ID: ${id}`
                );
            } else {
                const existingBankDetails = admin.bankDetails;

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
                    await this.clubAdminRepository.manager.save(
                        existingBankDetails
                    );
                this.logger.log(`Updated bank details for admin ID: ${id}`);
            }

            const responsePayload = {
                bankDetails: {
                    accountHolder: updatedBankDetails.accountHolder,
                    iban: updatedBankDetails.iban,
                    bank: updatedBankDetails.bank,
                },
                admin: {
                    id: admin.id,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                },
            };

            this.logger.log(`Bank details for admin ID: ${id} updated.`);
            return foundRes(
                "Bank details updated successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while updating bank details for admin ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateMedicalFile(
        fileId: string,
        file: Express.Multer.File,
        description?: string
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Updating medical file with ID: ${fileId}`);

        try {
            const medicalFile = await this.clubAdminRepository.manager.findOne(
                MedicalFiles,
                { where: { id: fileId }, relations: ["admin"] }
            );

            if (!medicalFile) {
                this.logger.warn(`Medical file with ID "${fileId}" not found`);
                return notFoundRes(
                    `Medical file with ID "${fileId}" not found`
                );
            }

            let updatedFileUrl = medicalFile.fileUrl;

            if (file) {
                const s3Key = `medical-files/${medicalFile.clubAdmin.id}/${Date.now()}-${file.originalname}`;
                updatedFileUrl = await this.s3Service.uploadFile(s3Key, file);

                if (medicalFile.fileUrl) {
                    await this.s3Service.deleteFile(medicalFile.fileUrl);
                    this.logger.log(
                        `Old file deleted from S3 for medical file ID: ${fileId}`
                    );
                }

                this.logger.log(
                    `New file uploaded to S3 for medical file ID: ${fileId}: ${updatedFileUrl}`
                );
            }

            medicalFile.fileName = file?.originalname || medicalFile.fileName;
            medicalFile.fileUrl = updatedFileUrl;
            medicalFile.description = description || medicalFile.description;

            const updatedMedicalFile =
                await this.clubAdminRepository.manager.save(
                    MedicalFiles,
                    medicalFile
                );

            this.logger.log(
                `Medical file with ID: ${fileId} updated successfully.`
            );
            return foundRes(
                "Medical file updated successfully",
                updatedMedicalFile
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while updating medical file with ID: ${fileId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }
    async getMedicalFiles(adminId: string): Promise<CustomResponseType<any>> {
        this.logger.log(`Fetching medical files for admin ID: ${adminId}`);

        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
                relations: ["medicalFiles"],
            });

            if (!admin) {
                this.logger.warn(`Admin with ID "${adminId}" not found.`);
                return notFoundRes(`Admin with ID "${adminId}" not found`);
            }

            const medicalFiles = await Promise.all(
                admin.medicalFiles.map(async (file) => ({
                    id: file.id,
                    fileName: file.fileName,
                    fileUrl: await this.s3Service.getFileUrl(file.fileUrl),
                    createdAt: file.createdAt,
                }))
            );

            this.logger.log(`Medical files for admin ID: ${adminId} fetched.`);
            return foundRes("Medical files fetched successfully", medicalFiles);
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching medical files for admin ID: ${adminId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateDocument(
        adminId: string,
        documentId: string,
        file: Express.Multer.File,
        updateDocumentDto: UpdateDocumentDto
    ): Promise<CustomResponseType<Documents>> {
        this.logger.log(
            `Updating document with ID: ${documentId} for admin ID: ${adminId}`
        );

        try {
            const document = await this.clubAdminRepository.manager.findOne(
                Documents,
                {
                    where: { id: documentId, clubAdmin: { id: adminId } },
                }
            );

            if (!document) {
                this.logger.warn(
                    `Document with ID "${documentId}" not found for admin ID: ${adminId}`
                );
                return notFoundRes("Document not found");
            }

            if (file) {
                const s3Path = `documents/${adminId}/${Date.now()}`;
                const newFileUrl = await this.s3Service.uploadFile(
                    s3Path,
                    file
                );

                if (document.documentUrl) {
                    await this.s3Service.deleteFile(document.documentUrl);
                    this.logger.log(
                        `Deleted old file from S3: ${document.documentUrl}`
                    );
                }

                document.documentUrl = newFileUrl;
            }

            document.type = updateDocumentDto.type || document.type;

            const updatedDocument = await this.clubAdminRepository.manager.save(
                Documents,
                document
            );

            this.logger.log(
                `Document with ID: ${documentId} updated successfully.`
            );
            return foundRes("Document updated successfully", updatedDocument);
        } catch (error) {
            this.logger.error(
                `Error occurred while updating document with ID: ${documentId} for admin ID: ${adminId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getDocuments(
        adminId: string
    ): Promise<CustomResponseType<Documents[]>> {
        this.logger.log(`Fetching documents for admin ID: ${adminId}`);
        try {
            const documents = await this.clubAdminRepository.manager.find(
                Documents,
                {
                    where: { clubAdmin: { id: adminId } },
                    relations: ["clubAdmin"],
                }
            );

            if (!documents || documents.length === 0) {
                this.logger.warn(`No documents found for admin ID: ${adminId}`);
                return notFoundRes(
                    `No documents found for admin ID: ${adminId}`
                );
            }

            const updatedDocuments = await Promise.all(
                documents.map(async (document) => ({
                    id: document.id,
                    type: document.type,
                    documentUrl: await this.s3Service.getFileUrl(
                        document.documentUrl
                    ),
                    createdAt: document.createdAt,
                    updatedAt: document.updatedAt,
                    admin: document.clubAdmin,
                }))
            );

            this.logger.log(
                `Documents fetched successfully for admin ID: ${adminId}`
            );
            return foundRes("Documents fetched successfully", updatedDocuments);
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching documents for admin ID: ${adminId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async addMedicalFile(
        adminId: string,
        file: Express.Multer.File,
        description?: string
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Adding medical file for admin ID: ${adminId}`);

        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
            });
            if (!admin) {
                return notFoundRes(`Admin with ID "${adminId}" not found`);
            }

            const s3Key = `medical-files/${adminId}/${Date.now()}`;
            const fileUrl = await this.s3Service.uploadFile(s3Key, file);

            const medicalFile = this.clubAdminRepository.manager.create(
                MedicalFiles,
                {
                    admin,
                    fileName: file.originalname,
                    fileUrl,
                    description,
                }
            );
            const savedMedicalFile =
                await this.clubAdminRepository.manager.save(
                    MedicalFiles,
                    medicalFile
                );

            this.logger.log(`Medical file for admin ID: ${adminId} added.`);
            return foundRes(
                "Medical file added successfully",
                savedMedicalFile
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while adding medical file for admin ID: ${adminId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getMedicalInformation(
        adminId: string
    ): Promise<CustomResponseType<any>> {
        try {
            const admin = await this.clubAdminRepository.manager.findOne(
                ClubAdmin,
                {
                    where: { id: adminId },
                    relations: ["medicalInformation"],
                }
            );

            if (!admin) {
                return notFoundRes(`Admin with ID "${adminId}" not found`);
            }

            return foundRes("Medical information fetched successfully", {
                medicalInformation: admin.medicalInformation || null,
            });
        } catch (error) {
            throw new Error(
                `Error occurred while fetching medical information: ${error.message}`
            );
        }
    }
    async addDocument(
        adminId: string,
        file: Express.Multer.File,
        createDocumentDto: CreateDocumentDto
    ): Promise<CustomResponseType<Documents>> {
        this.logger.log(`Adding a new document for admin ID: ${adminId}`);
        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
            });

            if (!admin) {
                this.logger.warn(`Admin with ID "${adminId}" not found`);
                return notFoundRes(`Admin with ID "${adminId}" not found`);
            }

            const s3Path = `documents/${adminId}/${Date.now()}`;
            const fileUrl = await this.s3Service.uploadFile(s3Path, file);

            console.log("");
            const document = this.clubAdminRepository.manager.create(
                Documents,
                {
                    clubAdmin: admin,
                    ...createDocumentDto,
                    documentUrl: fileUrl,
                }
            );

            const savedDocument = await this.clubAdminRepository.manager.save(
                Documents,
                document
            );

            this.logger.log(
                `Document added successfully for admin ID: ${adminId}`
            );
            return foundRes("Document added successfully", savedDocument);
        } catch (error) {
            this.logger.error(
                `Error occurred while adding document for admin ID: ${adminId}`,
                error.stack
            );
            return errorRes("An error occurred while adding the document");
        }
    }

    async updateMedicalHistory(
        adminId: string,
        historyId: string,
        body: { date: string; type: string; description: string }
    ): Promise<MedicalHistory> {
        const history = await this.clubAdminRepository.manager.findOne(
            MedicalHistory,
            {
                where: { id: historyId, clubAdmin: { id: adminId } },
            }
        );

        if (!history) {
            throw new NotFoundException(
                `Medical history with ID ${historyId} not found`
            );
        }

        Object.assign(history, body);

        return this.clubAdminRepository.manager.save(MedicalHistory, history);
    }

    async getAdminDetails(adminId: string): Promise<any> {
        const admin = await this.clubAdminRepository.findOne({
            where: { id: adminId },
            relations: [
                "teams",
                "user",
                "contractDetails",
                "bankDetails",
                "playingFor",
                "teams.sessions",
                "teams.sportProfile",
            ],
        });

        if (!admin) {
            throw new NotFoundException(
                `ClubAdmin with ID "${adminId}" not found.`
            );
        }

        const age = admin.birthday ? this.calculateAge(admin.birthday) : null;

        const nextSessions = await this.getNextSessions(adminId);

        const teams = await Promise.all(
            admin.teams.map(async (team) => ({
                ...team,
                logo: team.logo
                    ? await this.s3Service.getFileUrl(team.logo)
                    : null,
            }))
        );

        const signedAvatarUrl = admin.avatarUrl
            ? await this.s3Service.getFileUrl(admin.avatarUrl)
            : null;

        return {
            ...admin,
            teams,
            id: admin.id,
            name: `${admin.firstName} ${admin.lastName}`,
            age: age ? `${age} Years Old` : "N/A",
            experience: admin.experience,
            nationality: admin.nationality,
            languages: admin.user?.language || "N/A",
            profile: {
                avatarUrl: signedAvatarUrl,
                type: admin.type || "N/A",
            },
            playingFor: admin.playingFor || "N/A",
            nextSessions: nextSessions?.length ? nextSessions : "N/A",
            contractDetails: admin.contractDetails || "N/A",
            bankDetails: admin.bankDetails || "N/A",
        };
    }

    async addMedicalHistory(
        adminId: string,
        body: { date: string; type: string; description: string }
    ): Promise<MedicalHistory> {
        const clubAdmin = await this.clubAdminRepository.findOne({
            where: { id: adminId },
        });

        if (!clubAdmin) {
            throw new NotFoundException(
                `ClubAdmin with ID ${adminId} not found`
            );
        }

        const newHistory = this.clubAdminRepository.manager.create(
            MedicalHistory,
            {
                ...body,
                clubAdmin,
            }
        );

        return this.clubAdminRepository.manager.save(
            MedicalHistory,
            newHistory
        );
    }
    async getBankDetails(id: string): Promise<CustomResponseType<any>> {
        this.logger.log(`Fetching bank details for ClubAdmin ID: ${id}`);

        try {
            const clubAdmin = await this.clubAdminRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!clubAdmin) {
                this.logger.warn(`ClubAdmin with ID "${id}" not found.`);
                return notFoundRes(`ClubAdmin with ID "${id}" not found`);
            }

            const bankDetails = clubAdmin.bankDetails
                ? {
                      accountHolder: clubAdmin.bankDetails.accountHolder,
                      iban: clubAdmin.bankDetails.iban,
                      bank: clubAdmin.bankDetails.bank,
                  }
                : null;

            const responsePayload = {
                bankDetails,
                clubAdmin: {
                    id: clubAdmin.id,
                    firstName: clubAdmin.firstName,
                    lastName: clubAdmin.lastName,
                },
            };

            this.logger.log(
                `Bank details for ClubAdmin ID: ${id} fetched successfully.`
            );
            return foundRes(
                "Bank details fetched successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching bank details for ClubAdmin ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateMedicalInformation(
        clubAdminId: string,
        updateDto: UpdateMedicalInformationDto
    ): Promise<CustomResponseType<any>> {
        try {
            const clubAdmin = await this.clubAdminRepository.manager.findOne(
                ClubAdmin,
                {
                    where: { id: clubAdminId },
                    relations: ["medicalInformation"],
                }
            );

            if (!clubAdmin) {
                return notFoundRes(
                    `ClubAdmin with ID "${clubAdminId}" not found`
                );
            }

            let medicalInformation: MedicalInformation;

            if (!clubAdmin.medicalInformation) {
                medicalInformation = this.clubAdminRepository.manager.create(
                    MedicalInformation,
                    {
                        ...updateDto,
                    }
                );

                medicalInformation =
                    await this.clubAdminRepository.manager.save(
                        medicalInformation
                    );

                clubAdmin.medicalInformation = medicalInformation;
                await this.clubAdminRepository.manager.save(
                    ClubAdmin,
                    clubAdmin
                );
            } else {
                medicalInformation = clubAdmin.medicalInformation;
                Object.assign(medicalInformation, updateDto);

                medicalInformation =
                    await this.clubAdminRepository.manager.save(
                        MedicalInformation,
                        medicalInformation
                    );
            }

            return foundRes("Medical information updated successfully", {
                medicalInformation,
            });
        } catch (error) {
            throw new Error(
                `Error occurred while updating medical information: ${error.message}`
            );
        }
    }

    async getMedicalHistory(clubAdminId: string): Promise<MedicalHistory[]> {
        const clubAdmin = await this.clubAdminRepository.findOne({
            where: { id: clubAdminId },
            relations: ["medicalHistory"],
        });

        if (!clubAdmin) {
            throw new NotFoundException(
                `ClubAdmin with ID ${clubAdminId} not found`
            );
        }

        return clubAdmin.medicalHistory;
    }

    async createUserForClubAdmin(
        createDto: CreateClubAdminDto,
        avatar?: Express.Multer.File,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<{ user: User; clubAdmin: ClubAdmin }>> {
        this.logger.log(
            `Starting user and club admin creation process for: ${createDto.firstName} ${createDto.lastName}`
        );

        try {
            return await this.clubAdminRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    let academyEntity: Academy = null;
                    if (createDto.academy) {
                        academyEntity =
                            await transactionalEntityManager.findOne(Academy, {
                                where: { id: createDto.academy },
                            });
                        if (!academyEntity) {
                            throw new ConflictException("Academy not found");
                        }
                    }

                    let branchEntity: Branch = null;
                    if (createDto.branch) {
                        branchEntity = await transactionalEntityManager.findOne(
                            Branch,
                            {
                                where: { id: createDto.branch },
                            }
                        );
                        if (!branchEntity) {
                            throw new ConflictException("Branch not found");
                        }
                    }

                    let sportClubProfile: sportClubProfiles = null;
                    if (sportClubProfileId) {
                        sportClubProfile =
                            await transactionalEntityManager.findOne(
                                sportClubProfiles,
                                {
                                    where: { id: sportClubProfileId },
                                }
                            );
                        if (!sportClubProfile) {
                            throw new ConflictException(
                                "SportClubProfile not found"
                            );
                        }
                    }

                    const existingUserByEmail =
                        await transactionalEntityManager.findOne(User, {
                            where: { email: createDto.email },
                        });
                    if (existingUserByEmail) {
                        this.logger.warn(
                            `Email conflict detected: ${createDto.email}`
                        );
                        throw new ConflictException("Email already exists");
                    }

                    const existingUserByUsername =
                        await transactionalEntityManager.findOne(User, {
                            where: { username: createDto.username },
                        });
                    if (existingUserByUsername) {
                        this.logger.warn(
                            `Username conflict detected: ${createDto.username}`
                        );
                        throw new ConflictException("Username already exists");
                    }

                    const hashedPassword = await AuthUtil.hashPassword(
                        createDto.password
                    );
                    this.logger.log("Password successfully hashed");

                    let avatarUrl: string = null;
                    if (avatar) {
                        const s3Path = this.generateS3Path(
                            `${createDto.firstName}-${createDto.lastName}`
                        );
                        avatarUrl = await this.s3Service.uploadFile(
                            s3Path,
                            avatar
                        );
                        this.logger.log(`Avatar uploaded to S3: ${avatarUrl}`);
                    }

                    const user = transactionalEntityManager.create(User, {
                        email: createDto.email,
                        password: hashedPassword,
                        username: createDto.username,
                        role: createDto.type,
                        avatar: avatarUrl,
                        academy: academyEntity,
                        branch: branchEntity,
                    });
                    const savedUser = await transactionalEntityManager.save(
                        User,
                        user
                    );
                    this.logger.log(
                        `User created successfully with ID: ${savedUser.id}`
                    );

                    const clubAdmin = transactionalEntityManager.create(
                        ClubAdmin,
                        {
                            ...createDto,
                            user: savedUser,
                            academy: academyEntity,
                            branch: branchEntity,
                            sportProfile: sportClubProfile,
                            avatarUrl,
                        }
                    );
                    const savedClubAdmin =
                        await transactionalEntityManager.save(
                            ClubAdmin,
                            clubAdmin
                        );
                    this.logger.log(
                        `ClubAdmin created successfully with ID: ${savedClubAdmin.id}`
                    );

                    return foundRes("User and ClubAdmin created successfully", {
                        user: savedUser,
                        clubAdmin: savedClubAdmin,
                    });
                }
            );
        } catch (error) {
            this.logger.error(
                "Error occurred during user and ClubAdmin creation process",
                error.stack
            );

            if (error instanceof ConflictException) {
                return errorRes(error.message);
            }

            return errorRes("An unexpected error occurred");
        }
    }

    async getClubAdmins(
        search?: string,
        sportClubProfileId?: string,
        page: number = 1,
        limit: number = 10,
        sortField: string = "firstName",
        sortOrder: "ASC" | "DESC" = "ASC"
    ): Promise<
        CustomResponseType<{ items: ClubAdmin[]; meta: PaginationMeta }>
    > {
        try {
            this.logger.log(
                `Fetching club admins with search: ${search || "None"}, sportClubProfileId: ${sportClubProfileId || "None"}, page: ${page}, limit: ${limit}, sortField: ${sortField}, sortOrder: ${sortOrder}`
            );

            const queryBuilder = this.clubAdminRepository
                .createQueryBuilder("clubAdmin")
                .leftJoinAndSelect("clubAdmin.user", "user")
                .leftJoinAndSelect("clubAdmin.teams", "team")
                .leftJoinAndSelect("clubAdmin.academy", "academy")
                .leftJoinAndSelect("clubAdmin.branch", "branch")
                .leftJoinAndSelect("clubAdmin.sportProfile", "sportProfile")
                .where("clubAdmin.sportProfile = :sportClubProfileId", {
                    sportClubProfileId,
                });

            if (search) {
                queryBuilder.andWhere(
                    "clubAdmin.firstName ILIKE :search OR clubAdmin.lastName ILIKE :search",
                    { search: `%${search}%` }
                );
            }

            const allowedSortFields = [
                "firstName",
                "lastName",
                "experience",
                "createdAt",
                "joinDate",
            ];
            if (!allowedSortFields.includes(sortField)) {
                sortField = "firstName";
            }
            queryBuilder.orderBy(`clubAdmin.${sortField}`, sortOrder);

            const options: IPaginationOptions = {
                page,
                limit,
            };

            const totalItems = await queryBuilder.getCount();

            const paginatedResults: Pagination<ClubAdmin> =
                await paginate<ClubAdmin>(queryBuilder as any, {
                    ...options,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    metaTransformer: ({
                        currentPage,
                        itemCount,
                        itemsPerPage,
                    }) => {
                        const totalPages = Math.round(
                            totalItems / itemsPerPage
                        );
                        return {
                            currentPage,
                            itemCount,
                            itemsPerPage,
                            totalPages: totalPages === 0 ? 1 : totalPages,
                            totalItems,
                        };
                    },
                });

            await Promise.all(
                paginatedResults.items.map(async (admin) => {
                    if (admin.avatarUrl) {
                        admin.avatarUrl = await this.s3Service.getFileUrl(
                            admin.avatarUrl
                        );
                    }
                })
            );

            const meta: PaginationMeta = {
                totalItems: paginatedResults.meta.totalItems,
                itemCount: paginatedResults.meta.itemCount,
                itemsPerPage: paginatedResults.meta.itemsPerPage,
                totalPages: paginatedResults.meta.totalPages,
                currentPage: paginatedResults.meta.currentPage,
            };

            this.logger.log(
                `Fetched ${paginatedResults.items.length} club admins successfully out of ${paginatedResults.meta.totalItems} total items`
            );

            return foundRes("Club admins fetched successfully", {
                items: paginatedResults.items,
                meta,
            });
        } catch (error) {
            this.logger.error("Error fetching club admins", error.stack);
            return errorRes("An error occurred while fetching club admins");
        }
    }

    async getClubAdminById(
        id: string,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<ClubAdmin>> {
        try {
            this.logger.log(
                `Fetching club admin with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const admin = await this.clubAdminRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: [
                    "academy",
                    "branch",
                    "user",
                    "teams",
                    "sportProfile",
                    "contractDetails",
                ],
            });

            if (!admin) {
                this.logger.warn(
                    `Club admin with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Club admin with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            if (admin.avatarUrl) {
                try {
                    admin.avatarUrl = await this.s3Service.getFileUrl(
                        admin.avatarUrl
                    );
                    this.logger.log(
                        `Signed URL generated for avatar: ${admin.avatarUrl}`
                    );
                } catch (error) {
                    this.logger.warn(
                        `Failed to generate signed URL for avatar: ${admin.avatarUrl}`,
                        error.stack
                    );
                }
            }

            this.logger.log(`Fetched club admin with ID: ${id} successfully`);
            return foundRes("Club admin fetched successfully", admin);
        } catch (error) {
            this.logger.error(
                `Error fetching club admin with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while fetching the club admin");
        }
    }

    async updateClubAdmin(
        id: string,
        updateDto: UpdateClubAdminDto,
        avatar?: Express.Multer.File,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<ClubAdmin>> {
        try {
            this.logger.log(
                `Updating club admin with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const admin = await this.clubAdminRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: ["user"],
            });

            if (!admin) {
                this.logger.warn(
                    `Club admin with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Club admin with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            return await this.clubAdminRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    if (
                        updateDto.email ||
                        updateDto.username ||
                        updateDto.password
                    ) {
                        const user = admin.user;

                        if (updateDto.email && updateDto.email !== user.email) {
                            const existingUserByEmail =
                                await transactionalEntityManager.findOne(User, {
                                    where: { email: updateDto.email },
                                });
                            if (existingUserByEmail) {
                                this.logger.warn(
                                    `Email conflict detected: ${updateDto.email}`
                                );
                                throw new ConflictException(
                                    "Email already exists"
                                );
                            }
                            user.email = updateDto.email;
                        }

                        if (
                            updateDto.username &&
                            updateDto.username !== user.username
                        ) {
                            const existingUserByUsername =
                                await transactionalEntityManager.findOne(User, {
                                    where: { username: updateDto.username },
                                });
                            if (existingUserByUsername) {
                                this.logger.warn(
                                    `Username conflict detected: ${updateDto.username}`
                                );
                                throw new ConflictException(
                                    "Username already exists"
                                );
                            }
                            user.username = updateDto.username;
                        }

                        if (updateDto.password) {
                            user.password = await AuthUtil.hashPassword(
                                updateDto.password
                            );
                            this.logger.log(
                                "Password successfully hashed and updated"
                            );
                        }

                        if (avatar) {
                            const s3Path = this.generateS3Path(
                                `${updateDto.firstName || admin.firstName}-${updateDto.lastName || admin.lastName}`
                            );
                            const newAvatarUrl =
                                await this.s3Service.uploadFile(s3Path, avatar);

                            if (user.avatar) {
                                await this.s3Service.deleteFile(user.avatar);
                                this.logger.log(
                                    `Deleted old avatar from S3: ${user.avatar}`
                                );
                            }

                            user.avatar = newAvatarUrl;
                        }

                        const updatedUser =
                            await transactionalEntityManager.save(User, user);
                        this.logger.log(
                            `User with ID: ${updatedUser.id} updated successfully`
                        );
                        admin.user = updatedUser;
                    }

                    if (updateDto.type) {
                        admin.type = updateDto.type;
                    }
                    if (updateDto.experience !== undefined) {
                        admin.experience = updateDto.experience;
                    }
                    if (updateDto.birthday) {
                        admin.birthday = updateDto.birthday;
                    }
                    if (updateDto.phone) {
                        admin.phone = updateDto.phone;
                    }
                    if (updateDto.emergencyPhone !== undefined) {
                        admin.emergencyPhone = updateDto.emergencyPhone;
                    }
                    if (updateDto.nationality) {
                        admin.nationality = updateDto.nationality;
                    }
                    if (updateDto.relationship) {
                        admin.relationship = updateDto.relationship;
                    }
                    if (updateDto.gender) {
                        admin.gender = updateDto.gender;
                    }
                    if (updateDto.lastName) {
                        admin.lastName = updateDto.lastName;
                    }
                    if (updateDto.firstName) {
                        admin.firstName = updateDto.firstName;
                    }
                    if (updateDto.joinDate) {
                        admin.joinDate = updateDto.joinDate;
                    }

                    if (updateDto.academy) {
                        const newAcademy =
                            await transactionalEntityManager.findOne(Academy, {
                                where: { id: updateDto.academy },
                            });
                        if (!newAcademy) {
                            throw new ConflictException("Academy not found");
                        }
                        admin.academy = newAcademy;
                    }

                    if (updateDto.branch) {
                        const newBranch =
                            await transactionalEntityManager.findOne(Branch, {
                                where: { id: updateDto.branch },
                            });
                        if (!newBranch) {
                            throw new ConflictException("Branch not found");
                        }
                        admin.branch = newBranch;
                    }

                    if (sportClubProfileId) {
                        const newSportProfile =
                            await transactionalEntityManager.findOne(
                                sportClubProfiles,
                                {
                                    where: { id: sportClubProfileId },
                                }
                            );
                        if (!newSportProfile) {
                            throw new ConflictException(
                                "SportClubProfile not found"
                            );
                        }
                        admin.sportProfile = newSportProfile;
                    }

                    const updatedAdmin = await transactionalEntityManager.save(
                        ClubAdmin,
                        admin
                    );
                    this.logger.log(
                        `ClubAdmin with ID: ${updatedAdmin.id} updated successfully`
                    );

                    return foundRes(
                        "ClubAdmin updated successfully",
                        updatedAdmin
                    );
                }
            );
        } catch (error) {
            this.logger.error(
                `Error fetching club admin with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while fetching the club admin");
        }
    }

    async deleteClubAdmin(
        id: string,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<null>> {
        try {
            this.logger.log(
                `Deleting club admin with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const admin = await this.clubAdminRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: ["user"],
            });

            if (!admin) {
                this.logger.warn(
                    `Club admin with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Club admin with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            await this.clubAdminRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    if (admin.user.avatar) {
                        try {
                            await this.s3Service.deleteFile(admin.user.avatar);
                            this.logger.log(
                                `Deleted avatar from S3: ${admin.user.avatar}`
                            );
                        } catch (error) {
                            this.logger.warn(
                                `Failed to delete avatar from S3: ${admin.user.avatar}`,
                                error.stack
                            );
                        }
                    }

                    await transactionalEntityManager.remove(User, admin.user);
                    this.logger.log(
                        `User with ID: ${admin.user.id} deleted successfully`
                    );

                    await transactionalEntityManager.remove(ClubAdmin, admin);
                    this.logger.log(
                        `ClubAdmin with ID: ${id} deleted successfully`
                    );
                }
            );

            return deletedRes("Club admin deleted successfully", null);
        } catch (error) {
            this.logger.error(
                `Error deleting club admin with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while deleting the club admin");
        }
    }

    private calculateAge(birthday?: Date): number | null {
        if (!birthday) return null;
        const diff = Date.now() - birthday.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    async getNextSessions(coachId: string): Promise<any[]> {
        const coach = await this.clubAdminRepository.findOne({
            where: { id: coachId },
            relations: ["teams", "teams.sessions"],
        });

        if (!coach) {
            throw new NotFoundException(
                `Coach with ID "${coachId}" not found.`
            );
        }

        const currentDate = new Date();

        const sessions = coach.teams.flatMap((team) =>
            team.sessions.filter(
                (session) => new Date(session.from) > currentDate
            )
        );

        const sortedSessions = sessions.sort(
            (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
        );

        return sortedSessions.map((session) => ({
            id: session.id,
            from: this.formatTime(session.from),
            to: this.formatTime(session.to),
            team: {
                id: session.team.id,
                name: session.team.name,
            },
            duration: this.calculateDuration(
                new Date(session.from),
                new Date(session.to)
            ),
        }));
    }

    private formatTime(date: string | Date): string {
        return moment(date).format("hh:mm A");
    }

    private calculateDuration(from: Date, to: Date): string {
        const durationMs = to.getTime() - from.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        return `${hours} hr ${minutes} min`;
    }

    async getContract(adminId: string): Promise<CustomResponseType<Contract>> {
        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
                relations: ["contract"],
            });
            if (!admin) {
                this.logger.warn(`Club admin with ID ${adminId} not found`);
                return notFoundRes(`Club admin with ID ${adminId} not found`);
            }
            if (!admin.contract) {
                this.logger.warn(
                    `Contract for club admin ${adminId} not found`
                );
                return notFoundRes(
                    `Contract for club admin ${adminId} not found`
                );
            }
            if (admin.contract.contractUrl) {
                admin.contract.contractUrl = await this.s3Service.getFileUrl(
                    admin.contract.contractUrl
                );
            }

            return foundRes("Contract retrieved successfully", admin.contract);
        } catch (error) {
            this.logger.error(
                `Error retrieving contract for club admin ${adminId}`,
                error.stack
            );
            return errorRes(`Error retrieving contract: ${error.message}`);
        }
    }

    async updateContract(
        adminId: string,
        updateContractDto: UpdateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
                relations: ["contract"],
            });
            if (!admin) {
                this.logger.warn(`Club admin with ID ${adminId} not found`);
                return notFoundRes(`Club admin with ID ${adminId} not found`);
            }
            if (!admin.contract) {
                this.logger.warn(
                    `Contract for club admin ${adminId} not found`
                );
                return notFoundRes(
                    `Contract for club admin ${adminId} not found`
                );
            }
            const updatedContract = this.contractRepository.merge(
                admin.contract,
                updateContractDto
            );

            if (contractFile) {
                const s3Path = `contracts/${adminId}/${Date.now()}`;
                const fileUrl = await this.s3Service.uploadFile(
                    s3Path,
                    contractFile
                );
                updatedContract.contractUrl = fileUrl;
            }

            const savedContract =
                await this.contractRepository.save(updatedContract);
            return foundRes("Contract updated successfully", savedContract);
        } catch (error) {
            this.logger.error(
                `Error updating contract for club admin ${adminId}`,
                error.stack
            );
            return errorRes(`Error updating contract: ${error.message}`);
        }
    }

    async createContract(
        adminId: string,
        createContractDto: CreateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
                relations: ["contract"],
            });
            if (!admin) {
                this.logger.warn(`Club admin with ID ${adminId} not found`);
                return notFoundRes(`Club admin with ID ${adminId} not found`);
            }
            const contractUrl = await this.s3Service.uploadFile(
                "contracts/",
                contractFile
            );
            const newContract = this.contractRepository.create({
                ...createContractDto,
                contractUrl,
            });
            const savedContract =
                await this.contractRepository.save(newContract);
            admin.contract = savedContract;
            await this.clubAdminRepository.save(admin);
            return foundRes("Contract created successfully", savedContract);
        } catch (error) {
            this.logger.error(
                `Error creating contract for club admin ${adminId}`,
                error.stack
            );
            return errorRes(`Error creating contract: ${error.message}`);
        }
    }
}
