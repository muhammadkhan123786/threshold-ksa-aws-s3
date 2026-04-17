import {
    Injectable,
    Logger,
    ConflictException,
    NotFoundException,
    Session,
    HttpStatus,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, MoreThan, In } from "typeorm";
import { User } from "src/entities/user.entity";
import { Academy } from "src/entities/academy.entity";
import { Branch } from "src/entities/branch.entity";
import {
    IPaginationOptions,
    Pagination,
    PaginationTypeEnum,
    paginate,
} from "nestjs-typeorm-paginate";
import CustomResponseType from "src/types/customResponseType";
import {
    foundRes,
    notFoundRes,
    errorRes,
    deletedRes,
} from "src/lib/responses/restResponse";
import { CreateClubCoachDto } from "src/dto/clubCoaches/create-club-coach.dto";
import { PaginationMeta } from "src/types/paginationMeta.interface";
import { Coach } from "src/entities/coach.entity";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { AuthUtil } from "src/lib/helpers/auth.util";
import { UpdateClubCoachDto } from "src/dto/clubCoaches/update-club-coach.dto";
import { S3Service } from "src/s3/s3.service";
import { UpdatePersonalInformationDto } from "src/dto/clubCoaches/update-personal-information.dto";
import { Team } from "src/entities/team.entity";
import { UpdateContactDto } from "src/dto/clubCoaches/update-contract.dto";
import { ContractDetails } from "src/entities/contractDetails.entity";
import { ContractDuration } from "src/enums/contractDuration.enum";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { UpdateBankDetailsDto } from "src/dto/clubCoaches/update-bank-details.dto";
import { MedicalInformation } from "src/entities/medical-information.entity";
import { UpdateMedicalInformationDto } from "src/dto/clubCoaches/update-medical-information.dto";
import { MedicalFiles } from "src/entities/medical-files.entity";
import { CreateMedicalFileDto } from "src/dto/clubCoaches/create-medical-file.dto";
import { UpdateMedicalFileDto } from "src/dto/clubCoaches/update-medical-file.dto";
import { Documents } from "src/entities/documents.entity";
import { CreateDocumentDto } from "src/dto/clubCoaches/create-document.dto";
import { UpdateDocumentDto } from "src/dto/clubCoaches/update-document.dto";
import { MedicalHistory } from "src/entities/medical-history.entity";
import moment from "moment";
import { Contract } from "src/entities/contract.entity";
import {
    CreateContractDto,
    UpdateContractDto,
} from "src/dto/contracts/contract.dto";

@Injectable()
export class ClubCoachesService {
    private readonly logger = new Logger(ClubCoachesService.name);

    constructor(
        @InjectRepository(Coach)
        private readonly clubCoachRepository: Repository<Coach>,
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
        private readonly s3Service: S3Service
    ) {}

    private generateS3Path(coachName: string): string {
        const timestamp = Date.now();
        return `clubCoaches/${coachName}-${timestamp}/avatar`;
    }

    async getCoachDetails(coachId: string): Promise<any> {
        const coach = await this.clubCoachRepository.findOne({
            where: { id: coachId },
            relations: [
                "teams",
                "subTeams",
                "user",
                "bankDetails",
                "playingFor",
                "teams.sessions",
                "contractDetails",
                "academy",
                "branch",
                "teams.sessions",
            ],
        });

        if (!coach) {
            throw new NotFoundException(
                `Coach with ID "${coachId}" not found.`
            );
        }

        const age = coach.birthday ? this.calculateAge(coach.birthday) : null;

        const nextSessions = await this.getNextSessions(coachId);

        const signedAvatarUrl = coach.avatarUrl
            ? await this.s3Service.getFileUrl(coach.avatarUrl)
            : null;

        const teams = await Promise.all(
            coach.teams.map(async (team) => ({
                ...team,
                logo: team.logo
                    ? await this.s3Service.getFileUrl(team.logo)
                    : null,
            }))
        );

        return {
            ...coach,
            teams,
            id: coach.id,
            name: `${coach.firstName} ${coach.lastName}`,
            age: age ? `${age} Years Old` : "N/A",
            experience: coach.experience,
            nationality: coach.nationality,
            languages: coach.user?.language || "N/A",
            profile: {
                avatarUrl: signedAvatarUrl,
                type: coach.type || "N/A",
            },
            playingFor: coach.playingFor || "N/A",
            nextSessions: nextSessions?.length ? nextSessions : "N/A",
            contractDetails: coach.contractDetails || "N/A",
            bankDetails: coach.bankDetails || "N/A",
        };
    }

