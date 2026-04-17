import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AcademiesService } from "../academies/academies.service";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Between,
    DeleteResult,
    EntityManager,
    LessThan,
    Repository,
    UpdateResult,
} from "typeorm";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import CustomResponseType from "src/types/customResponseType";
import { Athlete } from "../../entities/athlete.entity";
import { CreateAthleteDto } from "../../dto/athletes/create-athlete.dto";
import { UpdateAthleteDto } from "../../dto/athletes/update-athlete.dto";
import { UserRole } from "src/enums/users.enum";
import { AthleteSubscription } from "src/entities/athleteSubscription.entity";
import { SubscriptionStatus } from "src/enums/subscription-status.enum";
import { AthleteUtil } from "src/lib/helpers/athlete.util";
import { UpdateClothingDataDto } from "src/dto/athletes/update-clothing-data.dto";
import { UpdateEmergencyContactDto } from "src/dto/athletes/update-emergency-contact.dto";
import { UpdateBankDataDto } from "src/dto/athletes/update-bank-data.dto";
import { UpdatePersonalInfoDto } from "src/dto/athletes/update-personal-info.dto";
import { plainToClass } from "class-transformer";
import { AthleteDetailsDto } from "src/dto/athletes/athlete-details.dto";
import { EmergencyContact } from "src/entities/emergencyContact.entity";
import { CreateEmergencyContactDto } from "src/dto/athletes/create-emergency-contact.dto";
import { CreateClothingDataDto } from "src/dto/athletes/create-clothing-data.dto";
import { AthleteClothing } from "src/entities/athleteClothing.entity";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { CreateBankDataDto } from "src/dto/athletes/create-bank-data.dto";
import { UpdateAvailabilityStatusDto } from "src/dto/athletes/update-availability-status";
import {
    IPaginationOptions,
    Pagination,
    PaginationTypeEnum,
    paginate,
} from "nestjs-typeorm-paginate";
import { FirebaseService } from "src/firebase/firebase.service";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { CreatePlayerDto } from "src/dto/clubPlayer/create-player.dto";
import { S3Service } from "src/s3/s3.service";
import { Contract } from "src/entities/contract.entity";
import {
    UpdateContractDto,
    CreateContractDto,
} from "src/dto/contracts/contract.dto";
import { Team } from "src/entities/team.entity";
import { CreatePlayerByTeamDto } from "src/dto/clubPlayer/create-player-by-team.dto";

@Injectable()
export class ClubPlayerService {
    private readonly logger = new Logger(ClubPlayerService.name);

    constructor(
        @InjectRepository(Athlete)
        private readonly playerRepository: Repository<Athlete>,
        private readonly academiesService: AcademiesService,
        private readonly notificationService: FirebaseService,

        @InjectRepository(AthleteBankDetails)
        private readonly playerBankDetailsRepository: Repository<AthleteBankDetails>,

        @InjectRepository(AthleteClothing)
        private readonly playerClothingRepository: Repository<AthleteClothing>,

        @InjectRepository(EmergencyContact)
        private readonly emergencyContactRepository: Repository<EmergencyContact>,
        private readonly s3Service: S3Service,
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>
    ) {}

    private generateS3Path(fileName: string): string {
        return `players/${fileName}/`;
    }

