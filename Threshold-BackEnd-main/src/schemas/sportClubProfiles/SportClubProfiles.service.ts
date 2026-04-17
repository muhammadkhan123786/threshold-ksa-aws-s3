import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

import CustomResponseType from "src/types/customResponseType";
import {
    foundRes,
    notFoundRes,
    newInstanceRes,
    deletedRes,
    errorRes,
    exceptionRes,
} from "src/lib/responses/restResponse";
import { S3Service } from "src/s3/s3.service";
import { UpdateSportClubProfileDto } from "src/dto/sportClubProfile/UpdateSportClubProfile.dto";
import { CreateSportClubProfileDto } from "src/dto/sportClubProfile/CreateSportClubProfile.dto";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { Academy } from "src/entities/academy.entity";
import { Manager } from "src/entities/manager.entity";

@Injectable()
export class SportClubProfilesService {
    private readonly logger = new Logger(SportClubProfilesService.name);

    constructor(
        @InjectRepository(sportClubProfiles)
        private readonly sportClubProfilesRepository: Repository<sportClubProfiles>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
        private readonly s3Service: S3Service
    ) {}

    private generateS3Path(academyId: string, profileName: string): string {
        return `academies/${academyId}/sport-club-profiles/${profileName}`;
    }

    async getAll(
        academyId?: string,
        includeInactive: boolean = false
    ): Promise<CustomResponseType<sportClubProfiles[]>> {
        this.logger.log(
            `Fetching sport club profiles${academyId ? ` for academy ID: ${academyId}` : ""}, includeInactive: ${includeInactive}`
        );
        try {
            let whereClause: any = {};

            if (academyId) {
                whereClause.academy = { id: academyId };
            }

            if (!includeInactive) {
                whereClause.active = true;
            }

            const profiles = await this.sportClubProfilesRepository.find({
                where: whereClause,
                relations: ["academy"],
            });

            return foundRes(
                "Sport club profiles fetched successfully",
                profiles,
                profiles.length
            );
        } catch (error) {
            this.logger.error(
                "Error fetching sport club profiles",
                error.stack
            );
            return errorRes(error);
        }
    }
    async getByClubId(
        clubId: string,
        includeInactive: boolean = false
    ): Promise<CustomResponseType<sportClubProfiles[]>> {
        this.logger.log(
            `Fetching sport club profiles for academy ID: ${clubId}, includeInactive: ${includeInactive}`
        );
        try {
            const queryBuilder = this.sportClubProfilesRepository
                .createQueryBuilder("profile")
                .leftJoinAndSelect("profile.mainManagers", "mainManagers")
                .leftJoinAndSelect("mainManagers.user", "managerUser")
                .where("profile.academyId = :clubId", { clubId });

            if (!includeInactive) {
                queryBuilder.andWhere("profile.active = :active", {
                    active: true,
                });
            }

            const clubProfiles = await queryBuilder
                .loadRelationCountAndMap("profile.teamsCount", "profile.teams")
                .loadRelationCountAndMap(
                    "profile.coachesCount",
                    "profile.coaches"
                )
                .loadRelationCountAndMap(
                    "profile.athletesCount",
                    "profile.athletes"
                )
                .loadRelationCountAndMap(
                    "profile.mainManagersCount",
                    "profile.mainManagers"
                )
                .select([
                    "profile.id",
                    "profile.avatarUrl",
                    "profile.sport",
                    "profile.active",
                    "profile.createdAt",
                    "profile.updatedAt",
                    "mainManagers.id",
                    "mainManagers.firstName",
                    "mainManagers.lastName",
                    "managerUser.id",
                    "managerUser.role",
                ])
                .getMany();

            if (!clubProfiles || clubProfiles.length === 0) {
                return notFoundRes(
                    `No profiles found for academy ID "${clubId}"`
                );
            }

            const profilesWithSignedUrls = await Promise.all(
                clubProfiles.map(async (profile) => {
                    if (profile.avatarUrl) {
                        try {
                            profile.avatarUrl = await this.s3Service.getFileUrl(
                                profile.avatarUrl
                            );
                        } catch (error) {
                            this.logger.warn(
                                `Failed to generate signed URL for avatar: ${profile.avatarUrl}`,
                                error.stack
                            );
                        }
                    }
                    return profile;
                })
            );

            return foundRes(
                "Club profiles fetched successfully",
                profilesWithSignedUrls
            );
        } catch (error) {
            console.log("error", error);

            this.logger.error(
                `Error fetching club profiles for academy ID: ${clubId}`,
                error.stack
            );
            return errorRes(error);
        }
    }