    async getMedicalHistory(coachId: string): Promise<MedicalHistory[]> {
        const coach = await this.clubCoachRepository.findOne({
            where: { id: coachId },
            relations: ["medicalHistory"],
        });

        if (!coach) {
            throw new NotFoundException(`Coach with ID ${coachId} not found`);
        }

        return coach.medicalHistory;
    }

    async addMedicalHistory(
        coachId: string,
        body: { date: string; type: string; description: string }
    ): Promise<MedicalHistory> {
        const coach = await this.clubCoachRepository.findOne({
            where: { id: coachId },
        });

        if (!coach) {
            throw new NotFoundException(`Coach with ID ${coachId} not found`);
        }

        const newHistory = this.clubCoachRepository.manager.create(
            MedicalHistory,
            {
                ...body,
                coach,
            }
        );

        return this.clubCoachRepository.manager.save(
            MedicalHistory,
            newHistory
        );
    }

    async updateMedicalHistory(
        coachId: string,
        historyId: string,
        body: { date: string; type: string; description: string }
    ): Promise<MedicalHistory> {
        const history = await this.clubCoachRepository.manager.findOne(
            MedicalHistory,
            {
                where: { id: historyId, coach: { id: coachId } },
            }
        );

        if (!history) {
            throw new NotFoundException(
                `Medical history with ID ${historyId} not found`
            );
        }

        Object.assign(history, body);

        return this.clubCoachRepository.manager.save(MedicalHistory, history);
    }

    async getDocuments(
        coachId: string
    ): Promise<CustomResponseType<Documents[]>> {
        this.logger.log(`Fetching documents for coach ID: ${coachId}`);
        try {
            const documents = await this.clubCoachRepository.manager.find(
                Documents,
                {
                    where: { coach: { id: coachId } },
                    relations: ["coach"],
                }
            );

            if (!documents || documents.length === 0) {
                this.logger.warn(`No documents found for coach ID: ${coachId}`);
                return notFoundRes(
                    `No documents found for coach ID: ${coachId}`
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
                    coach: document.coach,
                }))
            );

