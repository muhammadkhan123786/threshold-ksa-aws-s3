import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Repository,
    UpdateResult,
    DeleteResult,
    SelectQueryBuilder,
} from "typeorm";
import { Session } from "../../entities/session.entity";
import { PlayingSessionType } from "src/enums/athletes.enum";
import {
    IPaginationOptions,
    paginateRaw,
    Pagination,
} from "nestjs-typeorm-paginate";
import {
    errorRes,
    foundRes,
    newInstanceRes,
    deletedRes,
} from "src/lib/responses/restResponse";
import CustomResponseType from "src/types/customResponseType";
import { UpdateSessionDto } from "src/dto/sessions/update-session.dto";
import { CreateSessionDto } from "src/dto/sessions/create-session.dto";
import { Academy } from "../../entities/academy.entity";
import { Team } from "../../entities/team.entity";

@Injectable()
export class ExamSessionsService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @InjectRepository(Academy)
        private readonly academyRepository: Repository<Academy>,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>
    ) {}

    async getExamSessions(
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<Session>> {
        const queryBuilder: SelectQueryBuilder<Session> = this.sessionRepository
            .createQueryBuilder("session")
            .where("session.type = :type", { type: PlayingSessionType.EXAM })
            .leftJoin("session.team", "team")
            .select([
                "session.id AS id",
                "session.updatedAt AS updatedAt",
                "session.createdAt AS createdAt",
                "session.status AS status",
                "session.from AS from",
                "session.to AS to",
                "session.date AS date",
                "team.id AS teamId",
            ])
            .orderBy(`session.${sortField}`, sortOrder);

        if (filters.startDate && filters.endDate) {
            queryBuilder.andWhere(
                "session.date BETWEEN :startDate AND :endDate",
                {
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                }
            );
        }

        if (filters.status) {
            queryBuilder.andWhere("session.status = :status", {
                status: filters.status,
            });
        }

        if (filters.teamId) {
            queryBuilder.andWhere("team.id = :teamId", {
                teamId: filters.teamId,
            });
        }

        if (filters.searchQuery) {
            queryBuilder.andWhere(
                "session.description ILIKE :searchQuery OR session.title ILIKE :searchQuery",
                {
                    searchQuery: `%${filters.searchQuery}%`,
                }
            );
        }

        return paginateRaw(queryBuilder, options);
    }

    private async getAcademyById(academyId: string): Promise<Academy | null> {
        return this.academyRepository.findOne({ where: { id: academyId } });
    }

    private async getTeamById(teamId: string): Promise<Team | null> {
        return this.teamRepository.findOne({ where: { id: teamId } });
    }

    async createExamSession(
        createSessionDto: CreateSessionDto
    ): Promise<CustomResponseType<Session>> {
        try {
            const {
                academy: academyId,
                team: teamId,
                ...rest
            } = createSessionDto;

            const academy = await this.getAcademyById(academyId);
            if (!academy) return errorRes("Academy not found");

            const team = await this.getTeamById(teamId);
            if (!team) return errorRes("Team not found");

            const session = this.sessionRepository.create({
                ...rest,
                academy: academy,
                team: team,
            });

            const response = await this.sessionRepository.save(session);

            return newInstanceRes(
                "Exam session created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateExamSession(
        id: string,
        updateSessionDto: UpdateSessionDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            const session = await this.sessionRepository.findOne({
                where: { id, type: PlayingSessionType.EXAM },
            });

            if (!session) {
                return errorRes("Exam session not found");
            }

            const {
                academy: academyId,
                team: teamId,
                ...rest
            } = updateSessionDto;

            const updateData: Partial<Session> = { ...rest };

            if (academyId) {
                const academy = await this.getAcademyById(academyId);
                if (!academy) return errorRes("Academy not found");
                updateData.academy = academy;
            }

            if (teamId) {
                const team = await this.getTeamById(teamId);
                if (!team) return errorRes("Team not found");
                updateData.team = team;
            }

            const response = await this.sessionRepository.update(
                { id },
                updateData
            );

            return foundRes("Exam session updated successfully", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async softDeleteExamSession(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const session = await this.sessionRepository.findOne({
                where: { id, type: PlayingSessionType.EXAM },
            });

            if (!session) {
                return errorRes("Exam session not found");
            }

            const response = await this.sessionRepository.softDelete(id);

            return deletedRes("Exam session deleted successfully", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