    async getById(id: string): Promise<CustomResponseType<sportClubProfiles>> {
        this.logger.log(`Fetching sport club profile with ID: ${id}`);
        try {
            const profile = await this.sportClubProfilesRepository.findOne({
                where: { id },
                relations: ["mainManagers"],
            });
            if (!profile) {
                return notFoundRes(
                    `Sport club profile with ID "${id}" not found`
                );
            }
            return foundRes("Sport club profile fetched successfully", profile);
        } catch (error) {
            this.logger.error(
                `Error fetching sport club profile with ID: ${id}`,
                error.stack
            );
            return errorRes(error);
        }
    }
    async create(
        dto: CreateSportClubProfileDto
    ): Promise<CustomResponseType<sportClubProfiles>> {
        this.logger.log("Creating a new sport club profile");

        try {
            if (!dto.academyId) {
                this.logger.error("Academy ID is required but not provided");
                return errorRes(new Error("Academy ID is required"));
            }

            const academy = await this.sportClubProfilesRepository.manager
                .getRepository(Academy)
                .findOne({ where: { id: dto.academyId } });

            if (!academy) {
                this.logger.error(
                    `Academy with ID "${dto.academyId}" not found`
                );
                return errorRes(
                    new Error(`Academy with ID "${dto.academyId}" not found`)
                );
            }

            this.logger.log(
                "DTO validated and proceeding to create profile",
                dto
            );

            // 1) Get the Manager entities by their IDs
            const sportProfileManager = await this.managerRepository.findOne({
                where: { id: dto.sportProfileManagerId },
            });

            const technicalDirector = await this.managerRepository.findOne({
                where: { id: dto.technicalDirectorId },
            });

            if (!sportProfileManager || !technicalDirector) {
                this.logger.error(
                    `One or both managers not found: sportProfileManagerId="${dto.sportProfileManagerId}", technicalDirectorId="${dto.technicalDirectorId}"`
                );
                return errorRes(
                    new Error(
                        `One or both managers not found: sportProfileManagerId="${dto.sportProfileManagerId}", technicalDirectorId="${dto.technicalDirectorId}"`
                    )
                );
            }

            const mainManagers = [sportProfileManager, technicalDirector];

            console.log("dasdasdas", mainManagers);
            // 2) Pass the loaded Manager entities to `mainManagers`
            const newProfile = this.sportClubProfilesRepository.create({
                ...dto,
                academy,
                sport: dto.sportName,
                mainManagers,
            });
            const savedProfile =
                await this.sportClubProfilesRepository.save(newProfile);

            this.logger.log(
                `Sport club profile created with ID: ${savedProfile.id}`
            );

            return foundRes(
                "Sport club profile created successfully",
                savedProfile
            );
        } catch (error) {
            this.logger.error("Error creating sport club profile", error.stack);
            if (error.code === "23505") {
                const message = `A sport profile for this academy with the sport "${dto.sportName}" already exists.`;
                exceptionRes(new Error(message), 409);
            }

            exceptionRes(error);
        }
    }

    async update(
        id: string,
        dto: UpdateSportClubProfileDto
    ): Promise<CustomResponseType<sportClubProfiles>> {
        this.logger.log(`Updating sport club profile with ID: ${id}`);
        try {
            const existingProfile =
                await this.sportClubProfilesRepository.findOne({
                    where: { id },
                });

            if (!existingProfile) {
                return notFoundRes(
                    `Sport club profile with ID "${id}" not found`
                );
            }

            Object.assign(existingProfile, {
                ...dto,
                sport: dto.sportName,
                mainManagerId: dto.sportProfileManagerId,
                technicalDirectorId: dto.technicalDirectorId,
            });
            const updatedProfile =
                await this.sportClubProfilesRepository.save(existingProfile);

            return foundRes(
                "Sport club profile updated successfully",
                updatedProfile
            );
        } catch (error) {
            this.logger.error(
                `Error updating sport club profile with ID: ${id}`,
                error.stack
            );
            return errorRes(error);
        }
    }

    async toggleActive(
        id: string
    ): Promise<CustomResponseType<sportClubProfiles>> {
        this.logger.log(
            `Toggling active status for sport club profile with ID: ${id}`
        );
        try {
            const profile = await this.sportClubProfilesRepository.findOne({
                where: { id },
            });

            if (!profile) {
                return notFoundRes(
                    `Sport club profile with ID "${id}" not found`
                );
            }

            // Toggle the active status
            profile.active = !profile.active;

            const updatedProfile =
                await this.sportClubProfilesRepository.save(profile);

            return foundRes(
                `Sport club profile ${profile.active ? "activated" : "deactivated"} successfully`,
                updatedProfile
            );
        } catch (error) {
            this.logger.error(
                `Error toggling active status for sport club profile with ID: ${id}`,
                error.stack
            );
            return errorRes(error);
        }
    }

    async delete(id: string): Promise<CustomResponseType<null>> {
        this.logger.log(`Deleting sport club profile with ID: ${id}`);
        try {
            const profile = await this.sportClubProfilesRepository.findOne({
                where: { id },
            });
            if (!profile) {
                return notFoundRes(
                    `Sport club profile with ID "${id}" not found`
                );
            }

            if (profile.avatarUrl) {
                await this.s3Service.deleteFile(profile.avatarUrl);
            }

            await this.sportClubProfilesRepository.delete(id);
            return deletedRes("Sport club profile deleted successfully", null);
        } catch (error) {
            this.logger.error(
                `Error deleting sport club profile with ID: ${id}`,
                error.stack
            );
            return errorRes(error);
        }
    }
}
