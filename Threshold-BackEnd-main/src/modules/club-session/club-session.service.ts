import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Repository,
    Between,
    LessThanOrEqual,
    MoreThanOrEqual,
    In,
} from "typeorm";
import { ClubSession } from "../../entities/clubSession.entity";
import { ClubSessionTemplate } from "../../entities/clubSessionTemplate.entity";
import { Team } from "../../entities/team.entity";
import { Athlete } from "../../entities/athlete.entity";
import {
    CreateClubSessionDto,
    UpdateClubSessionDto,
} from "../../dto/club-session.dto";
import { UpdateSessionResultsDto } from "../../dto/club-session-results.dto";
import { ClubSessionStatus } from "../../entities/clubSession.entity";
import { GetSessionPhasesResponseDto } from "../../dto/club-session/get-session-phases.dto";
import {
    SessionPhaseRecordsResponseDto,
    PhaseRecordResponseDto,
    TechniqueDto,
} from "../../dto/club-session/session-phase-records.dto";
import { UpdateSessionPhaseRecordsDto } from "../../dto/club-session/update-session-phase-records.dto";
import { CalculationMethod } from "../../dto/club-session/measurement-field.dto";
import { UpdateTemplatePhaseOrderRequestDto } from "../../dto/club-session-template/update-template-phase-order.dto";
import { GetTemplatePhasesResponseDto } from "../../dto/club-session-template/get-template-phases.dto";
import { S3Service } from "src/s3/s3.service";
import { SubmitPlayerRevisionDto } from "../../dto/club-session/submit-player-revision.dto";
import { SessionRevisionResponseDto } from "../../dto/club-session/session-revision-response.dto";

@Injectable()
export class ClubSessionService {
    private readonly logger = new Logger(ClubSessionService.name);

    constructor(
        @InjectRepository(ClubSession)
        private clubSessionRepo: Repository<ClubSession>,
        @InjectRepository(ClubSessionTemplate)
        private templateRepo: Repository<ClubSessionTemplate>,
        @InjectRepository(Team)
        private teamRepo: Repository<Team>,
        @InjectRepository(Athlete)
        private athleteRepo: Repository<Athlete>,
        private readonly s3Service: S3Service
    ) {}

