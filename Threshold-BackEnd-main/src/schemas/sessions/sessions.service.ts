import { AcademiesService } from "../academies/academies.service";
import { TeamsService } from "../teams/teams.service";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    DeleteResult,
    EntityManager,
    Repository,
    SelectQueryBuilder,
    UpdateResult,
} from "typeorm";
import { Session } from "../../entities/session.entity";
import { CreateSessionDto } from "../../dto/sessions/create-session.dto";
import { UpdateSessionDto } from "../../dto/sessions/update-session.dto";
import { GetOneProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import { SessionRecordsService } from "../sessionRecords/sessionRecords.service";
import { SessionRecordStatus } from "src/enums/athletes.enum";
import { RELATIONS } from "src/lib/constants/table-relations";
import { CreateRecordSessionDto } from "src/dto/sessions/create-record-session.dto";
import { SessionRecord } from "src/entities/sessionRecord.entity";
import { SessionDto } from "src/dto/sessions/session.dto";
import { PlanningSession } from "src/entities/planningSession.entity";
import { CreatePlanningSessionDto } from "src/dto/sessions/create-planning-session.dto";
import { isEmpty, isNil } from "lodash";
import {
    IPaginationOptions,
    Pagination,
    paginateRaw,
} from "nestjs-typeorm-paginate";

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        // ----- external services -----
        private readonly academiesService: AcademiesService,
        private readonly teamsService: TeamsService,
        @Inject(forwardRef(() => SessionRecordsService))
        private readonly sessionRecordsService: SessionRecordsService,
        @InjectRepository(PlanningSession)
        private readonly planningSessionRepository: Repository<PlanningSession>,
        @InjectRepository(SessionRecord)
        private readonly sessionRecordRepository: Repository<SessionRecord>
    ) {}

    async getPlayerAttendance(playerId: string): Promise<SessionRecord[]> {
        try {
            const attendanceRecords = await this.sessionRecordRepository.find({
                where: {
                    athlete: { id: playerId },
                    session: {
                        sessionRecords: { status: SessionRecordStatus.PRESENT },
                    },
                },
            });
            return attendanceRecords;
        } catch (error) {
            throw new Error(
                `Error retrieving attendance records: ${error.message}`
            );
        }
    }

    async getPresentSessionRecords(athleteId: string) {
        return await this.sessionRecordRepository.find({
            where: {
                athlete: { id: athleteId },
                status: SessionRecordStatus.PRESENT,
            },
            relations: ["session"],
            order: { createdAt: "DESC" },
        });
    }

    async getSessionSummary(athleteId: string) {
        const presentSessions = await this.sessionRecordRepository.count({
            where: {
                athlete: { id: athleteId },
                status: SessionRecordStatus.PRESENT,
            },
        });

        const absentSessions = await this.sessionRecordRepository.count({
            where: {
                athlete: { id: athleteId },
                status: SessionRecordStatus.ABSENT,
            },
        });

        const injurySessions = await this.sessionRecordRepository.count({
            where: {
                athlete: { id: athleteId },
                status: SessionRecordStatus.INJURY,
            },
        });

        const reasonSessions = await this.sessionRecordRepository.count({
            where: {
                athlete: { id: athleteId },
                status: SessionRecordStatus.REASON,
            },
        });

        return {
            presentSessions,
            absentSessions,
            injurySessions,
            reasonSessions,
        };
    }

    async getSessionRecords(athleteId: string) {
        return this.sessionRecordRepository.find({
            where: { athlete: { id: athleteId } },
            relations: ["session"],
            order: { createdAt: "DESC" },
        });
    }

    async softDeletePlanningSession(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response =
                await this.planningSessionRepository.softDelete(id);

            if (!response.affected) {
                return notFoundRes("Planning session does not exist");
            }

            return deletedRes(
                "Planning session has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getSessionAndPlanningSessions(
        id: string
    ): Promise<CustomResponseType<Session[]>> {
        try {
            const session = await this.sessionRepository.find({
                where: { id },
                relations: ["planningSessions"],
                order: { createdAt: "ASC" },
            });

            if (!session) {
                return notFoundRes("Session does not exist");
            }

            return foundRes(
                "Session and planning sessions have been found",
                session
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createPlanningSession(
        sessionId: string,
        createPlanningSessionDto: CreatePlanningSessionDto
    ): Promise<CustomResponseType<PlanningSession>> {
        try {
            const session = await this.sessionRepository.findOne({
                where: { id: sessionId },
            });

            if (!session) {
                return notFoundRes("Session does not exist");
            }

            const newPlanningSession = this.planningSessionRepository.create({
                ...createPlanningSessionDto,
                session,
            });

            const response =
                await this.planningSessionRepository.save(newPlanningSession);

            return newInstanceRes<PlanningSession>(
                "Planning session has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getSessions(
        user: any,
        options: IPaginationOptions,
        filters: any,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<Pagination<Session>> {
        const { academy } = user.payload;
        const queryBuilder: SelectQueryBuilder<Session> = this.sessionRepository
            .createQueryBuilder("session")
            .leftJoin("session.team", "team")
            .leftJoin("session.sessionRecords", "sessionRecord")
            .select([
                "session.id AS id",
                "session.updatedAt AS updatedAt",
                "session.createdAt AS createdAt",
                "session.status AS status",
                "session.from AS from",
                "session.to AS to",
                "session.type AS type",
                "session.date AS date",
                "team.id AS teamId",
                `COALESCE(CEIL(AVG(CASE WHEN sessionRecord.status = :presentStatus THEN sessionRecord.scale ELSE NULL END)), 0) AS avgScale`,
            ])
            .where("session.academyId = :academyId", { academyId: academy.id })
            .setParameter("presentStatus", SessionRecordStatus.PRESENT)
            .groupBy("session.id")
            .addGroupBy("team.id")
            .orderBy(`session.${sortField}`, sortOrder);

        if (filters.status) {
            queryBuilder.andWhere("session.status = :status", {
                status: filters.status,
            });
        }

        if (filters.type) {
            queryBuilder.andWhere("session.type = :type", {
                type: filters.type,
            });
        }

        if (filters.teamId) {
            queryBuilder.andWhere("team.id = :teamId", {
                teamId: filters.teamId,
            });
        }

        const paginatedResult = await paginateRaw(queryBuilder, options);

        return paginatedResult;
    }

    async getSessionById(id: string): Promise<CustomResponseType<Session>> {
        try {
            const response = await this.sessionRepository.find({
                where: { id },
                relations: [
                    "academy",
                    "team",
                    "sessionRecords",
                    "weeklySession",
                ],
            });

            if (!response || response.length === 0)
                return notFoundRes("Session does not exist");

            return foundRes("Session has been found", response[0]);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createSession(
        createSessionDto: CreateSessionDto
    ): Promise<CustomResponseType<Session>> {
        try {
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_CREATE ---
                academy: academyId,
                team: teamId,
                date,
                type,
                from,
                to,
                ...rest
            } = createSessionDto;

            const sessionObj = { from, to, date, type };

            // --- Table ID check - create ---
            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                sessionObj["academy"] = academy.payload;
            }

            if (teamId) {
                const team = await this.teamsService.getTeamInfo(teamId);

                if (team.status !== 200) {
                    return notFoundRes("Team doesn't exist");
                }
                sessionObj["team"] = team.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const newSession = this.sessionRepository.create(sessionObj);
            const response = await this.sessionRepository.save(newSession);

            // --- Post-response - create ---

            const clone: any = structuredClone(rest);

            await Promise.all(
                Object.entries(clone).map(async ([key, value]) => {
                    if (key.indexOf("@") !== 0) {
                        const [fieldName, athleteId] = key.split("@");

                        if (fieldName === "status") {
                            const comment = clone[`comment@${athleteId}`];

                            await this.sessionRecordsService.createSessionRecord(
                                {
                                    athlete: athleteId,
                                    session: newSession.id,
                                    status: value as SessionRecordStatus,
                                    comment: comment || "",
                                }
                            );
                        }
                    }
                })
            );

            // ----------------------
            // return the response
            return newInstanceRes<Session>(
                "Session has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createRecordSession(
        id: string,
        createSessionDto: CreateRecordSessionDto
    ): Promise<CustomResponseType<Session>> {
        try {
            // check if the id exists
            const session = await this.getSessionById(id);
            if (!session) {
                return notFoundRes(`Session does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                academy: academyId,
                team: teamId,
                status,
                ...rest
            } = createSessionDto;

            const sessionObj = { status };

            // --- Table ID check - update ---
            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                sessionObj["academy"] = academy.payload;
            }

            if (teamId) {
                const team = await this.teamsService.getTeamInfo(teamId);
                if (team.status !== 200) {
                    return notFoundRes("Team doesn't exist");
                }
                sessionObj["team"] = team.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const response = await this.sessionRepository.update(
                {
                    id,
                },
                sessionObj
            );

            // --- Post-response - update ---

            const clone: any = structuredClone(rest);

            await Promise.all(
                Object.entries(clone).map(async ([key, value]) => {
                    if (key.indexOf("@") !== 0) {
                        const [fieldName, athleteId] = key.split("@");

                        if (fieldName === "status") {
                            const comment = clone[`comment@${athleteId}`];
                            const scale = clone[`scale@${athleteId}`];

                            await this.sessionRecordsService.createSessionRecord(
                                {
                                    athlete: athleteId,
                                    session: id,
                                    status: value as SessionRecordStatus,
                                    comment: comment || "",
                                    scale,
                                }
                            );
                        }
                    }
                })
            );

            // ----------------------
            // return the response
            return newInstanceRes<any>(
                "Session has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateSession(
        id: string,
        updateSessionDto: UpdateSessionDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            // check if the id exists
            const session = await this.getSessionById(id);
            if (!session) {
                return notFoundRes(`Session does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                academy: academyId,
                team: teamId,
                status,
                ...rest
            } = updateSessionDto;

            const sessionObj = { status };

            // --- Table ID check - update ---
            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                sessionObj["academy"] = academy.payload;
            }

            if (teamId) {
                const team = await this.teamsService.getTeamInfo(teamId);
                if (team.status !== 200) {
                    return notFoundRes("Team doesn't exist");
                }
                sessionObj["team"] = team.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const response = await this.sessionRepository.update(
                {
                    id,
                },
                sessionObj
            );

            // --- Post-response - update ---

            const clone: any = structuredClone(rest);

            await Promise.all(
                Object.entries(clone).map(async ([key, value]) => {
                    if (key.indexOf("@") !== 0) {
                        const [fieldName, sessionRecordId] = key.split("@");

                        if (fieldName === "scale") {
                            const comment = clone[`comment@${sessionRecordId}`];

                            await this.sessionRecordsService.updateSessionRecord(
                                sessionRecordId,
                                {
                                    scale: Number(value),
                                    comment: comment || "",
                                }
                            );
                        }
                    }
                })
            );

            // ----------------------
            // return the response
            return newInstanceRes<UpdateResult>(
                "Session has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllSessions(): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.sessionRepository.query(
                `TRUNCATE TABLE "session" CASCADE;`
            );

            return deletedRes("Sessions data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteSession(id: string): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.sessionRepository.delete(id);

            if (!response) {
                return notFoundRes("Session does not exist");
            }

            return deletedRes(
                "Session has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async saveSession(
        sessionId: string | null,
        sessionDto: SessionDto
    ): Promise<CustomResponseType<Session | UpdateResult>> {
        return await this.sessionRepository.manager.transaction(
            async (transactionalEntityManager: EntityManager) => {
                try {
                    const {
                        academy: academyId,
                        team: teamId,
                        sessionRecords,
                        ...rest
                    } = sessionDto;

                    let newSession: any;
                    const sessionObj: any = { ...rest };

                    if (academyId) {
                        const academy =
                            await this.academiesService.getAcademyById(
                                academyId
                            );
                        if (academy.status !== 200)
                            return notFoundRes("Academy doesn't exist");
                        sessionObj["academy"] = academy.payload;
                    }

                    if (teamId) {
                        const team =
                            await this.teamsService.getTeamInfo(teamId);
                        if (team.status !== 200)
                            return notFoundRes("Team doesn't exist");
                        sessionObj["team"] = team.payload;
                    }

                    let response;

                    if (sessionId) {
                        response = await transactionalEntityManager.update(
                            Session,
                            { id: sessionId },
                            sessionObj
                        );
                    } else {
                        newSession = transactionalEntityManager.create(
                            Session,
                            sessionObj
                        );
                        response = await transactionalEntityManager.save(
                            Session,
                            newSession
                        );
                        sessionId = newSession.id;
                    }

                    await Promise.all(
                        sessionRecords.map(async (record) => {
                            const {
                                id: recordId,
                                athlete,
                                status,
                                comment,
                                scale,
                            } = record;

                            if (recordId) {
                                await transactionalEntityManager.update(
                                    SessionRecord,
                                    { id: recordId },
                                    {
                                        status: status as SessionRecordStatus,
                                        comment: comment,
                                        scale: scale ? Number(scale) : null,
                                    }
                                );
                            } else {
                                const newRecord =
                                    transactionalEntityManager.create(
                                        SessionRecord,
                                        {
                                            athlete: { id: athlete },
                                            session: { id: sessionId },
                                            status: status as SessionRecordStatus,
                                            comment: comment,
                                            scale: scale ? Number(scale) : null,
                                        }
                                    );
                                await transactionalEntityManager.save(
                                    SessionRecord,
                                    newRecord
                                );
                            }
                        })
                    );

                    const message = sessionId
                        ? "Session has been updated successfully"
                        : "Session has been created successfully";
                    return newInstanceRes<Session | UpdateResult>(
                        message,
                        sessionId ? response : newSession
                    );
                } catch (error) {
                    return errorRes(error.message);
                }
            }
        );
    }
}
