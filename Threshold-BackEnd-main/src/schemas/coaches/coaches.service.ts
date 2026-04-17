import { AcademiesService } from "../academies/academies.service";
import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, EntityManager, Repository, UpdateResult } from "typeorm";
import { Coach } from "../../entities/coach.entity";
import { CreateCoachDto } from "../../dto/coaches/create-coach.dto";
import { UpdateCoachDto } from "../../dto/coaches/update-coach.dto";
import { CoachFields } from "../../enums/tables-data.enum";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { filteredGetQuery } from "src/middlewares/filters";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import { UsersService } from "../users/users.service";
import { GetCoachSessionsDto } from "src/dto/coaches/get-coach-sessions.dto";
import { Team } from "src/entities/team.entity";
import { Session } from "src/entities/session.entity";
import { CoachUtil } from "src/lib/helpers/coach.util";
import {
    IPaginationOptions,
    Pagination,
    paginate,
} from "nestjs-typeorm-paginate";

@Injectable()
export class CoachesService {
    constructor(
        @InjectRepository(Coach)
        private readonly coachRepository: Repository<Coach>,
        // ----- external services -----
        private readonly academiesService: AcademiesService,
        private usersService: UsersService
    ) {}

    // --- Basic REST APIs ---

    async getSessionsByCoach(
        query: GetCoachSessionsDto,
        user: any
    ): Promise<CustomResponseType<Session[]>> {
        const coachId = user?.payload?.coachId;
        if (!coachId) {
            return errorRes("Invalid coach ID");
        }

        try {
            const sessions = await this.coachRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    const teams = await transactionalEntityManager.find(Team, {
                        where: { coach: { id: coachId } },
                    });

                    if (teams.length === 0) {
                        return [];
                    }

                    const teamIds = teams.map((team) => team.id);

                    if (teamIds.length === 0) {
                        return [];
                    }

                    let qb = transactionalEntityManager
                        .createQueryBuilder(Session, "session")
                        .innerJoinAndSelect("session.team", "team")
                        .where("team.id IN (:...teamIds)", { teamIds });

                    if (query.date) {
                        qb = CoachUtil.applyDateFilter(qb, query.date);
                    }

                    return await qb.getMany();
                }
            );

            const groupedSessions = CoachUtil.groupSessionsByTeam(sessions);

            return foundRes(
                groupedSessions.length
                    ? "Sessions have been found"
                    : "No sessions found",
                groupedSessions,
                groupedSessions.length
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getCoachIdByUserId(userId: string): Promise<string> {
        const coach = await this.coachRepository.findOne({
            where: { user: { id: userId } },
        });
        return coach ? coach.id : null;
    }

    async getCoaches(
        user: any,
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<Coach>> {
        const { academy, branch } = user.payload;

        const queryBuilder = this.coachRepository.createQueryBuilder("coach");

        queryBuilder.loadAllRelationIds({ relations: ["teams", "user"] });

        queryBuilder.where("coach.academyId = :academyId", {
            academyId: academy.id,
        });
        if (branch?.id) {
            queryBuilder.andWhere("coach.branchId = :branchId", {
                branchId: branch.id,
            });
        }

        // Apply filters
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                if (key === "sport") {
                    queryBuilder.andWhere(`coach.${key} = :${key}`, {
                        [key]: filters[key],
                    });
                } else if (key === "team") {
                    queryBuilder.andWhere(`teams.name LIKE :team`, {
                        team: `%${filters[key]}%`,
                    });
                } else {
                    queryBuilder.andWhere(`coach.${key} LIKE :${key}`, {
                        [key]: `%${filters[key]}%`,
                    });
                }
            }
        });

        if (sortField) {
            if (sortField === "team") {
                queryBuilder.orderBy("teams.name", sortOrder);
            } else {
                queryBuilder.orderBy(`coach.${sortField}`, sortOrder);
            }
        }

        return paginate<Coach>(queryBuilder, options);
    }

    async getCoachById(id: string): Promise<CustomResponseType<Coach>> {
        try {
            const response = await this.coachRepository.findOne({
                select: {
                    user: {
                        username: true,
                        email: true,
                    },
                },
                where: {
                    id,
                },
                relations: ["user", "teams"],
            });

            if (!response) return notFoundRes("Coach does not exist");

            return foundRes("Coach has been found", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createCoach(
        createCoachDto: CreateCoachDto,
        user: any
    ): Promise<CustomResponseType<Coach>> {
        try {
            const { academy, branch } = user.payload;

            const updatedCreateCoachDto = {
                ...createCoachDto,
                academy: academy.id,
                branch: branch?.id,
            };

            const userCreationResult =
                await this.usersService.createUserForCoach(
                    updatedCreateCoachDto
                );

            if (userCreationResult.status !== HttpStatus.CREATED) {
                return errorRes(userCreationResult.payload);
            }

            const { coach } = userCreationResult.payload;

            return foundRes<Coach>(
                "Coach has been created successfully",
                coach
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateCoach(
        id: string,
        updateCoachDto: UpdateCoachDto,
        user: any
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            const { academy } = user.payload;

            if (!academy) {
                return notFoundRes("Academy doesn't exist");
            }

            const coach = await this.getCoachById(id);
            if (!coach) {
                return notFoundRes("Coach does not exist");
            }

            const { ...rest } = updateCoachDto;

            const coachObj = {
                ...rest,
                academy,
            };

            const response = await this.coachRepository.update(
                { id },
                coachObj
            );

            return foundRes<UpdateResult>(
                "Coach has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteCoach(id: string): Promise<CustomResponseType<DeleteResult>> {
        try {
            const coach = await this.coachRepository.findOne({ where: { id } });

            if (!coach) {
                return notFoundRes(
                    "Coach does not exist"
                ) as CustomResponseType<DeleteResult>;
            }

            const response = await this.coachRepository.softDelete(id);
            return deletedRes(
                "Coach has been soft deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async recoverCoach(id: string): Promise<CustomResponseType<Coach>> {
        try {
            await this.coachRepository.restore(id);
            const coach = await this.coachRepository.findOne({ where: { id } });
            if (!coach) {
                return notFoundRes("Coach does not exist after recovery");
            }
            return foundRes("Coach has been restored successfully", coach);
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