    async createSession(
        teamId: string,
        dto: CreateClubSessionDto
    ): Promise<ClubSession> {
        try {
            // 1. Validate team exists
            const team = await this.teamRepo.findOne({
                where: { id: teamId },
                relations: ["athletes"],
            });

            if (!team) {
                throw new NotFoundException(`Team with ID ${teamId} not found`);
            }

            // 2. Validate template exists
            const template = await this.templateRepo.findOne({
                where: { id: dto.templateId },
            });

            if (!template) {
                throw new NotFoundException(
                    `Template with ID ${dto.templateId} not found`
                );
            }

            // 3. Create session with empty phase results structure
            const phaseResults = template.phases.map((phase) => ({
                phaseId: phase.id || phase.name,
                phaseName: phase.name,
                target: phase.target,
                techniques: phase.techniques.map((tech) => ({
                    name: tech.name,
                    value: tech.value,
                    unit: tech.unit,
                    results: [],
                })),
                athleteRecords: [],
            }));

            // Create the session with the correct types
            const sessionData = {
                title: dto.title,
                teamId,
                templateId: dto.templateId,
                startTime: this.parseTime(dto.startTime, dto.day),
                endTime: this.parseTime(dto.endTime, dto.day),
                spaces: Array.isArray(dto.spaces)
                    ? dto.spaces
                    : dto.spaces
                      ? [dto.spaces]
                      : [],
                invitedPositions: dto.invitedPositions,
                notes: dto.notes,
                status: ClubSessionStatus.NOT_STARTED,
                phaseResults,
                missionAssociated: dto.missionAssociated,
                volumeTargeted: dto.volumeTargeted,
                averagePE: dto.averagePE,
            };

            const session = await this.clubSessionRepo.save(sessionData);
            return session;
        } catch (error) {
            this.logger.error(
                `Failed to create session for team ${teamId}`,
                error.stack
            );
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to create session: ${error.message}`
            );
        }
    }

    async updateSession(
        id: string,
        dto: UpdateClubSessionDto
    ): Promise<ClubSession> {
        const session = await this.clubSessionRepo.findOne({
            where: { id },
            relations: ["template"],
        });

        if (!session) {
            throw new NotFoundException("Session not found");
        }

        // Validate dates if being updated
        if (dto.startTime && dto.endTime) {
            if (new Date(dto.startTime) >= new Date(dto.endTime)) {
                throw new BadRequestException(
                    "Start time must be before end time"
                );
            }
        }

        // Handle spaces field separately to ensure proper array handling
        const updateData = { ...dto };
        if (dto.spaces !== undefined) {
            updateData.spaces = Array.isArray(dto.spaces)
                ? dto.spaces
                : dto.spaces
                  ? [dto.spaces]
                  : [];
        }

        Object.assign(session, updateData);
        return this.clubSessionRepo.save(session);
    }

    async getSessionsByTeam(teamId: string): Promise<ClubSession[]> {
        const sessions = await this.clubSessionRepo.find({
            where: { teamId },
            relations: ["template", "team"],
            select: [
                "id",
                "title",
                "teamId",
                "templateId",
                "status",
                "missionAssociated",
                "volumeTargeted",
                "startTime",
                "endTime",
                "spaces",
                "averagePE",
                "phaseResults",
                "invitedPositions",
                "notes",
                "createdAt",
                "updatedAt",
            ],
            order: {
                startTime: "DESC",
            },
        });

        // Generate signed URLs for team assets
        for (const session of sessions) {
            if (session.team) {
                if (session.team.background) {
                    session.team.background = await this.s3Service.getFileUrl(
                        session.team.background
                    );
                }
                if (session.team.logo) {
                    session.team.logo = await this.s3Service.getFileUrl(
                        session.team.logo
                    );
                }
            }
        }

        return sessions;
    }

    async getSessionById(id: string): Promise<ClubSession> {
        const session = await this.clubSessionRepo.findOne({
            where: { id },
            relations: ["template", "team"],
            select: [
                "id",
                "title",
                "teamId",
                "templateId",
                "status",
                "missionAssociated",
                "volumeTargeted",
                "startTime",
                "endTime",
                "spaces",
                "averagePE",
                "phaseResults",
                "invitedPositions",
                "notes",
                "createdAt",
                "updatedAt",
            ],
        });

        if (!session) {
            throw new NotFoundException("Session not found");
        }

        if (session.team) {
            if (session.team.background) {
                session.team.background = await this.s3Service.getFileUrl(
                    session.team.background
                );
            }
            if (session.team.logo) {
                session.team.logo = await this.s3Service.getFileUrl(
                    session.team.logo
                );
            }
        }

        return session;
    }

    async deleteSession(id: string): Promise<void> {
        const result = await this.clubSessionRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException("Session not found");
        }
    }

    async getSessionsByDateRange(
        teamId: string,
        startDate: Date,
        endDate: Date
    ): Promise<ClubSession[]> {
        const sessions = await this.clubSessionRepo.find({
            where: {
                teamId,
                startTime: Between(startDate, endDate),
            },
            relations: ["template", "team"],
            select: [
                "id",
                "title",
                "teamId",
                "templateId",
                "status",
                "missionAssociated",
                "volumeTargeted",
                "startTime",
                "endTime",
                "spaces",
                "averagePE",
                "phaseResults",
                "invitedPositions",
                "notes",
                "createdAt",
                "updatedAt",
            ],
            order: {
                startTime: "ASC",
            },
        });

        // Generate signed URLs for team assets
        for (const session of sessions) {
            if (session.team) {
                if (session.team.background) {
                    session.team.background = await this.s3Service.getFileUrl(
                        session.team.background
                    );
                }
                if (session.team.logo) {
                    session.team.logo = await this.s3Service.getFileUrl(
                        session.team.logo
                    );
                }
            }
        }

        return sessions;
    }

    async getUpcomingSessions(teamId: string): Promise<ClubSession[]> {
        const now = new Date();
        const sessions = await this.clubSessionRepo.find({
            where: {
                teamId,
                startTime: MoreThanOrEqual(now),
                status: ClubSessionStatus.NOT_STARTED,
            },
            relations: ["template", "team"],
            select: [
                "id",
                "title",
                "teamId",
                "templateId",
                "status",
                "missionAssociated",
                "volumeTargeted",
                "startTime",
                "endTime",
                "spaces",
                "averagePE",
                "phaseResults",
                "invitedPositions",
                "notes",
                "createdAt",
                "updatedAt",
            ],
            order: {
                startTime: "ASC",
            },
        });

        // Generate signed URLs for team assets
        for (const session of sessions) {
            if (session.team) {
                if (session.team.background) {
                    session.team.background = await this.s3Service.getFileUrl(
                        session.team.background
                    );
                }
                if (session.team.logo) {
                    session.team.logo = await this.s3Service.getFileUrl(
                        session.team.logo
                    );
                }
            }
        }

        return sessions;
    }

    async getCompletedSessions(teamId: string): Promise<ClubSession[]> {
        const sessions = await this.clubSessionRepo.find({
            where: {
                teamId,
                status: ClubSessionStatus.COMPLETED,
            },
            relations: ["template", "team"],
            select: [
                "id",
                "title",
                "teamId",
                "templateId",
                "status",
                "missionAssociated",
                "volumeTargeted",
                "startTime",
                "endTime",
                "spaces",
                "averagePE",
                "phaseResults",
                "invitedPositions",
                "notes",
                "createdAt",
                "updatedAt",
            ],
            order: {
                startTime: "DESC",
            },
        });

        // Generate signed URLs for team assets
        for (const session of sessions) {
            if (session.team) {
                if (session.team.background) {
                    session.team.background = await this.s3Service.getFileUrl(
                        session.team.background
                    );
                }
                if (session.team.logo) {
                    session.team.logo = await this.s3Service.getFileUrl(
                        session.team.logo
                    );
                }
            }
        }

        return sessions;
    }

    async startSession(id: string): Promise<ClubSession> {
        const session = await this.getSessionById(id);

        if (session.status !== ClubSessionStatus.NOT_STARTED) {
            throw new BadRequestException(
                "Session can only be started when in NOT_STARTED status"
            );
        }

        session.status = ClubSessionStatus.IN_PROGRESS;
        return this.clubSessionRepo.save(session);
    }

    async completeSession(id: string): Promise<ClubSession> {
        const session = await this.getSessionById(id);

        if (session.status !== ClubSessionStatus.IN_PROGRESS) {
            throw new BadRequestException(
                "Session can only be completed when in IN_PROGRESS status"
            );
        }

        session.status = ClubSessionStatus.COMPLETED;
        return this.clubSessionRepo.save(session);
    }

    async finishSession(id: string): Promise<ClubSession> {
        const session = await this.getSessionById(id);

        if (session.status !== ClubSessionStatus.COMPLETED) {
            throw new BadRequestException(
                "Session can only be finished when in COMPLETED status"
            );
        }

        session.status = ClubSessionStatus.FINISHED;
        return this.clubSessionRepo.save(session);
    }

    async cancelSession(id: string): Promise<ClubSession> {
        const session = await this.getSessionById(id);

        if (session.status === ClubSessionStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed session");
        }

        session.status = ClubSessionStatus.CANCELLED;
        return this.clubSessionRepo.save(session);
    }

    async updateSessionResults(
        sessionId: string,
        resultsDto: UpdateSessionResultsDto
    ): Promise<ClubSession> {
        const session = await this.getSessionById(sessionId);

        if (session.status === ClubSessionStatus.CANCELLED) {
            throw new BadRequestException(
                "Cannot update results of a cancelled session"
            );
        }

        // Update phase results
        session.phaseResults = resultsDto.phaseResults.map((phaseResult) => ({
            phaseId: phaseResult.phaseId,
            phaseName: phaseResult.phaseName,
            techniques: phaseResult.techniques.map((technique) => ({
                name: technique.name,
                value: technique.value,
                unit: technique.unit,
                results: technique.results || [],
            })),
            athleteRecords: phaseResult.athleteRecords || [],
        }));

        return this.clubSessionRepo.save(session);
    }

    async getSessionTemplate(id: string): Promise<ClubSessionTemplate> {
        const session = await this.getSessionById(id);
        if (!session.template) {
            throw new NotFoundException("Session template not found");
        }
        return session.template;
    }

    async getSessionResults(id: string): Promise<any> {
        const session = await this.getSessionById(id);
        return session.phaseResults;
    }

    private findPhaseResults(
        phaseResults: any[],
        phaseId: string,
        techniqueName: string
    ): any[] {
        // Find the phase
        const phase = phaseResults.find((p) => p.phaseId === phaseId);
        if (!phase) return [];

        // Find the technique
        const technique = phase.techniques.find(
            (t) => t.name === techniqueName
        );
        if (!technique) return [];

        return technique.results || [];
    }

    async getSessionPhasesWithPlayers(
        sessionId: string
    ): Promise<GetSessionPhasesResponseDto> {
        try {
            // Get session with template and team
            const session = await this.clubSessionRepo.findOne({
                where: { id: sessionId },
                relations: ["template", "team", "team.athletes"],
            });

            if (!session) {
                throw new NotFoundException("Session not found");
            }

            if (!session.template) {
                throw new NotFoundException("Session template not found");
            }

            // Get all athletes from the team with their full details
            const athletes = await this.athleteRepo.find({
                where: { teams: { id: session.teamId } },
                select: [
                    "id",
                    "firstName",
                    "lastName",
                    "position",
                    "level",
                    "weight",
                    "clublevel",
                ],
            });

            // Map athletes to the response format
            const players = athletes.map((athlete) => ({
                id: athlete.id,
                name: `${athlete.firstName} ${athlete.lastName}`,
                position: athlete.position,
                level: athlete.level,
                weight: athlete.weight,
                clublevel: athlete.clublevel,
            }));

            // Map template phases to response format
            const phases = session.template.phases.map((phase) => ({
                phaseId: phase.id,
                phaseName: phase.name,
                target: phase.target,
                techniques: phase.techniques.map((technique) => ({
                    name: technique.name,
                    value: technique.value,
                    unit: technique.unit,
                    results: session.phaseResults
                        ? this.findPhaseResults(
                              session.phaseResults,
                              phase.id,
                              technique.name
                          )
                        : players.map((player) => ({
                              playerId: player.id,
                              value: 0,
                          })),
                })),
            }));

            return {
                phases,
                players,
            };
        } catch (error) {
            this.logger.error(
                `Failed to get session phases with athletes for session ${sessionId}`,
                error.stack
            );
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to get session phases: ${error.message}`
            );
        }
    }

    async getSessionPhaseRecords(
        id: string
    ): Promise<SessionPhaseRecordsResponseDto> {
        const session = await this.clubSessionRepo.findOne({
            where: { id },
            relations: ["template", "team.athletes"],
        });

        if (!session) {
            throw new NotFoundException("Session not found");
        }

        const phaseRecords: PhaseRecordResponseDto[] =
            session.template.phases.map((phase) => {
                const techniques: TechniqueDto[] = phase.techniques.map(
                    (technique) => {
                        // Get existing results for this technique from session.phaseResults
                        const existingPhaseResult = session.phaseResults?.find(
                            (p) => p.phaseId === phase.id
                        );
                        const existingTechnique =
                            existingPhaseResult?.techniques?.find(
                                (t) => t.name === technique.name
                            );

                        // Create results for all team players, using existing values if available
                        const results = session.team.athletes.map((athlete) => {
                            const existingResult =
                                existingTechnique?.results?.find(
                                    (r) => r.playerId === athlete.id
                                );
                            return {
                                playerId: athlete.id,
                                athleteName: `${athlete.firstName} ${athlete.lastName}`,
                                value: existingResult?.value ?? 0,
                            };
                        });

                        return {
                            id: technique.name,
                            name: technique.name,
                            value: technique.value,
                            unit: technique.unit,
                            results,
                        };
                    }
                );

                return {
                    phaseId: phase.id,
                    phaseName: phase.name,
                    techniques,
                };
            });

        return {
            sessionId: session.id,
            sessionTitle: session.title,
            sportId: session.template.sportProfileId,
            phaseRecords,
        };
    }

    async updateSessionPhaseRecords(
        id: string,
        updateDto: UpdateSessionPhaseRecordsDto
    ): Promise<SessionPhaseRecordsResponseDto> {
        const session = await this.clubSessionRepo.findOne({
            where: { id },
            relations: ["template", "team.athletes"],
        });

        if (!session) {
            throw new NotFoundException("Session not found");
        }

        if (session.status === ClubSessionStatus.CANCELLED) {
            throw new BadRequestException(
                "Cannot update records for a cancelled session"
            );
        }

        if (!session.phaseResults) {
            session.phaseResults = [];
        }

        const updatedPhaseRecords: PhaseRecordResponseDto[] = await Promise.all(
            updateDto.phaseRecords.map(async (updateRecord) => {
                const phase = session.template.phases.find(
                    (p) => p.id === updateRecord.phaseId
                );
                if (!phase) {
                    throw new NotFoundException(
                        `Phase ${updateRecord.phaseId} not found`
                    );
                }

                const techniques = phase.techniques.map((templateTechnique) => {
                    const techniqueRecords = updateRecord.records.filter(
                        (record) =>
                            record.techniqueId === templateTechnique.name
                    );

                    const techniqueDto: TechniqueDto = {
                        id: templateTechnique.name,
                        name: templateTechnique.name,
                        value: templateTechnique.value,
                        unit: templateTechnique.unit,
                        results: techniqueRecords.map((record) => ({
                            playerId: record.playerId,
                            value: record.value,
                        })),
                    };

                    return techniqueDto;
                });

                const phaseRecord: PhaseRecordResponseDto = {
                    phaseId: phase.id,
                    phaseName: phase.name,
                    techniques,
                };

                // Update session.phaseResults for persistence
                const existingPhaseIndex = session.phaseResults.findIndex(
                    (p) => p.phaseId === phase.id
                );
                const storageRecord = {
                    phaseId: phase.id,
                    phaseName: phase.name,
                    techniques: techniques.map((t) => ({
                        name: t.name,
                        value: t.value,
                        unit: t.unit,
                        results: t.results,
                    })),
                    athleteRecords: session.team.athletes.map((athlete) => {
                        const measurements: Record<string, number> = {};
                        techniques.forEach((technique) => {
                            const result = technique.results.find(
                                (r) => r.playerId === athlete.id
                            );
                            if (result) {
                                measurements[technique.name] = result.value;
                            }
                        });
                        return {
                            athleteId: athlete.id,
                            athleteName: `${athlete.firstName} ${athlete.lastName}`,
                            measurements,
                        };
                    }),
                };

                if (existingPhaseIndex !== -1) {
                    session.phaseResults[existingPhaseIndex] = storageRecord;
                } else {
                    session.phaseResults.push(storageRecord);
                }

                return phaseRecord;
            })
        );

        await this.clubSessionRepo.save(session);

        return {
            sessionId: session.id,
            sessionTitle: session.title,
            sportId: session.template.sportProfileId,
            phaseRecords: updatedPhaseRecords,
        };
    }

    private getAthletePhaseResults(
        session: ClubSession,
        phaseId: string,
        athleteId: string
    ): Record<string, number> {
        const phaseResult = session.phaseResults?.find(
            (p) => p.phaseId === phaseId
        );
        if (!phaseResult) return {};

        const athleteRecord = phaseResult.athleteRecords?.find(
            (record) => record.athleteId === athleteId
        );
        return athleteRecord?.measurements || {};
    }

    private determineUnit(measurementType: string): string {
        const unitMap = {
            speed: "km/h",
            distance: "m",
            accuracy: "%",
            power: "watts",
            time: "seconds",
            count: "repetitions",
        };

        for (const [key, unit] of Object.entries(unitMap)) {
            if (measurementType.toLowerCase().includes(key)) {
                return unit;
            }
        }

        return "units";
    }

    async updatePhaseResults(
        sessionId: string,
        phaseId: string,
        techniqueId: string,
        playerId: string,
        value: number
    ): Promise<ClubSession> {
        const session = await this.getSessionById(sessionId);
        const phaseResult = session.phaseResults.find(
            (phase) => phase.phaseId === phaseId
        );

        if (!phaseResult) {
            throw new NotFoundException(`Phase ${phaseId} not found`);
        }

        const technique = phaseResult.techniques.find(
            (tech) => tech.name === techniqueId
        );

        if (!technique) {
            throw new NotFoundException(`Technique ${techniqueId} not found`);
        }

        // Update or add the result
        const existingResult = technique.results.find(
            (result) => result.playerId === playerId
        );

        if (existingResult) {
            existingResult.value = value;
        } else {
            technique.results.push({
                playerId,
                value,
            });
        }

        return this.clubSessionRepo.save(session);
    }

    private validateTechniques(phase: any) {
        if (!Array.isArray(phase.techniques)) {
            throw new BadRequestException(
                `Invalid phase structure: techniques must be an array in phase ${phase.name}`
            );
        }

        // Validate each technique
        for (const technique of phase.techniques) {
            if (!technique.name || typeof technique.name !== "string") {
                throw new BadRequestException(
                    `Invalid technique structure: missing or invalid name in phase ${phase.name}`
                );
            }
            if (!technique.value || typeof technique.value !== "string") {
                throw new BadRequestException(
                    `Invalid technique structure: missing or invalid value in technique ${technique.name}`
                );
            }
            if (!technique.unit || typeof technique.unit !== "string") {
                throw new BadRequestException(
                    `Invalid technique structure: missing or invalid unit in technique ${technique.name}`
                );
            }
        }
    }

    private parseTime(time: string, day: Date): Date {
        if (!time || typeof time !== "string") {
            throw new BadRequestException(
                `Invalid time format: ${time}. Expected format: "HH:MM am/pm"`
            );
        }

        const timeMatch = time
            .toLowerCase()
            .match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
        if (!timeMatch) {
            throw new BadRequestException(
                `Invalid time format: ${time}. Expected format: "HH:MM am/pm"`
            );
        }

        const [_, hourStr, minuteStr, period] = timeMatch;
        const date = new Date(day);

        // Convert to 24-hour format
        let hour24 = parseInt(hourStr);
        if (!Number.isInteger(hour24) || hour24 < 1 || hour24 > 12) {
            throw new BadRequestException(
                `Invalid hour: ${hourStr}. Must be between 1 and 12`
            );
        }

        const minutes = parseInt(minuteStr);
        if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
            throw new BadRequestException(
                `Invalid minutes: ${minuteStr}. Must be between 0 and 59`
            );
        }

        if (period.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
        if (period.toLowerCase() === "am" && hour24 === 12) hour24 = 0;

        date.setHours(hour24, minutes, 0, 0);
        return date;
    }

    async getTemplatesBySport(sportId: string): Promise<ClubSessionTemplate[]> {
        try {
            const templates = await this.templateRepo.find({
                where: { sportProfileId: sportId },
                order: {
                    createdAt: "DESC",
                },
            });

            if (!templates.length) {
                throw new NotFoundException(
                    `No templates found for sport ${sportId}`
                );
            }

            // Sort phases by order after fetching
            templates.forEach((template) => {
                if (template.phases) {
                    template.phases.sort((a, b) => a.order - b.order);
                }
            });

            return templates;
        } catch (error) {
            this.logger.error(
                `Failed to get templates for sport ${sportId}`,
                error.stack
            );
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to get templates: ${error.message}`
            );
        }
    }

    async updateTemplatePhases(
        templateId: string,
        dto: UpdateTemplatePhaseOrderRequestDto
    ): Promise<ClubSessionTemplate> {
        try {
            const template = await this.templateRepo.findOne({
                where: { id: templateId },
            });

            if (!template) {
                throw new NotFoundException(`Template ${templateId} not found`);
            }

            if (!template.phases) {
                throw new BadRequestException(
                    "Template phases are not initialized"
                );
            }

            // Validate all phases exist
            const phaseIds = new Set(template.phases.map((p) => p.id));
            for (const phase of dto.phases) {
                if (!phaseIds.has(phase.id)) {
                    throw new BadRequestException(
                        `Phase ${phase.id} not found in template`
                    );
                }
            }

            // Update phase names and order
            template.phases = template.phases.map((phase) => {
                const updateData = dto.phases.find((p) => p.id === phase.id);
                if (updateData) {
                    return {
                        ...phase,
                        ...(updateData.name && { name: updateData.name }),
                        order: updateData.order,
                    };
                }
                return phase;
            });

            // Sort phases by new order
            template.phases.sort((a, b) => a.order - b.order);

            // Save the updated template
            return this.templateRepo.save(template);
        } catch (error) {
            this.logger.error(
                `Failed to update phases for template ${templateId}`,
                error.stack
            );
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to update template phases: ${error.message}`
            );
        }
    }

    async getTemplatePhases(
        templateId: string
    ): Promise<GetTemplatePhasesResponseDto> {
        try {
            const template = await this.templateRepo.findOne({
                where: { id: templateId },
            });

            if (!template) {
                throw new NotFoundException(`Template ${templateId} not found`);
            }

            if (!template.phases) {
                throw new BadRequestException(
                    "Template phases are not initialized"
                );
            }

            // Sort phases by order
            const sortedPhases = [...template.phases].sort(
                (a, b) => a.order - b.order
            );

            // Map to response format
            const phases = sortedPhases.map((phase) => ({
                id: phase.id,
                name: phase.name,
                description: phase.description || "",
                order: phase.order,
                target: `${phase.target} ${phase.unit || "meters"}`,
                techniques: phase.techniques.map((tech) => ({
                    name: tech.name,
                    value: tech.value,
                    unit: tech.unit,
                })),
                techniqueSummary: `${phase.techniques.length} technique${phase.techniques.length !== 1 ? "s" : ""}`,
            }));

            return {
                id: template.id,
                name: template.name,
                phases,
            };
        } catch (error) {
            this.logger.error(
                `Failed to get phases for template ${templateId}`,
                error.stack
            );
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to get template phases: ${error.message}`
            );
        }
    }

    async submitPlayerRevision(
        sessionId: string,
        dto: SubmitPlayerRevisionDto
    ): Promise<ClubSession> {
        this.logger.debug(
            `Submitting player revision for session ${sessionId}`
        );

        const session = await this.getSessionById(sessionId);

        if (
            session.status !== ClubSessionStatus.COMPLETED &&
            session.status !== ClubSessionStatus.FINISHED
        ) {
            throw new BadRequestException(
                "Revision can only be submitted for completed or finished sessions"
            );
        }

        if (!session.playerRevision) {
            session.playerRevision = [];
        }

        const submissionTime = new Date();
        this.logger.debug(
            `Processing revisions with timestamp: ${submissionTime.toISOString()}`
        );

        // Process each player's revision
        for (const revision of dto.revisions) {
            // Verify player exists and is part of the team
            const athlete = await this.athleteRepo.findOne({
                where: { id: revision.playerId },
                select: ["id", "firstName", "lastName", "level"],
            });

            if (!athlete) {
                throw new NotFoundException(
                    `Player with ID ${revision.playerId} not found`
                );
            }

            this.logger.debug(
                `Processing revision for player ${athlete.firstName} ${athlete.lastName}`
            );

            // Create new record with submission time and level
            const newRecord = {
                rpe: revision.record.rpe,
                note: revision.record.note || null,
                submittedAt: submissionTime,
                level: revision.record.level || null
            };

            // Find existing player revision or create new one
            const existingRevisionIndex = session.playerRevision.findIndex(
                (r) => r.playerId === revision.playerId
            );

            if (existingRevisionIndex !== -1) {
                // Update existing player revision with new record
                session.playerRevision[existingRevisionIndex] = {
                    playerId: revision.playerId,
                    playerName: `${athlete.firstName} ${athlete.lastName}`,
                    record: newRecord,
                };
            } else {
                // Create new player revision
                session.playerRevision.push({
                    playerId: revision.playerId,
                    playerName: `${athlete.firstName} ${athlete.lastName}`,
                    record: newRecord,
                });
            }
        }

        // Update average RPE
        const totalRPE = session.playerRevision.reduce(
            (sum, revision) => sum + revision.record.rpe,
            0
        );
        session.averagePE =
            session.playerRevision.length > 0
                ? totalRPE / session.playerRevision.length
                : 0;

        this.logger.debug(
            `Saving session with ${session.playerRevision.length} player revisions and average RPE: ${session.averagePE}`
        );

        const savedSession = await this.clubSessionRepo.save(session);
        this.logger.debug(
            `Session saved successfully with ID ${savedSession.id}`
        );

        return savedSession;
    }

    async getSessionRevision(id: string): Promise<SessionRevisionResponseDto> {
        this.logger.debug(`Getting session revision for session ${id}`);

        const session = await this.clubSessionRepo.findOne({
            where: { id },
            relations: ["template", "team", "team.athletes"],
            select: [
                "id",
                "title",
                "teamId",
                "templateId",
                "status",
                "averagePE",
                "playerRevision",
            ],
        });

        if (!session) {
            this.logger.warn(`Session ${id} not found`);
            throw new NotFoundException("Session not found");
        }

        this.logger.debug(
            `Found session with ${session.playerRevision?.length || 0} player revisions`
        );

        // Get all athletes from the team to get their details
        const athleteIds = session.playerRevision?.map((r) => r.playerId) || [];
        this.logger.debug(`Fetching details for ${athleteIds.length} athletes`);

        const athletes = await this.athleteRepo.find({
            where: {
                id: In(athleteIds),
            },
            select: ["id", "firstName", "lastName", "position"],
        });

        this.logger.debug(`Found ${athletes.length} athletes with details`);

        // Create a map of athlete details for quick lookup
        const athleteDetails = new Map(
            athletes.map((a) => [
                a.id,
                {
                    position: a.position,
                    name: `${a.firstName} ${a.lastName}`,
                },
            ])
        );

        // Get all team athletes for complete player list
        const teamAthletes = session.team.athletes || [];
        this.logger.debug(`Found ${teamAthletes.length} total team athletes`);

        // Create a map of existing revisions for quick lookup
        const revisionMap = new Map(
            session.playerRevision?.map((r) => [r.playerId, r]) || []
        );

        // Build the response with all team athletes, including those without revisions
        const revisions = teamAthletes.map((athlete) => {
            const existingRevision = revisionMap.get(athlete.id);
            const athleteInfo = athleteDetails.get(athlete.id) || {
                position: athlete.position,
                name: `${athlete.firstName} ${athlete.lastName}`,
            };

            return {
                playerId: athlete.id,
                playerName: athleteInfo.name,
                position: athleteInfo.position,
                record: existingRevision?.record || null,
            };
        });

        const response = {
            sessionId: session.id,
            sessionTitle: session.title,
            sportId: session.template?.sportProfileId,
            status: session.status,
            averageRPE: session.averagePE || 0,
            revisions,
        };

        this.logger.debug(
            `Returning response with ${response.revisions.length} player records`
        );
        return response;
    }
}