            this.logger.log(
                `Documents fetched successfully for coach ID: ${coachId}`
            );
            return foundRes("Documents fetched successfully", updatedDocuments);
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching documents for coach ID: ${coachId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async updateDocument(
        coachId: string,
        documentId: string,
        file: Express.Multer.File,
        updateDocumentDto: UpdateDocumentDto
    ): Promise<CustomResponseType<Documents>> {
        this.logger.log(
            `Updating document with ID: ${documentId} for coach ID: ${coachId}`
        );

        try {
            const document = await this.clubCoachRepository.manager.findOne(
                Documents,
                {
                    where: { id: documentId, coach: { id: coachId } },
                }
            );

            if (!document) {
                this.logger.warn(
                    `Document with ID "${documentId}" not found for coach ID: ${coachId}`
                );
                return notFoundRes("Document not found");
            }

            if (file) {
                const s3Path = `documents/${coachId}/${Date.now()}`;
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

            const updatedDocument = await this.clubCoachRepository.manager.save(
                Documents,
                document
            );

            this.logger.log(
                `Document with ID: ${documentId} updated successfully.`
            );
            return foundRes("Document updated successfully", updatedDocument);
        } catch (error) {
            this.logger.error(
                `Error occurred while updating document with ID: ${documentId} for coach ID: ${coachId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async addDocument(
        coachId: string,
        file: Express.Multer.File,
        createDocumentDto: CreateDocumentDto
    ): Promise<CustomResponseType<Documents>> {
        this.logger.log(`Adding a new document for coach ID: ${coachId}`);
        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id: coachId },
            });
            if (!coach) {
                this.logger.warn(`Coach with ID "${coachId}" not found`);
                return notFoundRes(`Coach with ID "${coachId}" not found`);
            }

            const s3Path = `documents/${coachId}/${Date.now()}`;
            const fileUrl = await this.s3Service.uploadFile(s3Path, file);

            const document = this.clubCoachRepository.manager.create(
                Documents,
                {
                    ...createDocumentDto,
                    documentUrl: fileUrl,
                    coach,
                }
            );

            const savedDocument = await this.clubCoachRepository.manager.save(
                Documents,
                document
            );

            this.logger.log(
                `Document added successfully for coach ID: ${coachId}`
            );
            return foundRes("Document added successfully", savedDocument);
        } catch (error) {
            this.logger.error(
                `Error occurred while adding document for coach ID: ${coachId}`,
                error.stack
            );
            return errorRes("An error occurred while adding the document");
        }
    }

    async getMedicalFiles(coachId: string): Promise<CustomResponseType<any>> {
        this.logger.log(`Fetching medical files for coach ID: ${coachId}`);

        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id: coachId },
                relations: ["medicalFiles"],
            });

            if (!coach) {
                this.logger.warn(`Coach with ID "${coachId}" not found.`);
                return notFoundRes(`Coach with ID "${coachId}" not found`);
            }

            const medicalFiles = await Promise.all(
                coach.medicalFiles.map(async (file) => ({
                    id: file.id,
                    fileName: file.fileName,
                    fileUrl: await this.s3Service.getFileUrl(file.fileUrl),
                    createdAt: file.createdAt,
                }))
            );

            this.logger.log(`Medical files for coach ID: ${coachId} fetched.`);
            return foundRes("Medical files fetched successfully", medicalFiles);
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching medical files for coach ID: ${coachId}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async addMedicalFile(
        coachId: string,
        file: Express.Multer.File,
        description?: string
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Adding medical file for coach ID: ${coachId}`);

        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id: coachId },
            });
            if (!coach) {
                return notFoundRes(`Coach with ID "${coachId}" not found`);
            }

            const s3Key = `medical-files/${coachId}/${Date.now()}`;
            const fileUrl = await this.s3Service.uploadFile(s3Key, file);

            const medicalFile = this.clubCoachRepository.manager.create(
                MedicalFiles,
                {
                    coach,
                    fileName: file.originalname,
                    fileUrl,
                    description,
                }
            );
            const savedMedicalFile =
                await this.clubCoachRepository.manager.save(
                    MedicalFiles,
                    medicalFile
                );

            this.logger.log(`Medical file for coach ID: ${coachId} added.`);
            return foundRes(
                "Medical file added successfully",
                savedMedicalFile
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while adding medical file for coach ID: ${coachId}`,
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
            const medicalFile = await this.clubCoachRepository.manager.findOne(
                MedicalFiles,
                { where: { id: fileId }, relations: ["coach"] }
            );

            if (!medicalFile) {
                this.logger.warn(`Medical file with ID "${fileId}" not found`);
                return notFoundRes(
                    `Medical file with ID "${fileId}" not found`
                );
            }

            let updatedFileUrl = medicalFile.fileUrl;

            if (file) {
                const s3Key = `medical-files/${medicalFile.coach.id}/${Date.now()}-${file.originalname}`;
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
                await this.clubCoachRepository.manager.save(
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

    async getMedicalInformation(
        coachId: string
    ): Promise<CustomResponseType<any>> {
        try {
            const coach = await this.clubCoachRepository.manager.findOne(
                Coach,
                {
                    where: { id: coachId },
                    relations: ["medicalInformation"],
                }
            );

            if (!coach) {
                return notFoundRes(`Coach with ID "${coachId}" not found`);
            }

            return foundRes("Medical information fetched successfully", {
                medicalInformation: coach.medicalInformation || null,
            });
        } catch (error) {
            throw new Error(
                `Error occurred while fetching medical information: ${error.message}`
            );
        }
    }

    async updateMedicalInformation(
        coachId: string,
        updateDto: UpdateMedicalInformationDto
    ): Promise<CustomResponseType<any>> {
        try {
            const coach = await this.clubCoachRepository.manager.findOne(
                Coach,
                {
                    where: { id: coachId },
                    relations: ["medicalInformation"],
                }
            );

            if (!coach) {
                return notFoundRes(`Coach with ID "${coachId}" not found`);
            }

            let medicalInformation: MedicalInformation;

            if (!coach.medicalInformation) {
                medicalInformation = this.clubCoachRepository.manager.create(
                    MedicalInformation,
                    {
                        ...updateDto,
                    }
                );

                medicalInformation =
                    await this.clubCoachRepository.manager.save(
                        medicalInformation
                    );

                coach.medicalInformation = medicalInformation;
                await this.clubCoachRepository.manager.save(Coach, coach);
            } else {
                medicalInformation = coach.medicalInformation;
                Object.assign(medicalInformation, updateDto);

                medicalInformation =
                    await this.clubCoachRepository.manager.save(
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

    async createUserForClubCoach(
        createDto: CreateClubCoachDto,
        avatar?: Express.Multer.File,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<{ user: User; clubCoach: Coach }>> {
        this.logger.log(
            `Starting user and club coach creation process for: ${createDto.firstName} ${createDto.lastName}`
        );

        try {
            return await this.clubCoachRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
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
                                where: { id: createDto.branch.id },
                            }
                        );
                        if (!branchEntity) {
                            throw new ConflictException("Branch not found");
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

                    const clubCoach = transactionalEntityManager.create(Coach, {
                        ...createDto,
                        user: savedUser,
                        academy: academyEntity,
                        branch: branchEntity,
                        sportProfile: sportClubProfile,
                        avatarUrl,
                    });
                    const savedClubCoach =
                        await transactionalEntityManager.save(Coach, clubCoach);
                    this.logger.log(
                        `ClubCoach created successfully with ID: ${savedClubCoach.id}`
                    );

                    return foundRes("User and ClubCoach created successfully", {
                        user: savedUser,
                        clubCoach: savedClubCoach,
                    });
                }
            );
        } catch (error) {
            this.logger.error(
                "Error occurred during user and ClubCoach creation process",
                error.stack
            );

            console.log("error", error);
            if (error instanceof ConflictException) {
                return errorRes(error.message);
            }

            return errorRes("An unexpected error occurred");
        }
    }

    async updatePersonalInformation(
        id: string,
        updateDto: UpdatePersonalInformationDto,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<Coach>> {
        this.logger.log(
            `Updating personal information for coach with ID: ${id}`
        );

        try {
            const coach = await this.clubCoachRepository.findOne({
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

            if (!coach) {
                this.logger.warn(`Coach with ID "${id}" not found`);
                return notFoundRes(`Coach with ID "${id}" not found`);
            }

            if (avatar) {
                if (coach.user?.avatar) {
                    try {
                        await this.s3Service.deleteFile(coach.user.avatar);
                        this.logger.log(
                            `Deleted old avatar from S3: ${coach.user.avatar}`
                        );
                    } catch (deleteError) {
                        this.logger.warn(
                            `Failed to delete old avatar from S3: ${coach.user.avatar}`,
                            deleteError.stack
                        );
                    }
                }

                try {
                    const s3Path = `coaches/${id}/${Date.now()}-avatar`;
                    const newAvatarUrl = await this.s3Service.uploadFile(
                        s3Path,
                        avatar
                    );

                    if (coach.user) {
                        coach.user.avatar = newAvatarUrl;
                    }
                    (coach as any).avatarUrl = newAvatarUrl;

                    this.logger.log(
                        `Uploaded new avatar to S3: ${newAvatarUrl}`
                    );
                } catch (uploadError) {
                    this.logger.error(
                        `Failed to upload new avatar for Coach ID: ${id}`,
                        uploadError.stack
                    );
                    return errorRes(
                        "Failed to upload new avatar. Please try again."
                    );
                }
            }

            // 4. Relink 'playingFor' team if provided
            if (updateDto.playingFor) {
                const team = await this.clubCoachRepository.manager.findOne(
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

                coach.playingFor = team;
            }

            // Update nationalId and nationalIdExpiration if provided
            if (updateDto.nationalId !== undefined) {
                coach.nationalId = updateDto.nationalId;
            }
            if (updateDto.nationalIdExpiration !== undefined) {
                coach.nationalIdExpiration = new Date(
                    updateDto.nationalIdExpiration
                );
            }

            Object.entries(updateDto).forEach(([key, value]) => {
                if (
                    key !== "playingFor" &&
                    key !== "nationalId" &&
                    key !== "nationalIdExpiration" &&
                    value !== undefined
                ) {
                    (coach as any)[key] = value;
                }
            });

            const updatedCoach = await this.clubCoachRepository.save(coach);

            this.logger.log(
                `Personal information for coach with ID: ${id} updated successfully`
            );
            return foundRes(
                "Personal information updated successfully",
                updatedCoach
            );
        } catch (error) {
            this.logger.error(
                `Error updating personal information for coach with ID: ${id}`,
                error.stack
            );
            return errorRes(
                "An error occurred while updating personal information"
            );
        }
    }

    async getPersonalInformation(
        id: string
    ): Promise<CustomResponseType<Partial<Coach>>> {
        this.logger.log(`Fetching personal information for coach ID: ${id}`);

        try {
            const personalInfo = await this.clubCoachRepository
                .createQueryBuilder("coach")
                .leftJoinAndSelect("coach.playingFor", "team")
                .leftJoinAndSelect("coach.user", "user")
                .select([
                    "coach.id",
                    "coach.firstName",
                    "coach.lastName",
                    "user.role",
                    "coach.country",
                    "coach.languages",
                    "coach.gender",
                    "coach.birthday",
                    "coach.height",
                    "coach.weight",
                    "coach.avatarUrl",
                    "coach.nationality",
                    "coach.levelEducation",
                    "coach.schoolName",
                    "coach.joinDate",
                    "coach.experience",
                    "coach.nationalId",
                    "coach.nationalIdExpiration",
                    "team.id",
                    "team.name",
                    "team.branch",
                    "team.updatedAt",
                    "team.createdAt",
                    "team.creationDate",
                ])
                .where("coach.id = :id", { id })
                .getOne();

            if (!personalInfo) {
                this.logger.warn(`Coach with ID "${id}" not found.`);
                return notFoundRes(`Coach with ID "${id}" not found`);
            }

            personalInfo.avatarUrl = personalInfo.avatarUrl
                ? await this.s3Service.getFileUrl(personalInfo.avatarUrl)
                : null;

            this.logger.log(`Fetched personal information for coach ID: ${id}`);
            return foundRes(
                "Personal information fetched successfully",
                personalInfo
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching personal information for coach ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getClubCoaches(
        search?: string,
        sportClubProfileId?: string,
        page: number = 1,
        limit: number = 10,
        sortField: string = "firstName",
        sortOrder: "ASC" | "DESC" = "ASC"
    ): Promise<CustomResponseType<{ items: Coach[]; meta: PaginationMeta }>> {
        try {
            this.logger.log(
                `Fetching club coaches with search: ${search || "None"}, sportClubProfileId: ${sportClubProfileId || "None"}, page: ${page}, limit: ${limit}, sortField: ${sortField}, sortOrder: ${sortOrder}`
            );

            const queryBuilder = this.clubCoachRepository
                .createQueryBuilder("clubCoach")
                .leftJoinAndSelect("clubCoach.user", "user")
                .leftJoinAndSelect("clubCoach.teams", "team")
                .leftJoinAndSelect("clubCoach.academy", "academy")
                .leftJoinAndSelect("clubCoach.branch", "branch")
                .leftJoinAndSelect("clubCoach.sportProfile", "sportProfile")
                .where("clubCoach.sportProfile = :sportClubProfileId", {
                    sportClubProfileId,
                });

            if (search) {
                queryBuilder.andWhere(
                    "clubCoach.firstName ILIKE :search OR clubCoach.lastName ILIKE :search",
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
            queryBuilder.orderBy(`clubCoach.${sortField}`, sortOrder);

            const options: IPaginationOptions = {
                page,
                limit,
            };

            const totalItems = await queryBuilder.getCount();

            const paginatedResults: Pagination<Coach> = await paginate<Coach>(
                queryBuilder as any,
                {
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
                            totalItems,
                            totalPages: totalPages === 0 ? 1 : totalPages,
                        };
                    },
                }
            );

            await Promise.all(
                paginatedResults.items.map(async (coach) => {
                    if (coach.avatarUrl) {
                        coach.avatarUrl = await this.s3Service.getFileUrl(
                            coach.avatarUrl
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
                `Fetched ${paginatedResults.items.length} club coaches successfully out of ${paginatedResults.meta.totalItems} total items`
            );

            return foundRes("Club coaches fetched successfully", {
                items: paginatedResults.items,
                meta,
            });
        } catch (error) {
            this.logger.error("Error fetching club coaches", error.stack);
            return errorRes("An error occurred while fetching club coaches");
        }
    }

    async updateBankDetails(
        id: string,
        updateDto: UpdateBankDetailsDto
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Updating bank details for coach ID: ${id}`);

        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!coach) {
                this.logger.warn(`Coach with ID "${id}" not found.`);
                return notFoundRes(`Coach with ID "${id}" not found`);
            }

