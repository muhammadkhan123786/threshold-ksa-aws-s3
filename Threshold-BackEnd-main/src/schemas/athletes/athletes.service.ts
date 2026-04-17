import { Notification } from "./../../entities/notification.entity";
import { AcademiesService } from "../academies/academies.service";
import { Injectable } from "@nestjs/common";
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
import { Logger } from "@nestjs/common";
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

@Injectable()
export class AthletesService {
    constructor(
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        private readonly academiesService: AcademiesService,
        private readonly notificationService: FirebaseService,
        @InjectRepository(AthleteBankDetails)
        private readonly athleteBankDetailsRepository: Repository<AthleteBankDetails>,
        @InjectRepository(AthleteClothing)
        private readonly athleteClothingRepository: Repository<AthleteClothing>,
        @InjectRepository(EmergencyContact)
        private readonly emergencyContactRepository: Repository<EmergencyContact>
    ) {}

    async getSubscriptionAnalytics(
        academyId: string
    ): Promise<CustomResponseType<any>> {
        try {
            const result = await this.athleteRepository
                .createQueryBuilder("athlete")
                .leftJoinAndSelect("athlete.subscription", "subscription")
                .where("athlete.academyId = :academyId", { academyId })
                .select([
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.ACTIVE}' THEN 1 END) as active`,
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.INACTIVE}' THEN 1 END) as inactive`,
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.PENDING}' THEN 1 END) as pending`,
                    `COUNT(CASE WHEN subscription.status = '${SubscriptionStatus.EXPIRED}' THEN 1 END) as expired`,
                    `COUNT(athlete.id) as total`,
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
                `Finding athlete with ID: ${id}`,
                "updateAvailabilityStatus"
            );

            const athlete = await this.athleteRepository.findOne({
                where: { id },
            });

            if (!athlete) {
                Logger.warn(
                    `Athlete with ID ${id} does not exist`,
                    "updateAvailabilityStatus"
                );
                return notFoundRes("Athlete does not exist");
            }

            athlete.availabilityStatus =
                updateAvailabilityStatusDto.availabilityStatus;

            await this.athleteRepository.save(athlete);

            Logger.log(
                `Availability status updated successfully for athlete ID: ${athlete.id}`,
                "updateAvailabilityStatus"
            );

