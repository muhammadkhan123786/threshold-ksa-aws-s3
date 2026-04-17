import { AcademiesService } from "../academies/academies.service";
import { CoachesService } from "../coaches/coaches.service";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, In, Repository } from "typeorm";
import { Team } from "../../entities/team.entity";
import { CreateTeamDto } from "../../dto/teams/create-team.dto";
import { UpdateTeamDto } from "../../dto/teams/update-team.dto";
import CustomResponseType from "src/types/customResponseType";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import { UserRole } from "src/enums/users.enum";
import { Athlete } from "src/entities/athlete.entity";
import {
    IPaginationOptions,
    Pagination,
    paginate,
} from "nestjs-typeorm-paginate";

@Injectable()
export class TeamsService {
    private readonly logger = new Logger(TeamsService.name);

    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        private readonly academiesService: AcademiesService,
        private readonly coachesService: CoachesService
    ) {}

    async getAthletesByTeam(
        teamId: string,
        options: IPaginationOptions,
        filters: any,
        searchQuery?: string
    ): Promise<Pagination<Athlete>> {
        const queryBuilder =
            this.athleteRepository.createQueryBuilder("athlete");

        queryBuilder
            .leftJoinAndSelect("athlete.teams", "team")
            .where("team.id = :teamId", { teamId });

        if (searchQuery) {
            queryBuilder.andWhere(
                `(
                    athlete.firstName ILIKE :searchQuery OR
                    athlete.lastName ILIKE :searchQuery OR
                    athlete.nin ILIKE :searchQuery OR
                    athlete.schoolName ILIKE :searchQuery
                )`,
                { searchQuery: `%${searchQuery}%` }
            );
        }

        if (filters.status) {
            queryBuilder.andWhere("athlete.status = :status", {
                status: filters.status,
            });
        }

        if (filters.age) {
            const currentYear = new Date().getFullYear();
            const birthYear = currentYear - filters.age;
            queryBuilder.andWhere(
                "EXTRACT(YEAR FROM athlete.dateOfBirth) = :birthYear",
                { birthYear }
            );
        }

        if (filters.categories) {
            queryBuilder.andWhere("athlete.level = :level", {
                level: filters.categories,
            });
        }

        queryBuilder.orderBy("athlete.firstName", "ASC");

        return paginate<Athlete>(queryBuilder, options);
    }

    async getTeams(
        user: any,
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<Team>> {
        const { academy, branch, role, coachId } = user.payload;

        const queryBuilder = this.teamRepository.createQueryBuilder("team");

        queryBuilder.loadAllRelationIds({ relations: ["athletes", "coach"] });

        queryBuilder.where("team.academyId = :academyId", {
            academyId: academy.id,
        });

        if (branch?.id) {
            queryBuilder.andWhere("team.branchId = :branchId", {
                branchId: branch.id,
            });
        }

        if (role === UserRole.COACH) {
            queryBuilder.andWhere("team.coachId = :coachId", { coachId });
        }

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (key === "sport") {
                    queryBuilder.andWhere(`team.${key} = :${key}`, {
                        [key]: filters[key],
                    });
                } else {
                    queryBuilder.andWhere(`team.${key} LIKE :${key}`, {
                        [key]: `%${filters[key]}%`,
                    });
                }
            }
        });

        if (sortField) {
            queryBuilder.orderBy(`team.${sortField}`, sortOrder);
        }

        return paginate<Team>(queryBuilder, options);
    }

    async getTeamInfo(id: string): Promise<CustomResponseType<Team>> {
        try {
            this.logger.log(`Fetching team info for team ID: ${id}`);

            const team = await this.teamRepository.findOne({
                where: { id },
                relations: [
                    "academy",
                    "coach",
                    "athletes",
                    "athletes.subscription",
                ],
            });

            if (!team) {
                this.logger.warn(`Team not found for ID: ${id}`);
                return notFoundRes("Team does not exist");
            }

            this.logger.log(`Team info found for ID: ${id}`);
            return foundRes("Team found successfully", team);
        } catch (error) {
            this.logger.error(
                `Error retrieving team info for ID: ${id}`,
                error.stack
            );
            return errorRes(`Failed to retrieve team: ${error.message}`);
        }
    }

    async createTeam(
        createTeamDto: CreateTeamDto,
        user: any
    ): Promise<CustomResponseType<Team>> {
        try {
            const { academy, branch } = user.payload;

            if (!academy?.id) {
                return notFoundRes("User's academy ID is missing.");
            }

            const { coach: coachId, athletes, ...rest } = createTeamDto;

            const coach = coachId
                ? await this.coachesService.getCoachById(coachId)
                : null;
            if (coachId && coach.status !== 200)
                return notFoundRes("Coach doesn't exist");

            const team = this.teamRepository.create({
                ...rest,
                academy,
                coach: coach?.payload,
                ...(branch?.id && { branch }),
            });

            if (athletes?.length) {
                const athleteEntities = await this.athleteRepository.findBy({
                    id: In(athletes),
                });

                if (athleteEntities.length !== athletes.length) {
                    return notFoundRes("Some athletes were not found");
                }
                team.athletes = athleteEntities;
            }

            const savedTeam = await this.teamRepository.save(team);
            return foundRes<Team>(
                "Team has been created successfully",
                savedTeam
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateTeam(
        id: string,
        updateTeamDto: UpdateTeamDto
    ): Promise<CustomResponseType<Team>> {
        try {
            const updatedTeam = await this.teamRepository.manager.transaction(
                async (transactionalEntityManager) => {
                    // Check if the team exists
                    const team = await transactionalEntityManager.findOneOrFail(
                        Team,
                        {
                            where: { id },
                            relations: ["athletes", "academy", "coach"],
                        }
                    );

                    // Deconstruct DTO and extract relational IDs and other fields
                    const {
                        academy: academyId,
                        coach: coachId,
                        athletes,
                        ...rest
                    } = updateTeamDto;
                    const teamObj = { ...rest };

                    // Handle academy update
                    if (academyId) {
                        const academy =
                            await this.academiesService.getAcademyById(
                                academyId
                            );
                        if (academy.status !== 200) {
                            throw new Error("Academy doesn't exist");
                        }
                        team.academy = academy.payload;
                    }

                    // Handle coach update
                    if (coachId) {
                        const coach =
                            await this.coachesService.getCoachById(coachId);
                        if (coach.status !== 200) {
                            throw new Error("Coach doesn't exist");
                        }
                        team.coach = coach.payload;
                    }

                    // Handle other fields update
                    Object.assign(team, teamObj);

                    // Handle athletes update
                    if (athletes && athletes.length > 0) {
                        const athletesObjs =
                            await transactionalEntityManager.findByIds(
                                Athlete,
                                athletes
                            );

                        if (athletesObjs && athletesObjs.length > 0) {
                            team.athletes = athletesObjs;
                        } else {
                            throw new Error(
                                "Error while updating athletes or no athletes found"
                            );
                        }
                    }

                    // Save the updated team entity
                    return await transactionalEntityManager.save(team);
                }
            );

            // Return success response
            return newInstanceRes<Team>(
                "Team has been updated successfully",
                updatedTeam
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllTeams(): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.teamRepository.query(
                `TRUNCATE TABLE "team" CASCADE;`
            );

            return deletedRes("Teams data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteTeam(id: string): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.teamRepository.delete(id);

            if (!response) {
                return notFoundRes("Team does not exist");
            }

            return deletedRes("Team has been deleted successfully", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
