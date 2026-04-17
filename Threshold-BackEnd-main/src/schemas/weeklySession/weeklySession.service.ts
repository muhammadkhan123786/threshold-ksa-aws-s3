import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import { WeeklySession } from "src/entities/weeklySession.entity";
import { CreateWeeklySessionDto } from "src/dto/sessions/create-weekly-session.dto";
import CustomResponseType from "src/types/customResponseType";
import { UpdateWeeklySessionDto } from "src/dto/sessions/update-weekly-session.dto";
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from "nestjs-typeorm-paginate";
import { Session } from "src/entities/session.entity";
import { CreateSessionDto } from "src/dto/sessions/create-session.dto";
import { TeamsService } from "../teams/teams.service";
import { AcademiesService } from "../academies/academies.service";

@Injectable()
export class WeeklySessionService {
    constructor(
        private readonly academiesService: AcademiesService,
        private readonly teamsService: TeamsService,

        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @InjectRepository(WeeklySession)
        private readonly weeklySessionRepository: Repository<WeeklySession>
    ) {}

    async createSessionUnderWeeklySession(
        weeklySessionId: string,
        createSessionDto: CreateSessionDto
    ): Promise<CustomResponseType<any>> {
        try {
            const weeklySession = await this.weeklySessionRepository.findOne({
                where: { id: weeklySessionId },
                relations: ["academy", "team"],
            });

            console.log("weeklySession", weeklySession);
            if (!weeklySession) return notFoundRes("Weekly session not found");

            if (!weeklySession.academy)
                return notFoundRes("Academy doesn't exist");

            const team = await this.teamsService.getTeamInfo(
                createSessionDto.team
            );
            if (!weeklySession.team) return notFoundRes("Team doesn't exist");

            const session = this.sessionRepository.create({
                ...createSessionDto,
                weeklySession,
                academy: weeklySession.academy,
                team: weeklySession.team,
            });

            const savedSession = await this.sessionRepository.save(session);

            return foundRes(
                "Session created under weekly session",
                savedSession
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getSessionsUnderWeeklySession(
        weeklySessionId: string
    ): Promise<CustomResponseType<Session[]>> {
        try {
            const weeklySession = await this.weeklySessionRepository.findOne({
                where: { id: weeklySessionId },
                relations: ["sessions"],
            });
            if (!weeklySession) return notFoundRes("Weekly session not found");

            return newInstanceRes("Sessions retrieved", weeklySession.sessions);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateSessionUnderWeeklySession(
        sessionId: string,
        weeklySessionId: string,
        updateSessionDto: any
    ): Promise<CustomResponseType<Session>> {
        try {
            const session = await this.sessionRepository.findOne({
                where: {
                    id: sessionId,
                    weeklySession: { id: weeklySessionId },
                },
            });
            if (!session)
                return notFoundRes("Session not found under weekly session");

            Object.assign(session, updateSessionDto);
            const updatedSession = await this.sessionRepository.save(session);

            return newInstanceRes("Session updated", updatedSession);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteSessionUnderWeeklySession(
        sessionId: string,
        weeklySessionId: string
    ): Promise<CustomResponseType<any>> {
        try {
            const session = await this.sessionRepository.findOne({
                where: {
                    id: sessionId,
                    weeklySession: { id: weeklySessionId },
                },
            });
            if (!session)
                return notFoundRes("Session not found under weekly session");

            await this.sessionRepository.delete(sessionId);

            return newInstanceRes("Session deleted", null);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createWeeklySession(
        createWeeklySessionDto: CreateWeeklySessionDto,
        user: any,
        teamId: string
    ): Promise<CustomResponseType<WeeklySession>> {
        try {
            if (
                !user ||
                !user.payload ||
                !user.payload.academy ||
                !user.payload.academy.id
            ) {
                return errorRes(
                    "Academy information is missing from the user object."
                );
            }

            const academyId = user.payload.academy.id;

            const weeklySession = this.weeklySessionRepository.create({
                ...createWeeklySessionDto,
                academy: { id: academyId },
                team: { id: teamId },
            });

            const response =
                await this.weeklySessionRepository.save(weeklySession);

            return foundRes(
                "Weekly session has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getWeeklySessions(
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<WeeklySession>> {
        const queryBuilder = this.weeklySessionRepository
            .createQueryBuilder("weeklySession")
            .leftJoinAndSelect("weeklySession.sessions", "session");

        if (filters.searchQuery) {
            queryBuilder.andWhere(
                `(
                    weeklySession.title ILIKE :searchQuery OR
                    weeklySession.description ILIKE :searchQuery
                )`,
                { searchQuery: `%${filters.searchQuery}%` }
            );
        }

        if (filters.weekDate) {
            queryBuilder.andWhere("weeklySession.weekDate = :weekDate", {
                weekDate: filters.weekDate,
            });
        }

        if (filters.academyId) {
            queryBuilder.andWhere("weeklySession.academyId = :academyId", {
                academyId: filters.academyId,
            });
        }

        if (filters.teamId) {
            queryBuilder.andWhere("weeklySession.teamId = :teamId", {
                teamId: filters.teamId,
            });
        }

        queryBuilder.orderBy(`weeklySession.${sortField}`, sortOrder);

        return paginate<WeeklySession>(queryBuilder, options);
    }

    async getWeeklySessionById(
        id: string
    ): Promise<CustomResponseType<WeeklySession>> {
        try {
            const weeklySession = await this.weeklySessionRepository.findOne({
                where: { id },
                relations: ["sessions"],
            });

            if (!weeklySession) {
                return notFoundRes("Weekly session not found");
            }

            return foundRes(
                "Weekly session retrieved successfully",
                weeklySession
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateWeeklySession(
        id: string,
        updateWeeklySessionDto: UpdateWeeklySessionDto
    ): Promise<CustomResponseType<WeeklySession>> {
        try {
            const weeklySession = await this.weeklySessionRepository.findOne({
                where: { id },
            });

            if (!weeklySession) {
                return notFoundRes("Weekly session not found");
            }

            Object.assign(weeklySession, updateWeeklySessionDto);

            const response =
                await this.weeklySessionRepository.save(weeklySession);

            return foundRes("Weekly session updated successfully", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteWeeklySession(
        id: string
    ): Promise<CustomResponseType<WeeklySession>> {
        try {
            const result = await this.weeklySessionRepository.delete(id);

            if (!result.affected) {
                return notFoundRes("Weekly session not found");
            }

            return foundRes("Weekly session deleted successfully", null);
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