            let updatedBankDetails: AthleteBankDetails;

            if (!coach.bankDetails) {
                const newBankDetails = this.clubCoachRepository.manager.create(
                    AthleteBankDetails,
                    {
                        coach,
                        accountHolder: updateDto.accountHolder,
                        iban: updateDto.iban,
                        bank: updateDto.bank,
                    }
                );

                updatedBankDetails =
                    await this.clubCoachRepository.manager.save(newBankDetails);
                this.logger.log(
                    `Initialized new bank details for coach ID: ${id}`
                );
            } else {
                const existingBankDetails = coach.bankDetails;

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
                    await this.clubCoachRepository.manager.save(
                        existingBankDetails
                    );
                this.logger.log(`Updated bank details for coach ID: ${id}`);
            }

            const responsePayload = {
                bankDetails: {
                    accountHolder: updatedBankDetails.accountHolder,
                    iban: updatedBankDetails.iban,
                    bank: updatedBankDetails.bank,
                },
                coach: {
                    id: coach.id,
                    firstName: coach.firstName,
                    lastName: coach.lastName,
                },
            };

            this.logger.log(`Bank details for coach ID: ${id} updated.`);
            return foundRes(
                "Bank details updated successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while updating bank details for coach ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }

    async getBankDetails(id: string): Promise<CustomResponseType<any>> {
        this.logger.log(`Fetching bank details for coach ID: ${id}`);

        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!coach) {
                this.logger.warn(`Coach with ID "${id}" not found.`);
                return notFoundRes(`Coach with ID "${id}" not found`);
            }

            const bankDetails = coach.bankDetails
                ? {
                      accountHolder: coach.bankDetails.accountHolder,
                      iban: coach.bankDetails.iban,
                      bank: coach.bankDetails.bank,
                  }
                : null;

            const responsePayload = {
                bankDetails,
                coach: {
                    id: coach.id,
                    firstName: coach.firstName,
                    lastName: coach.lastName,
                },
            };

            this.logger.log(
                `Bank details for coach ID: ${id} fetched successfully.`
            );
            return foundRes(
                "Bank details fetched successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching bank details for coach ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }
    async getContactDetails(id: string): Promise<CustomResponseType<any>> {
        this.logger.log(`Fetching contact details for coach ID: ${id}`);

        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id },
            });

