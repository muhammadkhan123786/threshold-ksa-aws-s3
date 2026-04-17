import { AthletesService } from "../athletes/athletes.service";
import { SessionsService } from "../sessions/sessions.service";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { SessionRecord } from "../../entities/sessionRecord.entity";
import { CreateSessionRecordDto } from "../../dto/sessionRecords/create-sessionRecord.dto";
import { UpdateSessionRecordDto } from "../../dto/sessionRecords/update-sessionRecord.dto";
import { SessionRecordFields } from "../../enums/tables-data.enum";
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
import { SessionRecordStatus } from "src/enums/athletes.enum";

@Injectable()
export class SessionRecordsService {
    constructor(
        @InjectRepository(SessionRecord)
        private readonly sessionRecordRepository: Repository<SessionRecord>,
        // ----- external services -----
        private readonly athletesService: AthletesService,
        @Inject(forwardRef(() => SessionsService))
        private readonly sessionsService: SessionsService
    ) {}

    // --- Basic REST APIs ---

    async getSessionRecords(
        query: GetAllProps<SessionRecordFields>,
        status: SessionRecordStatus
    ): Promise<CustomResponseType<SessionRecord[]>> {
        try {
            const findQuery = filteredGetQuery(query);
            if (status)
                findQuery.where = {
                    ...findQuery.where,
                    status,
                };

            const response = await this.sessionRecordRepository.find(findQuery);

            const uniqueRecords = response.filter(
                (record, index, self) =>
                    index ===
                    self.findIndex((r) => r.athlete.id === record.athlete.id)
            );
            return foundRes(
                response.length
                    ? "SessionRecords have been found"
                    : "SessionRecords list is empty",
                uniqueRecords
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getSessionRecordById(
        id: string
    ): Promise<CustomResponseType<SessionRecord>> {
        try {
            const response = await this.sessionRecordRepository.findOneBy({
                id,
            });

            if (!response) return notFoundRes("SessionRecord does not exist");

            return foundRes("SessionRecord has been found", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createSessionRecord(
        createSessionRecordDto: CreateSessionRecordDto
    ): Promise<CustomResponseType<SessionRecord>> {
        try {
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_CREATE ---
                athlete: athleteId,
                session: sessionId,
                ...rest
            } = createSessionRecordDto;

            console.log(createSessionRecordDto);

            const sessionRecordObj = { ...rest };

            // --- Table ID check - create ---
            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                sessionRecordObj["athlete"] = athlete.payload;
            }

            if (sessionId) {
                const session =
                    await this.sessionsService.getSessionById(sessionId);
                if (session.status !== 200) {
                    return notFoundRes("Session doesn't exist");
                }
                sessionRecordObj["session"] = session.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const newSessionRecord =
                this.sessionRecordRepository.create(sessionRecordObj);
            const response =
                await this.sessionRecordRepository.save(newSessionRecord);
            // --- Post-response - create ---

            // ----------------------
            // return the response
            return newInstanceRes<SessionRecord>(
                "SessionRecord has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateSessionRecord(
        id: string,
        updateSessionRecordDto: UpdateSessionRecordDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            // check if the id exists
            const sessionRecord = await this.getSessionRecordById(id);
            if (!sessionRecord) {
                return notFoundRes(`SessionRecord does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                athlete: athleteId,
                session: sessionId,
                ...rest
            } = updateSessionRecordDto;

            const sessionRecordObj = { ...rest };

            // --- Table ID check - update ---
            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                sessionRecordObj["athlete"] = athlete.payload;
            }

            if (sessionId) {
                const session =
                    await this.sessionsService.getSessionById(sessionId);
                if (session.status !== 200) {
                    return notFoundRes("Session doesn't exist");
                }
                sessionRecordObj["session"] = session.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const response = await this.sessionRecordRepository.update(
                {
                    id,
                },
                sessionRecordObj
            );
            // --- Post-response - update ---

            // ----------------------
            // return the response
            return newInstanceRes<UpdateResult>(
                "SessionRecord has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllSessionRecords(): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.sessionRecordRepository.query(
                `TRUNCATE TABLE "session_record" CASCADE;`
            );

            return deletedRes("SessionRecords data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteSessionRecord(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.sessionRecordRepository.delete(id);

            if (!response) {
                return notFoundRes("SessionRecord does not exist");
            }

            return deletedRes(
                "SessionRecord has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    // --- Relational REST APIs ---
}