            return foundRes("Availability status updated successfully", {
                id: athlete.id,
                availabilityStatus: athlete.availabilityStatus,
            });
        } catch (error) {
            Logger.error(
                `Error updating availability status for athlete ID: ${id} - ${error.message}`,
                "updateAvailabilityStatus"
            );
            return errorRes("Failed to update availability status");
        }
    }

    async getAthleteDetails(
        id: string
    ): Promise<CustomResponseType<AthleteDetailsDto>> {
        try {
            const athlete = await this.athleteRepository.findOne({
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
                },
                relations: [
                    "athleteClothing",
                    "bankDetails",
                    "teams",
                    "emergencyContact",
                ],
            });

            if (!athlete) {
                return notFoundRes("Athlete does not exist");
            }
            const athleteDto = plainToClass(AthleteDetailsDto, athlete);

            return foundRes(
                "Athlete details retrieved successfully",
                athleteDto
            );
        } catch (error) {
            return errorRes(
                error.message ||
                    "An error occurred while retrieving athlete details"
            );
        }
    }

    async updatePersonalInfo(
        id: string,
        updatePersonalInfoDto: UpdatePersonalInfoDto
    ) {
        try {
            const athlete = await this.athleteRepository.findOne({
                where: { id },
            });

            if (!athlete) {
                return notFoundRes("Athlete does not exist");
            }

            // Update fields
            Object.assign(athlete, updatePersonalInfoDto);
            await this.athleteRepository.save(athlete);

            return foundRes(
                "Personal information updated successfully",
                athlete
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
                `Finding athlete with ID: ${id}`,
                "createEmergencyContact"
            );

            const athlete = await this.athleteRepository.findOne({
                where: { id },
                relations: ["emergencyContact"],
            });

            if (!athlete) {
                Logger.warn(
                    `Athlete with ID ${id} does not exist`,
                    "createEmergencyContact"
                );
                return notFoundRes("Athlete does not exist");
            }

            if (athlete.emergencyContact) {
                Logger.warn(
                    `Emergency contact already exists for athlete with ID ${id}`,
                    "createEmergencyContact"
                );
                return errorRes(
                    "Emergency contact already exists for this athlete"
                );
            }

            const newEmergencyContact = this.emergencyContactRepository.create({
                name: createEmergencyContactDto.name,
                phoneNumber: createEmergencyContactDto.phoneNumber,
                nationalNumber: createEmergencyContactDto.nationalNumber,
                relationship: createEmergencyContactDto.relation,
                athlete: athlete,
            });

            Logger.log(
                `Saving new Emergency Contact: ${JSON.stringify(newEmergencyContact)}`,
                "createEmergencyContact"
            );

            await this.emergencyContactRepository.save(newEmergencyContact);

            Logger.log(
                `Emergency contact created successfully for athlete ID: ${athlete.id}`,
                "createEmergencyContact"
            );

            const response = {
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
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
                `Error creating emergency contact for athlete ID: ${id} - ${error.message}`,
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
            const athlete = await this.athleteRepository.findOne({
                where: { id },
                relations: ["emergencyContact"],
            });

            if (!athlete) {
                return notFoundRes("Athlete does not exist");
            }

            if (!athlete.emergencyContact) {
                return notFoundRes(
                    "Emergency contact does not exist for this athlete"
                );
            }

            athlete.emergencyContact.name = updateEmergencyContactDto.name;
            athlete.emergencyContact.phoneNumber =
                updateEmergencyContactDto.phoneNumber;
            athlete.emergencyContact.nationalNumber =
                updateEmergencyContactDto.nationalNumber;
            athlete.emergencyContact.relationship =
                updateEmergencyContactDto.relation;

            Logger.log(
                `Updating Emergency Contact: ${JSON.stringify(athlete.emergencyContact)}`
            );

            await this.athleteRepository.save(athlete);

            return foundRes("Emergency contact updated successfully", athlete);
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
            Logger.log(`Finding athlete with ID: ${id}`, "createClothingData");

            const athlete = await this.athleteRepository.findOne({
                where: { id },
                relations: ["athleteClothing"],
            });

            if (!athlete) {
                Logger.warn(
                    `Athlete with ID ${id} does not exist`,
                    "createClothingData"
                );
                return notFoundRes("Athlete does not exist");
            }

            if (athlete.athleteClothing) {
                Logger.warn(
                    `Clothing data already exists for athlete with ID ${id}`,
                    "createClothingData"
                );
                return errorRes(
                    "Clothing data already exists for this athlete"
                );
            }

            const newClothingData = this.athleteClothingRepository.create({
                tShirtSize: createClothingDataDto.tShirtSize,
                pantSize: createClothingDataDto.pantSize,
                shoeSize: createClothingDataDto.shoeSize,
                driFitSize: createClothingDataDto.driFitSize,
                athlete: athlete, // Associate the new clothing data with the athlete
            });

            Logger.log(
                `Saving new Clothing Data: ${JSON.stringify(newClothingData)}`,
                "createClothingData"
            );

            await this.athleteClothingRepository.save(newClothingData);

            Logger.log(
                `Clothing data created successfully for athlete ID: ${athlete.id}`,
                "createClothingData"
            );
            const response = {
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
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
                `Error creating clothing data for athlete ID: ${id} - ${error.message}`,
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
            Logger.log(`Finding athlete with ID: ${id}`, "updateClothingData");

            const athlete = await this.athleteRepository.findOne({
                where: { id },
                relations: ["athleteClothing"],
            });

            if (!athlete) {
                Logger.warn(
                    `Athlete with ID ${id} does not exist`,
                    "updateClothingData"
                );
                return notFoundRes("Athlete does not exist");
            }

            Logger.log(
                `Found athlete: ${athlete.id}, updating clothing data`,
                "updateClothingData"
            );

            Object.assign(athlete.athleteClothing, updateClothingDataDto);
            Logger.log(
                `Clothing data before save: ${JSON.stringify(athlete.athleteClothing)}`,
                "updateClothingData"
            );

            await this.athleteRepository.save(athlete);

            Logger.log(
                `Clothing data updated successfully for athlete ID: ${athlete.id}`,
                "updateClothingData"
            );
            return foundRes("Clothing data updated successfully", athlete);
        } catch (error) {
            Logger.error(
                `Error updating clothing data for athlete ID: ${id} - ${error.message}`,
                "updateClothingData"
            );
            return errorRes("Failed to update clothing data");
        }
    }

    async createBankData(id: string, createBankDataDto: CreateBankDataDto) {
        try {
            Logger.log(`Finding athlete with ID: ${id}`, "createBankData");

            const athlete = await this.athleteRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!athlete) {
                Logger.warn(
                    `Athlete with ID ${id} does not exist`,
                    "createBankData"
                );
                return notFoundRes("Athlete does not exist");
            }

            if (athlete.bankDetails) {
                Logger.warn(
                    `Bank data already exists for athlete with ID ${id}`,
                    "createBankData"
                );
                return errorRes("Bank data already exists for this athlete");
            }

            const newBankData = this.athleteBankDetailsRepository.create({
                iban: createBankDataDto.iban,
                bank: createBankDataDto.bank,
                accountHolder: createBankDataDto.accountHolder,
                athlete: athlete,
            });

            Logger.log(
                `Saving new Bank Data: ${JSON.stringify(newBankData)}`,
                "createBankData"
            );

            await this.athleteBankDetailsRepository.save(newBankData);

            Logger.log(
                `Bank data created successfully for athlete ID: ${athlete.id}`,
                "createBankData"
            );

            const response = {
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
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
                `Error creating bank data for athlete ID: ${id} - ${error.message}`,
                "createBankData"
            );
            return errorRes("Failed to create bank data");
        }
    }

    async updateBankData(id: string, updateBankDataDto: UpdateBankDataDto) {
        try {
            Logger.log(`Finding athlete with ID: ${id}`, "updateBankData");

            const athlete = await this.athleteRepository.findOne({
                where: { id },
                relations: ["bankDetails"],
            });

            if (!athlete) {
                Logger.warn(
                    `Athlete with ID ${id} does not exist`,
                    "updateBankData"
                );
                return notFoundRes("Athlete does not exist");
            }

            if (!athlete.bankDetails) {
                Logger.warn(
                    `Bank details do not exist for athlete with ID ${id}`,
                    "updateBankData"
                );
                return notFoundRes(
                    "Bank details do not exist for this athlete"
                );
            }

            Logger.log(
                `Found athlete: ${athlete.id}, updating bank data`,
                "updateBankData"
            );

            Object.assign(athlete.bankDetails, updateBankDataDto);

            await this.athleteRepository.save(athlete);

            Logger.log(
                `Bank data updated successfully for athlete ID: ${athlete.id}`,
                "updateBankData"
            );
            return foundRes("Bank data updated successfully", athlete);
        } catch (error) {
            Logger.error(
                `Error updating bank data for athlete ID: ${id} - ${error.message}`,
                "updateBankData"
            );
            return errorRes("Failed to update bank data");
        }
    }

    async getAthleteAnalytics(
        athleteId: string,
        startDate: string,
        endDate: string
    ): Promise<any> {
        return await this.athleteRepository.manager.transaction(
            async (transactionalEntityManager: EntityManager) => {
                const result = await AthleteUtil.getAthleteAnalytics(
                    athleteId,
                    transactionalEntityManager,
                    startDate,
                    endDate
                );
                return foundRes(
                    "Athlete analytics retrieved successfully",
                    result
                );
            }
        );
    }

    async handleNinExpirationNotifications(): Promise<void> {
        const oneMonthBefore = new Date();
        oneMonthBefore.setMonth(oneMonthBefore.getMonth() + 1);

        const expiredAthletes = await this.athleteRepository.find({
            where: { ninExpirationDate: LessThan(new Date()) },
            relations: ["academy", "subscription"],
        });

        const aboutToExpireAthletes = await this.athleteRepository.find({
            where: { ninExpirationDate: Between(new Date(), oneMonthBefore) },
            relations: ["academy", "subscription"],
        });

        for (const athlete of aboutToExpireAthletes) {
            await this.notificationService.createNotification(
                athlete.academy.id,
                "NIN Expiration Reminder",
                `Your NIN is about to expire on ${athlete.ninExpirationDate}. Please renew it before the expiration date.`,
                "RENEWAL_REMINDER"
            );
        }

        for (const athlete of expiredAthletes) {
            await this.notificationService.createNotification(
                athlete.academy.id,
                "NIN Expired",
                `Your NIN has expired on ${athlete.ninExpirationDate}. Please take immediate action to renew it.`,
                "EXPIRED_ALERT"
            );
        }
    }

    async getAthletes(
        user: any,
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<Athlete>> {
        const { academy, branch, role, coachId } = user.payload;

        const queryBuilder = this.athleteRepository
            .createQueryBuilder("athlete")
            .leftJoinAndSelect("athlete.subscription", "subscription")
            .leftJoinAndSelect("athlete.teams", "teams")
            .leftJoinAndSelect("athlete.athleteProfiles", "athleteProfiles")
            .where("athlete.academyId = :academyId", { academyId: academy.id });

        if (branch?.id) {
            queryBuilder.andWhere("athlete.branchId = :branchId", {
                branchId: branch.id,
            });
        }

        if (role === UserRole.COACH) {
            queryBuilder.andWhere("teams.coachId = :coachId", { coachId });
        }

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (key === "level") {
                    queryBuilder.andWhere(`athlete.${key} = :${key}`, {
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
                } else {
                    queryBuilder.andWhere(`athlete.${key} LIKE :${key}`, {
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
                    `SUBSTRING(athlete.${sortField}, 1, 1)`,
                    sortOrder
                );
            } else {
                queryBuilder.orderBy(`athlete.${sortField}`, sortOrder);
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

    async getAthletesForToday(
        user?: any
    ): Promise<CustomResponseType<Athlete[]>> {
        try {
            const { academy, branch } = user.payload;

            if (!academy.id) {
                return errorRes("Academy ID is required");
            }

            const athletes = await this.athleteRepository.find({
                relations: ["academy", "subscription", "athleteProfiles"],
                where: {
                    academy: { id: academy.id },
                    ...(branch?.id && { branch: { id: branch.id } }),
                },
            });

            if (!athletes.length) {
                return foundRes("No athletes found for today", [], 0);
            }

            const filteredAthletes = athletes.filter((athlete) => {
                const { athleteProfiles } = athlete;

                return !athleteProfiles.length;
            });

            if (!filteredAthletes.length) {
                return foundRes(
                    "No athletes with subscriptions and profiles found for today",
                    [],
                    0
                );
            }

            return foundRes(
                "Athletes with subscriptions and profiles found for today",
                filteredAthletes,
                filteredAthletes.length
            );
        } catch (error) {
            return errorRes(
                error.message ||
                    "An error occurred while retrieving athletes for today"
            );
        }
    }

    async getAthleteById(id: string): Promise<CustomResponseType<Athlete>> {
        try {
            const athlete = await this.athleteRepository.findOne({
                where: { id },
                relations: ["academy", "subscription"],
            });

            if (!athlete) {
                return notFoundRes("Athlete does not exist");
            }

            return foundRes("Athlete has been found", athlete);
        } catch (error) {
            return errorRes(
                error.message ||
                    "An error occurred while retrieving the athlete"
            );
        }
    }

    async createAthlete(
        createAthleteDto: CreateAthleteDto,
        user: any
    ): Promise<CustomResponseType<Athlete>> {
        const { academy, branch } = user.payload;

        if (!academy?.id) {
            return errorRes("User's academy ID is missing.");
        }

        try {
            return await this.athleteRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    await AthleteUtil.checkAthleteNIN(
                        createAthleteDto,
                        transactionalEntityManager
                    );

                    const {
                        periodOfSubscription,
                        paymentMethod,
                        cashValue,
                        remainingValue,
                        ...rest
                    } = createAthleteDto as any;

                    const newAthlete = transactionalEntityManager.create(
                        Athlete,
                        {
                            ...rest,
                            academy,
                            ...(branch?.id && { branch }),
                        }
                    );

                    const savedAthlete = await transactionalEntityManager.save(
                        Athlete,
                        newAthlete
                    );

                    const subscription = transactionalEntityManager.create(
                        AthleteSubscription,
                        {
                            status: SubscriptionStatus.ACTIVE,
                            period: periodOfSubscription,
                            athlete: savedAthlete,
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
                        "Athlete has been created successfully",
                        savedAthlete
                    );
                }
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateAthlete(
        id: string,
        updateAthleteDto: UpdateAthleteDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            return await this.athleteRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    const athleteResponse = await this.getAthleteById(id);

                    await AthleteUtil.checkAthleteNIN(
                        {
                            ...updateAthleteDto,
                            academy: athleteResponse.payload.academy.id,
                        },
                        transactionalEntityManager,
                        true,
                        id
                    );

                    if (
                        athleteResponse.status !== 200 ||
                        !athleteResponse.payload
                    ) {
                        return notFoundRes(`Athlete does not exist`);
                    }

                    const updateResult = await AthleteUtil.updateAthleteData(
                        id,
                        updateAthleteDto,
                        transactionalEntityManager,
                        this.academiesService
                    );

                    return newInstanceRes<UpdateResult>(
                        "Athlete has been updated successfully",
                        updateResult
                    );
                }
            );
        } catch (error) {
            return errorRes(error.message || "An error occurred");
        }
    }

    async deleteAthlete(id: string): Promise<CustomResponseType<DeleteResult>> {
        try {
            const athlete = await this.athleteRepository.findOne({
                where: { id },
            });

            if (!athlete) {
                return notFoundRes(
                    "Athlete does not exist"
                ) as CustomResponseType<DeleteResult>;
            }

            const response = await this.athleteRepository.softDelete(id);
            return deletedRes(
                "Athlete has been soft deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async recoverAthlete(id: string): Promise<CustomResponseType<Athlete>> {
        try {
            await this.athleteRepository.restore(id);
            const athlete = await this.getAthleteById(id);
            if (!athlete.payload) {
                return notFoundRes("Athlete does not exist");
            }
            return foundRes(
                "Athlete has been restored successfully",
                athlete.payload
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

        const queryBuilder = this.athleteRepository
            .createQueryBuilder("athlete")
            .leftJoinAndSelect("athlete.subscription", "subscription")
            .leftJoinAndSelect("athlete.teams", "teams")
            .leftJoinAndSelect("athlete.athleteProfiles", "athleteProfiles")
            .where("athlete.academyId = :academyId", { academyId: academy.id });

        if (branch?.id) {
            queryBuilder.andWhere("athlete.branchId = :branchId", {
                branchId: branch.id,
            });
        }

        if (role === UserRole.COACH) {
            queryBuilder.andWhere("teams.coachId = :coachId", { coachId });
        }

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (key === "level") {
                    queryBuilder.andWhere(`athlete.${key} = :${key}`, {
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
                } else {
                    queryBuilder.andWhere(`athlete.${key} LIKE :${key}`, {
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
                    `SUBSTRING(athlete.${sortField}, 1, 1)`,
                    sortOrder
                );
            } else {
                queryBuilder.orderBy(`athlete.${sortField}`, sortOrder);
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
}