            console.log("coachcoachcoachcoachcoach", coach);
            if (!coach) {
                this.logger.warn(`Coach with ID "${id}" not found.`);
                return notFoundRes(`Coach with ID "${id}" not found`);
            }

            const responsePayload = {
                coach: {
                    id: coach.id,
                    firstName: coach.firstName,
                    lastName: coach.lastName,
                    phone: coach.phone,
                    emergencyPhone: coach.emergencyPhone,
                    nationalId: coach.nationalId,
                    nationalIdExpiration: coach.nationalIdExpiration,
                    relationship: coach.relationship,
                },
            };

            this.logger.log(`Contact details for coach ID: ${id} fetched.`);
            return foundRes(
                "Contact details fetched successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error occurred while fetching contact details for coach ID: ${id}`,
                error.stack
            );
            return errorRes("An unexpected error occurred");
        }
    }
    async updateContactDetails(
        id: string,
        updateDto: UpdateContactDto
    ): Promise<CustomResponseType<any>> {
        this.logger.log(`Processing contact details for coach ID: ${id}`);

        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id },
            });

            if (!coach) {
                this.logger.warn(`Coach with ID "${id}" not found.`);
                return notFoundRes(`Coach with ID "${id}" not found`);
            }

            if (updateDto.nationalId) {
                coach.nationalId = updateDto.nationalId;
            }
            if (updateDto.nationalIdExpiration) {
                coach.nationalIdExpiration = updateDto.nationalIdExpiration;
            }
            if (updateDto.phone) {
                coach.phone = updateDto.phone;
            }
            if (updateDto.emergencyPhone) {
                coach.emergencyPhone = updateDto.emergencyPhone;
            }
            if (updateDto.emergencyPhone) {
                coach.emergencyPhone = updateDto.emergencyPhone;
            }
            if (updateDto.emergencyPhone) {
                coach.emergencyPhone = updateDto.emergencyPhone;
            }
            if (updateDto.relationship) {
                coach.relationship = updateDto.relationship;
            }

            const updatedCoach = await this.clubCoachRepository.save(coach);

            const responsePayload = {
                coach: {
                    id: updatedCoach.id,
                    firstName: updatedCoach.firstName,
                    lastName: updatedCoach.lastName,
                    phone: updatedCoach.phone,
                    emergencyPhone: updatedCoach.emergencyPhone,
                    nationalId: updatedCoach.nationalId,
                    nationalIdExpiration: updatedCoach.nationalIdExpiration,
                    relationship: updatedCoach.relationship,
                },
            };

            this.logger.log(
                `Contact details for coach ID: ${id} processed successfully.`
            );
            return foundRes(
                "Contact details processed successfully",
                responsePayload
            );
        } catch (error) {
            this.logger.error(
                `Error processing contact details for coach ID: ${id}`,
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

    async getClubCoachById(
        id: string,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<Coach>> {
        try {
            this.logger.log(
                `Fetching club coach with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const coach = await this.clubCoachRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: [
                    "academy",
                    "branch",
                    "user",
                    "teams",
                    "sportProfile",
                ],
            });

            if (!coach) {
                this.logger.warn(
                    `Club coach with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Club coach with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            if (coach.avatarUrl) {
                try {
                    coach.avatarUrl = await this.s3Service.getFileUrl(
                        coach.avatarUrl
                    );
                    this.logger.log(
                        `Signed URL generated for avatar: ${coach.avatarUrl}`
                    );
                } catch (error) {
                    this.logger.warn(
                        `Failed to generate signed URL for avatar: ${coach.avatarUrl}`,
                        error.stack
                    );
                }
            }

            this.logger.log(`Fetched club coach with ID: ${id} successfully`);
            return foundRes("Club coach fetched successfully", coach);
        } catch (error) {
            this.logger.error(
                `Error fetching club coach with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while fetching the club coach");
        }
    }

    async updateClubCoach(
        id: string,
        updateDto: UpdateClubCoachDto,
        avatar?: Express.Multer.File,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<Coach>> {
        try {
            this.logger.log(
                `Updating club coach with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const coach = await this.clubCoachRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: ["user"],
            });

            if (!coach) {
                this.logger.warn(
                    `Club coach with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Club coach with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            return await this.clubCoachRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    if (
                        updateDto.email ||
                        updateDto.username ||
                        updateDto.password
                    ) {
                        const user = coach.user;

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
                                `${updateDto.firstName || coach.firstName}-${updateDto.lastName || coach.lastName}`
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
                        coach.user = updatedUser;
                    }

                    if (updateDto.type) {
                        coach.type = updateDto.type;
                    }
                    if (updateDto.experience !== undefined) {
                        coach.experience = updateDto.experience;
                    }
                    if (updateDto.birthday) {
                        coach.birthday = updateDto.birthday;
                    }
                    if (updateDto.phone) {
                        coach.phone = updateDto.phone;
                    }
                    if (updateDto.emergencyPhone !== undefined) {
                        coach.emergencyPhone = updateDto.emergencyPhone;
                    }
                    if (updateDto.nationality) {
                        coach.nationality = updateDto.nationality;
                    }
                    if (updateDto.relationship) {
                        coach.relationship = updateDto.relationship;
                    }
                    if (updateDto.gender) {
                        coach.gender = updateDto.gender;
                    }
                    if (updateDto.lastName) {
                        coach.lastName = updateDto.lastName;
                    }
                    if (updateDto.firstName) {
                        coach.firstName = updateDto.firstName;
                    }
                    if (updateDto.joinDate) {
                        coach.joinDate = updateDto.joinDate;
                    }

                    if (updateDto.academy) {
                        const newAcademy =
                            await transactionalEntityManager.findOne(Academy, {
                                where: { id: updateDto.academy },
                            });
                        if (!newAcademy) {
                            throw new ConflictException("Academy not found");
                        }
                        coach.academy = newAcademy;
                    }

                    if (updateDto.branch) {
                        const newBranch =
                            await transactionalEntityManager.findOne(Branch, {
                                where: { id: updateDto.branch.id },
                            });
                        if (!newBranch) {
                            throw new ConflictException("Branch not found");
                        }
                        coach.branch = newBranch;
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
                        coach.sportProfile = newSportProfile;
                    }

                    if (avatar && !coach.avatarUrl) {
                        coach.avatarUrl = await this.s3Service.getFileUrl(
                            coach.user.avatar
                        );
                    }

                    const updatedCoach = await transactionalEntityManager.save(
                        Coach,
                        coach
                    );
                    this.logger.log(
                        `ClubCoach with ID: ${updatedCoach.id} updated successfully`
                    );

                    return foundRes(
                        "ClubCoach updated successfully",
                        updatedCoach
                    );
                }
            );
        } catch (error) {
            this.logger.error(
                `Error ADD club coach with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while fetching the club coach");
        }
    }

    async deleteClubCoach(
        id: string,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<null>> {
        try {
            this.logger.log(
                `Deleting club coach with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const coach = await this.clubCoachRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: ["user"],
            });

            if (!coach) {
                this.logger.warn(
                    `Club coach with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Club coach with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            await this.clubCoachRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    if (coach.user.avatar) {
                        try {
                            await this.s3Service.deleteFile(coach.user.avatar);
                            this.logger.log(
                                `Deleted avatar from S3: ${coach.user.avatar}`
                            );
                        } catch (error) {
                            this.logger.warn(
                                `Failed to delete avatar from S3: ${coach.user.avatar}`,
                                error.stack
                            );
                        }
                    }

                    await transactionalEntityManager.remove(User, coach.user);
                    this.logger.log(
                        `User with ID: ${coach.user.id} deleted successfully`
                    );

                    await transactionalEntityManager.remove(Coach, coach);
                    this.logger.log(
                        `ClubCoach with ID: ${id} deleted successfully`
                    );
                }
            );

            return deletedRes("Club coach deleted successfully", null);
        } catch (error) {
            this.logger.error(
                `Error deleting club coach with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while deleting the club coach");
        }
    }

    private calculateAge(birthday?: Date): number | null {
        if (!birthday) return null;
        const diff = Date.now() - birthday.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    async getNextSessions(coachId: string): Promise<any[]> {
        const coach = await this.clubCoachRepository.findOne({
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

    async getContract(coachId: string): Promise<CustomResponseType<Contract>> {
        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id: coachId },
                relations: ["contract"],
            });
            if (!coach) {
                this.logger.warn(`Coach with ID ${coachId} not found`);
                return notFoundRes(`Coach with ID ${coachId} not found`);
            }
            if (!coach.contract) {
                this.logger.warn(`Contract for coach ${coachId} not found`);
                return notFoundRes(`Contract for coach ${coachId} not found`);
            }
            if (coach.contract.contractUrl) {
                coach.contract.contractUrl = await this.s3Service.getFileUrl(
                    coach.contract.contractUrl
                );
            }
            return foundRes("Contract retrieved successfully", coach.contract);
        } catch (error) {
            this.logger.error(
                `Error retrieving contract for coach ${coachId}`,
                error.stack
            );
            return errorRes(`Error retrieving contract: ${error.message}`);
        }
    }

    async updateContract(
        coachId: string,
        updateContractDto: UpdateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id: coachId },
                relations: ["contract"],
            });
            if (!coach) {
                this.logger.warn(`Coach with ID ${coachId} not found`);
                return notFoundRes(`Coach with ID ${coachId} not found`);
            }
            if (!coach.contract) {
                this.logger.warn(`Contract for coach ${coachId} not found`);
                return notFoundRes(`Contract for coach ${coachId} not found`);
            }
            const updatedContract = this.contractRepository.merge(
                coach.contract,
                updateContractDto
            );
            if (contractFile) {
                const s3Path = `contracts/${coachId}/${Date.now()}`;
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
                `Error updating contract for coach ${coachId}`,
                error.stack
            );
            return errorRes(`Error updating contract: ${error.message}`);
        }
    }

    async createContract(
        coachId: string,
        createContractDto: CreateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const coach = await this.clubCoachRepository.findOne({
                where: { id: coachId },
                relations: ["contract"],
            });
            if (!coach) {
                this.logger.warn(`Coach with ID ${coachId} not found`);
                return notFoundRes(`Coach with ID ${coachId} not found`);
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
            coach.contract = savedContract;
            await this.clubCoachRepository.save(coach);
            return foundRes("Contract created successfully", savedContract);
        } catch (error) {
            this.logger.error(
                `Error creating contract for coach ${coachId}`,
                error.stack
            );
            return errorRes(`Error creating contract: ${error.message}`);
        }
    }
}