    async createAthleteForSport(
        sportId: string,
        createPlayerDto: CreatePlayerDto,
        user: any,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<Athlete>> {
        Logger.log(
            `Creating player for sportId: ${sportId}`,
            "createPlayerForSport"
        );

        const { academy, branch } = user.payload;
        if (!academy?.id) {
            return errorRes("User's academy ID is missing.");
        }

        try {
            return await this.playerRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    await AthleteUtil.checkAthleteNIN(
                        createPlayerDto,
                        transactionalEntityManager
                    );

                    const { periodOfSubscription, ...rest } =
                        createPlayerDto as any;

                    const foundProfile =
                        await transactionalEntityManager.findOne(
                            sportClubProfiles,
                            { where: { id: sportId } }
                        );

                    if (!foundProfile) {
                        return errorRes(
                            `Sport club profile with ID "${sportId}" not found`
                        );
                    }

                    let avatarUrl: string = null;
                    if (avatar) {
                        const s3Path = this.generateS3Path(
                            `${createPlayerDto.firstName}-${createPlayerDto.lastName}`
                        );
                        avatarUrl = await this.s3Service.uploadFile(
                            s3Path,
                            avatar
                        );
                        Logger.log(`Avatar uploaded to S3: ${avatarUrl}`);
                    }

                    const newPlayer = transactionalEntityManager.create(
                        Athlete,
                        {
                            ...rest,
                            academy,
                            ...(branch?.id && { branch }),
                            sportProfile: foundProfile,
                            avatarUrl,
                        }
                    );

                    const savedPlayer = await transactionalEntityManager.save(
                        Athlete,
                        newPlayer
                    );

                    const subscription = transactionalEntityManager.create(
                        AthleteSubscription,
                        {
                            status: SubscriptionStatus.ACTIVE,
                            period: periodOfSubscription,
                            athlete: savedPlayer,
                        }
                    );

                    await transactionalEntityManager.save(
                        AthleteSubscription,
                        subscription
                    );

                    await this.notificationService.createNotification(
                        academy.id,
                        "Player Created",
                        `Player ${createPlayerDto.firstName} ${createPlayerDto.lastName} has been successfully created.`,
                        "PLAYER_CREATED"
                    );

                    return foundRes<Athlete>(
                        `Player created successfully under sportId: ${sportId}`,
                        savedPlayer
                    );
                }
            );
        } catch (error) {
            Logger.error(
                `Error creating player for sportId: ${sportId} - ${error.message}`,
                error.stack
            );
            return errorRes(error.message || "An unexpected error occurred");
        }
    }

    async getSubscriptionAnalytics(
        academyId: string
    ): Promise<CustomResponseType<any>> {
        try {
            const result = await this.playerRepository
                .createQueryBuilder("player")
                .leftJoinAndSelect("player.subscription", "subscription")
                .where("player.academyId = :academyId", { academyId })
                .select([
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.ACTIVE}' THEN 1 END) as active`,
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.INACTIVE}' THEN 1 END) as inactive`,
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.PENDING}' THEN 1 END) as pending`,
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.EXPIRED}' THEN 1 END) as expired`,
                    `COUNT(player.id) as total`,
                ])
                .getRawOne();

            const analytics = {
                active: Number(result.active),
                inactive: Number(result.inactive),
                pending: Number(result.pending),
                expired: Number(result.expired),
                total: Number(result.total),
            };

            return foundRes(
                "Subscription analytics retrieved successfully",
                analytics
            );
        } catch (error) {
            return errorRes(
                error.message || "Failed to retrieve subscription analytics"
            );
        }
    }

    async updateAvailabilityStatus(
        id: string,
        updateAvailabilityStatusDto: UpdateAvailabilityStatusDto
    ) {
        try {
            Logger.log(
                `Finding player with ID: ${id}`,
                "updateAvailabilityStatus"
            );

            const player = await this.playerRepository.findOne({
                where: { id },
            });

            if (!player) {
                Logger.warn(
                    `Player with ID ${id} does not exist`,
                    "updateAvailabilityStatus"
                );
                return notFoundRes("Player does not exist");
            }

            player.availabilityStatus =
                updateAvailabilityStatusDto.availabilityStatus;
            await this.playerRepository.save(player);

            Logger.log(
                `Availability status updated successfully for player ID: ${player.id}`,
                "updateAvailabilityStatus"
            );

            return foundRes("Availability status updated successfully", {
                id: player.id,
                availabilityStatus: player.availabilityStatus,
            });
        } catch (error) {
            Logger.error(
                `Error updating availability status for player ID: ${id} - ${error.message}`,
                "updateAvailabilityStatus"
            );
            return errorRes("Failed to update availability status");
        }
    }

    async getPlayerDetails(
        id: string
    ): Promise<CustomResponseType<AthleteDetailsDto>> {
        try {
            const player = await this.playerRepository.findOne({
                where: { id },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    joinDate: true,
                    level: true,
                    education: true,
                    schoolName: true,
                    dateOfBirth: true,
                    gender: true,
                    nin: true,
                    nationality: true,
                    weight: true,
                    height: true,
                    athleteClothing: {
                        tShirtSize: true,
                        pantSize: true,
                        shoeSize: true,
                        driFitSize: true,
                    },
                    bankDetails: {
                        iban: true,
                        bank: true,
                        accountHolder: true,
                    },
                    teams: {
                        name: true,
                    },
                    emergencyContact: {
                        relationship: true,
                        phoneNumber: true,
                        nationalNumber: true,
                    },
                    subscription: {
                        status: true,
                        subscriptionDate: true,
                        id: true,
                    },
                },
                relations: [
                    "athleteClothing",
                    "bankDetails",
                    "teams",
                    "emergencyContact",
                    "subscription",
                ],
            });

            if (!player) {
                return notFoundRes("Player does not exist");
            }
            const playerDto = plainToClass(AthleteDetailsDto, player);

            return foundRes("Player details retrieved successfully", playerDto);
        } catch (error) {
            return errorRes(
                error.message ||
                    "An error occurred while retrieving player details"
            );
        }
    }

    async updatePersonalInfo(
        id: string,
        avatar: Express.Multer.File,
        updatePersonalInfoDto: UpdatePersonalInfoDto
    ) {
        try {
            const player = await this.playerRepository.findOne({
                where: { id },
            });

            if (!player) {
                return notFoundRes("Player does not exist");
            }

            if (avatar) {
                if (player?.avatarUrl) {
                    await this.s3Service.deleteFile(player?.avatarUrl);
                }

                const s3Path = this.generateS3Path(
                    `${player.firstName}-${player.lastName}`
                );

                player.avatarUrl = await this.s3Service.uploadFile(
                    s3Path,
                    avatar
                );
            }

            Object.assign(player, updatePersonalInfoDto);
            await this.playerRepository.save(player);

            return foundRes(
                "Personal information updated successfully",
                player
            );
        } catch (error) {
            return errorRes("Failed to update personal information");
        }
    }

    async createEmergencyContact(
        id: string,
        createEmergencyContactDto: CreateEmergencyContactDto
    ) {
        try {
            Logger.log(
                `Finding player with ID: ${id}`,
                "createEmergencyContact"
            );

            const player = await this.playerRepository.findOne({
                where: { id },
                relations: ["emergencyContact"],
            });

            if (!player) {
                Logger.warn(
                    `Player with ID ${id} does not exist`,
                    "createEmergencyContact"
                );
                return notFoundRes("Player does not exist");
            }

            if (player.emergencyContact) {
                Logger.warn(
                    `Emergency contact already exists for player with ID ${id}`,
                    "createEmergencyContact"
                );
                return errorRes(
                    "Emergency contact already exists for this player"
                );
            }

            const newEmergencyContact = this.emergencyContactRepository.create({
                name: createEmergencyContactDto.name,
                phoneNumber: createEmergencyContactDto.phoneNumber,
                nationalNumber: createEmergencyContactDto.nationalNumber,
                relationship: createEmergencyContactDto.relation,
                athlete: player, // foreign key remains athlete field
            });

            Logger.log(
                `Saving new Emergency Contact: ${JSON.stringify(newEmergencyContact)}`,
                "createEmergencyContact"
            );
            await this.emergencyContactRepository.save(newEmergencyContact);

            Logger.log(
                `Emergency contact created successfully for player ID: ${player.id}`,
                "createEmergencyContact"
            );

            const response = {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                emergencyContact: {
                    id: newEmergencyContact.id,
                    name: newEmergencyContact.name,
                    phoneNumber: newEmergencyContact.phoneNumber,
                    nationalNumber: newEmergencyContact.nationalNumber,
                    relationship: newEmergencyContact.relationship,
                },
            };

            return foundRes("Emergency contact created successfully", response);
        } catch (error) {
            Logger.error(
                `Error creating emergency contact for player ID: ${id} - ${error.message}`,
                "createEmergencyContact"
            );
            return errorRes("Failed to create emergency contact");
        }
    }

    async updateEmergencyContact(
        id: string,
        updateEmergencyContactDto: UpdateEmergencyContactDto
    ) {
        try {
            const player = await this.playerRepository.findOne({
                where: { id },
                relations: ["emergencyContact"],
            });

            if (!player) {
                return notFoundRes("Player does not exist");
            }

            if (!player.emergencyContact) {
                return notFoundRes(
                    "Emergency contact does not exist for this player"
                );
            }

            player.emergencyContact.name = updateEmergencyContactDto.name;
            player.emergencyContact.phoneNumber =
                updateEmergencyContactDto.phoneNumber;
            player.emergencyContact.nationalNumber =
                updateEmergencyContactDto.nationalNumber;
            player.emergencyContact.relationship =
                updateEmergencyContactDto.relation;

            Logger.log(
                `Updating Emergency Contact: ${JSON.stringify(player.emergencyContact)}`
            );
            await this.playerRepository.save(player);

            return foundRes("Emergency contact updated successfully", player);
        } catch (error) {
            Logger.error(`Error updating emergency contact: ${error.message}`);
            return errorRes("Failed to update emergency contact");
        }
    }

    async createClothingData(
        id: string,
        createClothingDataDto: CreateClothingDataDto
    ) {
        try {
            Logger.log(`Finding player with ID: ${id}`, "createClothingData");

            const player = await this.playerRepository.findOne({
                where: { id },
                relations: ["athleteClothing"],
            });

            if (!player) {
                Logger.warn(
                    `Player with ID ${id} does not exist`,
                    "createClothingData"
                );
                return notFoundRes("Player does not exist");
            }

            if (player.athleteClothing) {
                Logger.warn(
                    `Clothing data already exists for player with ID ${id}`,
                    "createClothingData"
                );
                return errorRes("Clothing data already exists for this player");
            }

            const newClothingData = this.playerClothingRepository.create({
                tShirtSize: createClothingDataDto.tShirtSize,
                pantSize: createClothingDataDto.pantSize,
                shoeSize: createClothingDataDto.shoeSize,
                driFitSize: createClothingDataDto.driFitSize,
                athlete: player,
            });

            Logger.log(
                `Saving new Clothing Data: ${JSON.stringify(newClothingData)}`,
                "createClothingData"
            );
            await this.playerClothingRepository.save(newClothingData);

            Logger.log(
                `Clothing data created successfully for player ID: ${player.id}`,
                "createClothingData"
            );
            const response = {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                athleteClothing: {
                    id: newClothingData.id,
                    tShirtSize: newClothingData.tShirtSize,
                    pantSize: newClothingData.pantSize,
                    shoeSize: newClothingData.shoeSize,
                    driFitSize: newClothingData.driFitSize,
                },
            };

            return foundRes("Clothing data created successfully", response);
        } catch (error) {
            Logger.error(
                `Error creating clothing data for player ID: ${id} - ${error.message}`,
                "createClothingData"
            );
            return errorRes("Failed to create clothing data");
        }
    }

    async updateClothingData(
        id: string,
        updateClothingDataDto: UpdateClothingDataDto
    ) {
        try {
            Logger.log(`Finding player with ID: ${id}`, "updateClothingData");

            const player = await this.playerRepository.findOne({
                where: { id },
                relations: ["athleteClothing"],
            });

            if (!player) {
                Logger.warn(
                    `Player with ID ${id} does not exist`,
                    "updateClothingData"
                );
                return notFoundRes("Player does not exist");
            }

            Logger.log(
                `Found player: ${player.id}, updating clothing data`,
                "updateClothingData"
            );

            Object.assign(player.athleteClothing, updateClothingDataDto);
            Logger.log(
                `Clothing data before save: ${JSON.stringify(player.athleteClothing)}`,
                "updateClothingData"
            );

            await this.playerRepository.save(player);

            Logger.log(
                `Clothing data updated successfully for player ID: ${player.id}`,
                "updateClothingData"
            );
            return foundRes("Clothing data updated successfully", player);
        } catch (error) {
            Logger.error(
                `Error updating clothing data for player ID: ${id} - ${error.message}`,
                "updateClothingData"
            );
            return errorRes("Failed to update clothing data");
        }
    }

    async createBankData(id: string, createBankDataDto: CreateBankDataDto) {
        try {
            Logger.log(`Finding player with ID: ${id}`, "createBankData");

            const player = await this.playerRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!player) {
                Logger.warn(
                    `Player with ID ${id} does not exist`,
                    "createBankData"
                );
                return notFoundRes("Player does not exist");
            }

            if (player.bankDetails) {
                Logger.warn(
                    `Bank data already exists for player with ID ${id}`,
                    "createBankData"
                );
                return errorRes("Bank data already exists for this player");
            }

            const newBankData = this.playerBankDetailsRepository.create({
                iban: createBankDataDto.iban,
                bank: createBankDataDto.bank,
                accountHolder: createBankDataDto.accountHolder,
                athlete: player, // foreign key remains athlete field
            });

            Logger.log(
                `Saving new Bank Data: ${JSON.stringify(newBankData)}`,
                "createBankData"
            );
            await this.playerBankDetailsRepository.save(newBankData);

            Logger.log(
                `Bank data created successfully for player ID: ${player.id}`,
                "createBankData"
            );

            const response = {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                bankDetails: {
                    id: newBankData.id,
                    iban: newBankData.iban,
                    bank: newBankData.bank,
                    accountHolder: newBankData.accountHolder,
                },
            };

            return foundRes("Bank data created successfully", response);
        } catch (error) {
            Logger.error(
                `Error creating bank data for player ID: ${id} - ${error.message}`,
                "createBankData"
            );
            return errorRes("Failed to create bank data");
        }
    }

    async updateBankData(id: string, updateBankDataDto: UpdateBankDataDto) {
        try {
            Logger.log(`Finding player with ID: ${id}`, "updateBankData");

            const player = await this.playerRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!player) {
                Logger.warn(
                    `Player with ID ${id} does not exist`,
                    "updateBankData"
                );
                return notFoundRes("Player does not exist");
            }

            if (!player.bankDetails) {
                Logger.warn(
                    `Bank details do not exist for player with ID ${id}`,
                    "updateBankData"
                );
                return notFoundRes("Bank details do not exist for this player");
            }

            Logger.log(
                `Found player: ${player.id}, updating bank data`,
                "updateBankData"
            );
            Object.assign(player.bankDetails, updateBankDataDto);
            await this.playerRepository.save(player);

            Logger.log(
                `Bank data updated successfully for player ID: ${player.id}`,
                "updateBankData"
            );
            return foundRes("Bank data updated successfully", player);
        } catch (error) {
            Logger.error(
                `Error updating bank data for player ID: ${id} - ${error.message}`,
                "updateBankData"
            );
            return errorRes("Failed to update bank data");
        }
    }

    async getPlayerAnalytics(
        playerId: string,
        startDate: string,
        endDate: string
    ): Promise<any> {
        return await this.playerRepository.manager.transaction(
            async (transactionalEntityManager: EntityManager) => {
                const result = await AthleteUtil.getAthleteAnalytics(
                    playerId,
                    transactionalEntityManager,
                    startDate,
                    endDate
                );
                return foundRes(
                    "Player analytics retrieved successfully",
                    result
                );
            }
        );
    }

    async handleNinExpirationNotifications(): Promise<void> {
        const oneMonthBefore = new Date();
        oneMonthBefore.setMonth(oneMonthBefore.getMonth() + 1);

        const expiredPlayers = await this.playerRepository.find({
            where: { ninExpirationDate: LessThan(new Date()) },
            relations: ["academy", "subscription"],
        });

        const aboutToExpirePlayers = await this.playerRepository.find({
            where: { ninExpirationDate: Between(new Date(), oneMonthBefore) },
            relations: ["academy", "subscription"],
        });

        for (const player of aboutToExpirePlayers) {
            await this.notificationService.createNotification(
                player.academy.id,
                "NIN Expiration Reminder",
                `Your NIN is about to expire on ${player.ninExpirationDate}. Please renew it before the expiration date.`,
                "RENEWAL_REMINDER"
            );
        }

        for (const player of expiredPlayers) {
            await this.notificationService.createNotification(
                player.academy.id,
                "NIN Expired",
                `Your NIN has expired on ${player.ninExpirationDate}. Please take immediate action to renew it.`,
                "EXPIRED_ALERT"
            );
        }
    }

    async getPlayers(
        user: any,
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<Athlete>> {
        const { academy, branch, role, coachId } = user.payload;

        const queryBuilder = this.playerRepository
            .createQueryBuilder("player")
            .leftJoinAndSelect("player.subscription", "subscription")
            .leftJoinAndSelect("player.teams", "teams")
            .leftJoinAndSelect("player.athleteProfiles", "athleteProfiles")
            .leftJoinAndSelect("player.sportProfile", "sportClubProfile")
            .where("player.academyId = :academyId", { academyId: academy.id });

        if (branch?.id) {
            queryBuilder.andWhere("player.branchId = :branchId", {
                branchId: branch.id,
            });
        }

        if (role === UserRole.COACH) {
            queryBuilder.andWhere("teams.coachId = :coachId", { coachId });
        }

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                switch (key) {
                    case "level":
                        queryBuilder.andWhere(`player.level = :level`, {
                            level: filters[key],
                        });
                        break;

                    case "subscriptionStatus":
                        if (Array.isArray(filters[key])) {
                            queryBuilder.andWhere(
                                `subscription.status IN (:...subscriptionStatus)`,
                                {
                                    subscriptionStatus: filters[key],
                                }
                            );
                        } else {
                            queryBuilder.andWhere(
                                `subscription.status = :subscriptionStatus`,
                                {
                                    subscriptionStatus: filters[key],
                                }
                            );
                        }
                        break;

                    case "team":
                        queryBuilder.andWhere(`teams.name ILIKE :team`, {
                            team: `%${filters[key]}%`,
                        });
                        break;

                    case "sportId":
                        if (filters.sportId) {
                            queryBuilder.andWhere(
                                "sportClubProfile.id = :sportId",
                                {
                                    sportId: filters.sportId,
                                }
                            );
                        } else {
                            Logger.log(
                                "No sportId provided - skipping filter",
                                "getPlayers"
                            );
                        }
                        break;

                    default:
                        queryBuilder.andWhere(`player.${key} ILIKE :${key}`, {
                            [key]: `%${filters[key]}%`,
                        });
                        break;
                }
            }
        });

        if (sortField) {
            if (sortField === "team") {
                queryBuilder.orderBy("teams.name", sortOrder);
            } else if (sortField === "subscriptionStatus") {
                queryBuilder.orderBy("subscription.status", sortOrder);
            } else if (sortField === "firstName" || sortField === "lastName") {
                queryBuilder.orderBy(
                    `SUBSTRING(player.${sortField}, 1, 1)`,
                    sortOrder
                );
            } else {
                queryBuilder.orderBy(`player.${sortField}`, sortOrder);
            }
        }

        const totalItems = await queryBuilder.getCount();

        const paginationResult = await paginate<Athlete>(queryBuilder as any, {
            ...options,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
            metaTransformer: ({ currentPage, itemCount, itemsPerPage }) => {
                const totalPages = Math.round(totalItems / itemsPerPage);
                return {
                    currentPage,
                    itemCount,
                    itemsPerPage,
                    totalPages: totalPages === 0 ? 1 : totalPages,
                    totalItems,
                };
            },
        });

        console.log("paginationResult", paginationResult);

        const itemsWithSignedUrls = await Promise.all(
            paginationResult.items.map(async (player) => {
                if (player.avatarUrl) {
                    player.avatarUrl = await this.s3Service.getFileUrl(
                        player.avatarUrl
                    );
                }
                return player;
            })
        );

        return {
            ...paginationResult,
            items: itemsWithSignedUrls,
        };
    }

    async getPlayersForToday(
        user?: any
    ): Promise<CustomResponseType<Athlete[]>> {
        try {
            const { academy, branch } = user.payload;

            if (!academy.id) {
                return errorRes("Academy ID is required");
            }

            const players = await this.playerRepository.find({
                relations: ["academy", "subscription", "athleteProfiles"],
                where: {
                    academy: { id: academy.id },
                    ...(branch?.id && { branch: { id: branch.id } }),
                },
            });

            if (!players.length) {
                return foundRes("No players found for today", [], 0);
            }

            const filteredPlayers = players.filter((p) => {
                const { athleteProfiles } = p;
                return !athleteProfiles.length;
            });

            if (!filteredPlayers.length) {
                return foundRes(
                    "No players with subscriptions and profiles found for today",
                    [],
                    0
                );
            }

            return foundRes(
                "Players with subscriptions and profiles found for today",
                filteredPlayers,
                filteredPlayers.length
            );
        } catch (error) {
            return errorRes(
                error.message ||
                    "An error occurred while retrieving players for today"
            );
        }
    }

    async getPlayerById(id: string): Promise<CustomResponseType<Athlete>> {
        try {
            const player = await this.playerRepository.findOne({
                where: { id },
                relations: ["academy", "subscription"],
            });

            player.avatarUrl = player.avatarUrl
                ? await this.s3Service.getFileUrl(player.avatarUrl)
                : null;

            if (!player) {
                return notFoundRes("Player does not exist");
            }

            return foundRes("Player has been found", player);
        } catch (error) {
            return errorRes(
                error.message || "An error occurred while retrieving the player"
            );
        }
    }

    async createPlayer(
        createPlayerDto: CreateAthleteDto,
        user: any
    ): Promise<CustomResponseType<Athlete>> {
        const { academy, branch } = user.payload;

        if (!academy?.id) {
            return errorRes("User's academy ID is missing.");
        }

        try {
            return await this.playerRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    await AthleteUtil.checkAthleteNIN(
                        createPlayerDto,
                        transactionalEntityManager
                    );

                    const {
                        periodOfSubscription,
                        paymentMethod,
                        cashValue,
                        remainingValue,
                        ...rest
                    } = createPlayerDto as any;

                    const newPlayer = transactionalEntityManager.create(
                        Athlete,
                        {
                            ...rest,
                            academy,
                            ...(branch?.id && { branch }),
                        }
                    );

                    const savedPlayer = await transactionalEntityManager.save(
                        Athlete,
                        newPlayer
                    );

                    const subscription = transactionalEntityManager.create(
                        AthleteSubscription,
                        {
                            status: SubscriptionStatus.ACTIVE,
                            period: periodOfSubscription,
                            athlete: savedPlayer,
                            paymentMethod,
                            cashValue,
                            remainingValue,
                        }
                    );

                    await transactionalEntityManager.save(
                        AthleteSubscription,
                        subscription
                    );

                    return foundRes<Athlete>(
                        "Player has been created successfully",
                        savedPlayer
                    );
                }
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updatePlayer(
        id: string,
        updatePlayerDto: UpdateAthleteDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            return await this.playerRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    const playerResponse = await this.getPlayerById(id);

                    if (
                        playerResponse.status !== 200 ||
                        !playerResponse.payload
                    ) {
                        return notFoundRes(`Player does not exist`);
                    }

                    await AthleteUtil.checkAthleteNIN(
                        {
                            ...updatePlayerDto,
                            academy: playerResponse.payload.academy.id,
                        },
                        transactionalEntityManager,
                        true,
                        id
                    );

                    const updateResult = await AthleteUtil.updateAthleteData(
                        id,
                        updatePlayerDto,
                        transactionalEntityManager,
                        this.academiesService
                    );

                    return newInstanceRes<UpdateResult>(
                        "Player has been updated successfully",
                        updateResult
                    );
                }
            );
        } catch (error) {
            return errorRes(error.message || "An error occurred");
        }
    }

    async deletePlayer(id: string): Promise<CustomResponseType<DeleteResult>> {
        try {
            const player = await this.playerRepository.findOne({
                where: { id },
            });

            if (!player) {
                return notFoundRes(
                    "Player does not exist"
                ) as CustomResponseType<DeleteResult>;
            }

            const response = await this.playerRepository.softDelete(id);
            return deletedRes(
                "Player has been soft deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async recoverPlayer(id: string): Promise<CustomResponseType<Athlete>> {
        try {
            await this.playerRepository.restore(id);
            const player = await this.getPlayerById(id);
            if (!player.payload) {
                return notFoundRes("Player does not exist");
            }
            return foundRes(
                "Player has been restored successfully",
                player.payload
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getCoachLevel(
        user: any,
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<Athlete>> {
        const { academy, branch, role, coachId } = user.payload;

        const queryBuilder = this.playerRepository
            .createQueryBuilder("player")
            .leftJoinAndSelect("player.subscription", "subscription")
            .leftJoinAndSelect("player.teams", "teams")
            .leftJoinAndSelect("player.athleteProfiles", "athleteProfiles")
            .where("player.academyId = :academyId", { academyId: academy.id });

        if (branch?.id) {
            queryBuilder.andWhere("player.branchId = :branchId", {
                branchId: branch.id,
            });
        }

        if (role === UserRole.COACH) {
            queryBuilder.andWhere("teams.coachId = :coachId", { coachId });
        }

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (key === "level") {
                    queryBuilder.andWhere(`player.${key} = :${key}`, {
                        [key]: filters[key],
                    });
                } else if (key === "subscriptionStatus") {
                    if (Array.isArray(filters[key])) {
                        queryBuilder.andWhere(
                            `subscription.status IN (:...subscriptionStatus)`,
                            {
                                subscriptionStatus: filters[key],
                            }
                        );
                    } else {
                        queryBuilder.andWhere(
                            `subscription.status = :subscriptionStatus`,
                            {
                                subscriptionStatus: filters[key],
                            }
                        );
                    }
                } else if (key === "team") {
                    queryBuilder.andWhere(`teams.name LIKE :team`, {
                        team: `%${filters[key]}%`,
                    });
                } else if (key === "sport") {
                    queryBuilder.andWhere(`athleteProfiles.sport = :sport`, {
                        sport: filters[key],
                    });
                } else if (key === "sportId") {
                    Logger.log(
                        `Filtering by sportId = ${filters[key]}`,
                        "getCoachLevel"
                    );
                } else {
                    queryBuilder.andWhere(`player.${key} LIKE :${key}`, {
                        [key]: `%${filters[key]}%`,
                    });
                }
            }
        });

        if (sortField) {
            if (sortField === "team") {
                queryBuilder.orderBy("teams.name", sortOrder);
            } else if (sortField === "subscriptionStatus") {
                queryBuilder.orderBy("subscription.status", sortOrder);
            } else if (sortField === "firstName" || sortField === "lastName") {
                queryBuilder.orderBy(
                    `SUBSTRING(player.${sortField}, 1, 1)`,
                    sortOrder
                );
            } else {
                queryBuilder.orderBy(`player.${sortField}`, sortOrder);
            }
        }

        const totalItems = await queryBuilder.getCount();

        return paginate<Athlete>(queryBuilder as any, {
            ...options,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
            metaTransformer: ({ currentPage, itemCount, itemsPerPage }) => {
                const totalPages = Math.round(totalItems / itemsPerPage);
                return {
                    currentPage,
                    itemCount,
                    itemsPerPage,
                    totalItems,
                    totalPages: totalPages === 0 ? 1 : totalPages,
                };
            },
        });
    }

    async getContract(playerId: string): Promise<CustomResponseType<Contract>> {
        try {
            const player = await this.playerRepository.findOne({
                where: { id: playerId },
                relations: ["contract"],
            });
            if (!player) {
                this.logger.warn(`Player with ID ${playerId} not found`);
                return notFoundRes(`Player with ID ${playerId} not found`);
            }
            if (!player.contract) {
                this.logger.warn(`Contract for player ${playerId} not found`);
                return notFoundRes(`Contract for player ${playerId} not found`);
            }
            if (player.contract.contractUrl) {
                player.contract.contractUrl = await this.s3Service.getFileUrl(
                    player.contract.contractUrl
                );
            }
            return foundRes("Contract retrieved successfully", player.contract);
        } catch (error) {
            this.logger.error(
                `Error retrieving contract for player ${playerId}`,
                error.stack
            );
            return errorRes(`Error retrieving contract: ${error.message}`);
        }
    }

    async updateContract(
        playerId: string,
        updateContractDto: UpdateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const player = await this.playerRepository.findOne({
                where: { id: playerId },
                relations: ["contract"],
            });
            if (!player) {
                this.logger.warn(`Player with ID ${playerId} not found`);
                return notFoundRes(`Player with ID ${playerId} not found`);
            }
            if (!player.contract) {
                this.logger.warn(`Contract for player ${playerId} not found`);
                return notFoundRes(`Contract for player ${playerId} not found`);
            }
            const updatedContract = this.contractRepository.merge(
                player.contract,
                updateContractDto
            );
            if (contractFile) {
                const s3Path = `contracts/${playerId}/${Date.now()}`;
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
                `Error updating contract for player ${playerId}`,
                error.stack
            );
            return errorRes(`Error updating contract: ${error.message}`);
        }
    }

    async createContract(
        playerId: string,
        createContractDto: CreateContractDto,
        contractFile: Express.Multer.File
    ): Promise<CustomResponseType<Contract>> {
        try {
            const player = await this.playerRepository.findOne({
                where: { id: playerId },
                relations: ["contract"],
            });
            if (!player) {
                this.logger.warn(`Player with ID ${playerId} not found`);
                return notFoundRes(`Player with ID ${playerId} not found`);
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
            player.contract = savedContract;
            await this.playerRepository.save(player);
            return foundRes("Contract created successfully", savedContract);
        } catch (error) {
            this.logger.error(
                `Error creating contract for player ${playerId}`,
                error.stack
            );
            return errorRes(`Error creating contract: ${error.message}`);
        }
    }

    async createPlayerForTeam(
        teamId: string,
        createPlayerByTeamDto: CreatePlayerByTeamDto,
        user: any,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<Athlete>> {
        Logger.log(
            `Creating player for teamId: ${teamId}`,
            "createPlayerForTeam"
        );

        const { academy, branch } = user.payload;
        if (!academy?.id) {
            return errorRes("User's academy ID is missing.");
        }

        try {
            return await this.playerRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    await AthleteUtil.checkAthleteNIN(
                        createPlayerByTeamDto,
                        transactionalEntityManager
                    );

                    const {
                        periodOfSubscription,
                        dateOfBirth,
                        dateOfUpdating,
                        weight,
                        chronic,
                        allergyDetails,
                        healthFactors,
                        allergies,
                        injury,
                        consideration,
                        availabilityStatus,
                        foodAllergies,
                        ...rest
                    } = createPlayerByTeamDto as any;

                    const foundTeam = await transactionalEntityManager.findOne(
                        Team,
                        {
                            where: { id: teamId },
                        }
                    );

                    if (!foundTeam) {
                        return errorRes(`Team with ID "${teamId}" not found`);
                    }

                    let avatarUrl: string = null;
                    if (avatar) {
                        const s3Path = this.generateS3Path(
                            `${createPlayerByTeamDto.firstName}-${createPlayerByTeamDto.lastName}`
                        );
                        avatarUrl = await this.s3Service.uploadFile(
                            s3Path,
                            avatar
                        );
                        Logger.log(`Avatar uploaded to S3: ${avatarUrl}`);
                    }

                    // Ensure dateOfBirth is properly set
                    if (!createPlayerByTeamDto.dateOfBirth) {
                        return errorRes("Date of birth is required");
                    }

                    const newPlayer = transactionalEntityManager.create(
                        Athlete,
                        {
                            ...rest,
                            dateOfBirth,
                            weight: weight ? parseFloat(weight.toString()) : null,
                            avatar: avatarUrl,
                            academy,
                            allergyDetails: allergyDetails || [],
                            chronic: chronic || [],
                            healthFactors: healthFactors || [],
                            allergies,
                            injury,
                            consideration,
                            availabilityStatus,
                            foodAllergies,
                            ...(branch?.id && { branch }),
                            teams: [{ id: teamId }],
                        }
                    );

                    const savedPlayer = await transactionalEntityManager.save(
                        Athlete,
                        newPlayer
                    );

                    const subscription = transactionalEntityManager.create(
                        AthleteSubscription,
                        {
                            status: SubscriptionStatus.ACTIVE,
                            period: periodOfSubscription,
                            athlete: savedPlayer,
                        }
                    );

                    await transactionalEntityManager.save(
                        AthleteSubscription,
                        subscription
                    );

                    await this.notificationService.createNotification(
                        academy.id,
                        "Player Created",
                        `Player ${createPlayerByTeamDto.firstName} ${createPlayerByTeamDto.lastName} has been successfully created.`,
                        "PLAYER_CREATED"
                    );

                    return foundRes<Athlete>(
                        `Player created successfully under teamId: ${teamId}`,
                        savedPlayer
                    );
                }
            );
        } catch (error) {
            Logger.error(
                `Error creating player for teamId: ${teamId} - ${error.message}`,
                error.stack
            );
            return errorRes(error.message || "An unexpected error occurred");
        }
    }
}
