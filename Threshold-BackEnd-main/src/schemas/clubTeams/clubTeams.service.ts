import {
    Injectable,
    Logger,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    HttpStatus,
    BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, QueryFailedError } from "typeorm";
import { Team } from "src/entities/team.entity";
import { Academy } from "src/entities/academy.entity";
import { Branch } from "src/entities/branch.entity";
import { Athlete } from "src/entities/athlete.entity";
import { Coach } from "src/entities/coach.entity";
import { Contract } from "src/entities/contract.entity";
import {
    IPaginationOptions,
    Pagination,
    PaginationTypeEnum,
    paginate,
} from "nestjs-typeorm-paginate";
import CustomResponseType from "src/types/customResponseType";
import {
    foundRes,
    notFoundRes,
    errorRes,
    deletedRes,
} from "src/lib/responses/restResponse";
import { S3Service } from "src/s3/s3.service";
import { CreateClubTeamDto } from "src/dto/clubTeams/create-club-team.dto";
import { UpdateClubTeamDto } from "src/dto/clubTeams/update-club-team.dto";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { ClubAdmin } from "src/entities/clubAdmin.entity";
import { Session } from "src/entities/session.entity";
import { TeamGoal } from "src/entities/teamGoal.entity";
import { SubGoal } from "src/entities/subGoal.entity";
import {
    UpdateSubGoalDto,
    UpdateTeamGoalDto,
} from "src/dto/clubTeams/update-team-goal.dto";
import { AddSubGoalDto } from "src/dto/clubTeams/add-sub-goal.dto";
import { ApiResponse } from "@nestjs/swagger";
import { CreateTeamGoalDto } from "src/dto/clubTeams/create-team-goal.dto";
import { Week } from "src/entities/week.entity";

@Injectable()
export class ClubTeamsService {
    private readonly logger = new Logger(ClubTeamsService.name);

    constructor(
        @InjectRepository(TeamGoal)
        private readonly teamGoalRepository: Repository<TeamGoal>,
        @InjectRepository(SubGoal)
        private readonly subGoalRepository: Repository<SubGoal>,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        private readonly s3Service: S3Service,
        @InjectRepository(Week)
        private readonly weekRepository: Repository<Week>,
        @InjectRepository(sportClubProfiles)
        private readonly sportClubProfilesRepository: Repository<sportClubProfiles>
    ) {}

    private generateS3Path(
        teamName: string,
        type: "logo" | "background"
    ): string {
        const timestamp = Date.now();
        return `clubTeams/${teamName}-${timestamp}/${type}`;
    }
    async getTeamPlayers(
        teamId: string,
        page: number,
        limit: number,
        search?: string
    ) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id: teamId },
                relations: ["athletes"],
            });

            if (!team) {
                return { status: 404, message: "Team not found" };
            }

            const skip = (page - 1) * limit;

            const queryBuilder = this.athleteRepository
                .createQueryBuilder("athlete")
                .leftJoinAndSelect("athlete.contract", "contract")
                .leftJoinAndSelect("athlete.teams", "team")
                .where("team.id = :teamId", { teamId });

            if (search) {
                queryBuilder.andWhere(
                    "(athlete.firstName LIKE :search OR athlete.lastName LIKE :search OR athlete.position LIKE :search)",
                    { search: `%${search}%` }
                );
            }

            const [players, total] = await queryBuilder
                .take(limit)
                .skip(skip)
                .getManyAndCount();

            const playersWithSignedUrls = await Promise.all(
                players.map(async (player) => {
                    // Get signed URLs
                    const avatarSignedUrl = player.avatar
                        ? await this.s3Service.getFileUrl(player.avatar)
                        : null;

                    const avatarUrlSignedUrl = player.avatarUrl
                        ? await this.s3Service.getFileUrl(player.avatarUrl)
                        : null;

                    const contractSignedUrl = player.contract?.contractUrl
                        ? await this.s3Service.getFileUrl(
                              player.contract.contractUrl
                          )
                        : null;

                    return {
                        id: player.id,
                        athleteId: player.athleteId,
                        firstName: player.firstName,
                        lastName: player.lastName,
                        clublevel: player.clublevel,
                        level: player.level,
                        position: player.position,
                        weight: player.weight,
                        height: player.height,
                        dateOfBirth: player.dateOfBirth,
                        gender: player.gender,
                        nationality: player.nationality,
                        nationalId: player.nin,
                        nationalIdExpiration: player.ninExpirationDate,
                        contract: player.contract
                            ? {
                                  id: player.contract.id,
                                  type: player.contract.type,
                                  status: player.contract.status,
                                  joinDate: player.contract.joinDate,
                                  expirationDate:
                                      player.contract.expirationDate,
                                  contractDuration:
                                      player.contract.contractDuration,
                                  contractSignedUrl,
                              }
                            : null,
                        avatarSignedUrl,
                        avatarUrlSignedUrl,
                    };
                })
            );

            return {
                status: 200,
                message: "Players retrieved successfully",
                data: {
                    players: playersWithSignedUrls,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            this.logger.error(
                `Error retrieving team players: ${error.message}`,
                error.stack
            );
            return {
                status: 500,
                message: "An error occurred while retrieving team players",
                error: error.message,
            };
        }
    }

    async updateSubGoal(
        subGoalId: string,
        updateSubGoalDto: UpdateSubGoalDto
    ): Promise<{ status: number; message: string; data?: SubGoal }> {
        try {
            const subGoal = await this.subGoalRepository.findOne({
                where: { id: subGoalId },
                relations: ["weeks"],
            });

            if (!subGoal) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: `SubGoal with ID "${subGoalId}" not found`,
                };
            }

            await this.weekRepository.remove(subGoal.weeks);

            const updatedWeeks = updateSubGoalDto.weeks.map((weekDto) =>
                this.weekRepository.create({
                    ...weekDto,
                    subGoal: { id: subGoal.id },
                })
            );

            Object.assign(subGoal, updateSubGoalDto);

            subGoal.weeks = updatedWeeks;

            await this.weekRepository.save(updatedWeeks);

            const savedSubGoal = await this.subGoalRepository.save(subGoal);

            return {
                status: HttpStatus.OK,
                message: "Sub-goal updated successfully",
                data: savedSubGoal,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                `Error updating sub-goal: ${error.message}`
            );
        }
    }

    async updateMainTeamGoal(
        mainGoalId: string,
        updateTeamGoalDto: UpdateTeamGoalDto
    ): Promise<{ status: number; message: string; data?: any }> {
        try {
            const teamGoal = await this.teamGoalRepository.findOne({
                where: { id: mainGoalId },
            });

            if (!teamGoal) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: `Main team goal for team ID ${mainGoalId} not found.`,
                };
            }

            Object.assign(teamGoal, updateTeamGoalDto);
            const savedTeamGoal = await this.teamGoalRepository.save(teamGoal);

            return {
                status: HttpStatus.OK,
                message: "Main team goal updated successfully",
                data: savedTeamGoal,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                `Error updating main team goal: ${error.message}`
            );
        }
    }
    async getMainTeamGoals(teamId: string, year?: string) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id: teamId },
                relations: ["goals"],
            });

            if (!team) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Team not found",
                };
            }

            const whereClause: any = { team: { id: teamId } };
            if (year) {
                whereClause.year = year;
                const mainGoal = await this.teamGoalRepository.findOne({
                    where: whereClause,
                });

                if (!mainGoal) {
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: "Main team goal not found",
                    };
                }

                return {
                    status: HttpStatus.OK,
                    message: "Main team goal retrieved successfully",
                    data: mainGoal,
                };
            }

            const mainGoals = await this.teamGoalRepository.find({
                where: whereClause,
                order: { year: "DESC" },
            });

            if (!mainGoals || mainGoals.length === 0) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Main team goals not found",
                };
            }

            return {
                status: HttpStatus.OK,
                message: "Main team goals retrieved successfully",
                data: mainGoals,
            };
        } catch (error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message:
                    "An error occurred while retrieving the main team goals",
                error: error.message,
            };
        }
    }

    async createTeamGoal(teamId: string, createTeamGoalDto: CreateTeamGoalDto) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id: teamId },
            });
            if (!team) {
                throw new NotFoundException(`Team with ID ${teamId} not found`);
            }
            const teamGoal = this.teamGoalRepository.create({
                ...createTeamGoalDto,
                team,
            });
            await this.teamGoalRepository.save(teamGoal);
            return {
                status: HttpStatus.CREATED,
                message: "Team goal created successfully",
                data: teamGoal,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                `Error creating team goal: ${error.message}`
            );
        }
    }

    async getSubGoalsByTeam(teamId: string) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id: teamId },
            });
            if (!team) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Team not found",
                };
            }

            const subGoals = await this.subGoalRepository.find({
                where: { team: { id: teamId } },
                relations: ["weeks"],
            });

            return {
                status: HttpStatus.OK,
                message: "Sub-goals retrieved successfully",
                data: subGoals,
            };
        } catch (error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "An error occurred while retrieving sub-goals",
                error: error.message,
            };
        }
    }

    async addSubGoal(teamId: string, addSubGoalDto: AddSubGoalDto) {
        this.logger.log(
            `Adding sub-goal to teamId: ${teamId}, Month: ${addSubGoalDto.monthNumber}`
        );

        try {
            const team = await this.teamRepository.findOne({
                where: { id: teamId },
            });

            if (!team) {
                throw new NotFoundException(`Team with ID ${teamId} not found`);
            }

            const subGoal = this.subGoalRepository.create({
                team: { id: teamId },
                title: addSubGoalDto.title,
                monthNumber: addSubGoalDto.monthNumber,
                volumeTargeted: addSubGoalDto.volumeTargeted,
                startDate: addSubGoalDto.startDate,
                endDate: addSubGoalDto.endDate,
            });

            const savedSubGoal = await this.subGoalRepository.save(subGoal);

            const weeks = addSubGoalDto.weeks.map((weekDto) =>
                this.weekRepository.create({
                    ...weekDto,
                    subGoal: savedSubGoal,
                })
            );

            await this.weekRepository.save(weeks);

            this.logger.log(
                `Sub-goal and weeks added successfully for teamId: ${teamId}`
            );

            return {
                status: HttpStatus.CREATED,
                message: "Sub-goal and weeks added successfully",
                data: savedSubGoal,
            };
        } catch (error) {
            this.logger.error(
                `Error adding sub-goal: ${error.message}`,
                error.stack
            );
            throw new InternalServerErrorException(
                "An error occurred while adding the sub-goal"
            );
        }
    }

    async getTeamGoalsWithSubGoals(teamId: string) {
        this.logger.log(`Retrieving team goals for teamId: ${teamId}`);

        try {
            const team = await this.teamRepository.findOne({
                where: { id: teamId },
                relations: ["goals", "goals.subGoals"],
            });

            if (!team) {
                this.logger.warn(`Team not found: ${teamId}`);
                throw new NotFoundException(`Team with ID ${teamId} not found`);
            }

            this.logger.log(
                `Team goals retrieved successfully for teamId: ${teamId}`
            );

            return {
                status: 200,
                message: "Team goals retrieved successfully",
                data: team.goals,
            };
        } catch (error) {
            this.logger.error(
                `Error retrieving team goals: ${error.message}`,
                error.stack
            );
            throw new InternalServerErrorException(
                "An error occurred while retrieving team goals"
            );
        }
    }

    async getTeamFullDetails(teamId: string, sportClubProfileId: string) {
        try {
            // Validate sport club profile existence
            const sportClubProfile =
                await this.sportClubProfilesRepository.findOne({
                    where: { id: sportClubProfileId },
                });

            if (!sportClubProfile) {
                this.logger.warn(
                    `Sport club profile with ID ${sportClubProfileId} not found`
                );
                throw new NotFoundException(
                    `Sport club profile with ID ${sportClubProfileId} not found`
                );
            }

            // Validate team existence
            const team = await this.teamRepository.findOne({
                where: { id: teamId, sportProfile: { id: sportClubProfileId } },
                relations: [
                    "sportProfile",
                    "sportProfile.mainManagers",
                    "sportProfile.mainManagers.user",
                    "branch",
                    "academy",
                    "coach",
                    "subCoaches",
                    "clubAdmin",
                    "athletes",
                    "sessions",
                ],
            });

            if (!team) {
                this.logger.warn(`Team with ID ${teamId} not found`);
                throw new NotFoundException(`Team with ID ${teamId} not found`);
            }

            let logoUrlSigned = null;
            let backgroundUrlSigned = null;

            try {
                logoUrlSigned = team.logo
                    ? await this.s3Service.getFileUrl(team.logo)
                    : null;
                backgroundUrlSigned = team.background
                    ? await this.s3Service.getFileUrl(team.background)
                    : null;
            } catch (error) {
                this.logger.error(
                    `Failed to retrieve logo or background URL for team ID ${teamId}: ${error.message}`,
                    error.stack
                );
                throw new InternalServerErrorException(
                    `Failed to retrieve logo or background URL for team ID ${teamId}`
                );
            }

            // Categorize athletes
            const categorizeAthletes = (category: string) =>
                team.athletes.filter((athlete) => athlete.category === category)
                    .length;

            const players = {
                shortDistances: categorizeAthletes("Short Distances"),
                midDistances: categorizeAthletes("Mid Distances"),
                longDistances: categorizeAthletes("Long Distances"),
            };

            const formatName = (person: any) =>
                person ? `${person.firstName} ${person.lastName}` : "N/A";

            const admins = [
                {
                    role: "Administrator",
                    name: formatName(team.clubAdmin),
                    id: team.clubAdmin?.id ?? "N/A",
                },
                {
                    role: "Coach",
                    name: formatName(team.coach),
                    id: team.coach?.id ?? "N/A",
                },
                ...team.subCoaches.map((subCoach) => ({
                    role: "Sub-Coach",
                    name: formatName(subCoach),
                    id: subCoach?.id ?? "N/A",
                })),
                ...team.sportProfile.mainManagers.map((manager) => {
                    console.log(manager);
                    return {
                        role: manager.user.role,
                        name: formatName(manager),
                        id: manager.user?.id ?? "N/A",
                    };
                }),
            ];

            let latestSession = null;
            try {
                latestSession = await this.sessionRepository.findOne({
                    where: { team: { id: teamId } },
                    order: { date: "DESC" },
                });
            } catch (error) {
                this.logger.error(
                    `Failed to retrieve latest session for team ID ${teamId}: ${error.message}`,
                    error.stack
                );
                throw new InternalServerErrorException(
                    `Failed to retrieve latest session for team ID ${teamId}`
                );
            }

            const nextSession = latestSession
                ? {
                      sessionId: latestSession.id,
                      sessionType: latestSession.type ?? "N/A",
                      kpi: latestSession.achievedSession ?? "N/A",
                      startTime: latestSession.from ?? "N/A",
                      endTime: latestSession.to ?? "N/A",
                  }
                : null;

            return {
                status: HttpStatus.OK,
                message: "Team details retrieved successfully",
                data: {
                    id: team.id,
                    name: team.name,
                    avatarUrl: logoUrlSigned,
                    background: backgroundUrlSigned,
                    spaces: team.spaces,
                    players,
                    admins,
                    gender: team.gender,
                    category: team.category,
                    createdAt: team.createdAt,
                    nextSession,
                },
            };
        } catch (error) {
            this.logger.error(
                `Error retrieving team details: ${error.message}`,
                error.stack
            );
            return errorRes(
                `An error occurred while retrieving the team details: ${error.message}`
            );
        }
    }

    async createTeam(
        createDto: CreateClubTeamDto,
        logoFile?: Express.Multer.File,
        backgroundFile?: Express.Multer.File,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<Team>> {
        this.logger.log(
            `Starting team creation process for: ${createDto.name}`
        );

        try {
            return await this.teamRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    let sportClubProfile: sportClubProfiles = null;
                    if (sportClubProfileId) {
                        sportClubProfile =
                            await transactionalEntityManager.findOne(
                                sportClubProfiles,
                                {
                                    where: { id: sportClubProfileId },
                                }
                            );
                        if (!sportClubProfile) {
                            throw new ConflictException(
                                "SportClubProfile not found"
                            );
                        }
                    }

                    let academyEntity: Academy = null;
                    if (createDto.academy) {
                        academyEntity =
                            await transactionalEntityManager.findOne(Academy, {
                                where: { id: createDto.academy },
                            });
                        if (!academyEntity) {
                            throw new ConflictException("Academy not found");
                        }
                    }

                    let branchEntity: Branch = null;
                    if (createDto.branch) {
                        branchEntity = await transactionalEntityManager.findOne(
                            Branch,
                            {
                                where: { id: createDto.branch },
                            }
                        );
                        if (!branchEntity) {
                            throw new ConflictException("Branch not found");
                        }
                    }

                    const coach = await transactionalEntityManager.findOne(
                        Coach,
                        {
                            where: { id: createDto.coach },
                        }
                    );

                    if (!coach) {
                        throw new ConflictException("Coach not found");
                    }

                    const admin = await transactionalEntityManager.findOne(
                        ClubAdmin,
                        {
                            where: { id: createDto.admin },
                        }
                    );

                    if (!admin) {
                        throw new ConflictException("Admin not found");
                    }

                    let subCoachesEntities: Coach[] = [];
                    if (
                        createDto.subCoaches &&
                        createDto.subCoaches.length > 0
                    ) {
                        subCoachesEntities =
                            await transactionalEntityManager.findByIds(
                                Coach,
                                createDto.subCoaches
                            );
                        if (
                            subCoachesEntities.length !==
                            createDto.subCoaches.length
                        ) {
                            throw new ConflictException(
                                "One or more Sub-Coaches not found"
                            );
                        }
                    }

                    let athletesEntities: Athlete[] = [];
                    if (createDto.athletes && createDto.athletes.length > 0) {
                        athletesEntities =
                            await transactionalEntityManager.findByIds(
                                Athlete,
                                createDto.athletes
                            );
                        if (
                            athletesEntities.length !==
                            createDto.athletes.length
                        ) {
                            throw new ConflictException(
                                "One or more Athletes not found"
                            );
                        }
                    }

                    let logoUrl: string = null;
                    if (logoFile) {
                        const s3Path = this.generateS3Path(
                            createDto.name,
                            "logo"
                        );
                        logoUrl = await this.s3Service.uploadFile(
                            s3Path,
                            logoFile
                        );
                        this.logger.log(`Logo uploaded to S3: ${logoUrl}`);
                    }

                    let backgroundUrl: string = null;
                    if (backgroundFile) {
                        const s3Path = this.generateS3Path(
                            createDto.name,
                            "background"
                        );
                        backgroundUrl = await this.s3Service.uploadFile(
                            s3Path,
                            backgroundFile
                        );
                        this.logger.log(
                            `Background uploaded to S3: ${backgroundUrl}`
                        );
                    }

                    const team = transactionalEntityManager.create(Team, {
                        name: createDto.name,
                        logo: logoUrl,
                        background: backgroundUrl,
                        branch: branchEntity,
                        academy: academyEntity,
                        coach: coach,
                        clubAdmin: admin,
                        sportProfile: sportClubProfile,
                        subCoaches: subCoachesEntities,
                        athletes: athletesEntities,
                        category: createDto.category,
                        gender: createDto.gender,
                    });

                    const savedTeam = await transactionalEntityManager.save(
                        Team,
                        team
                    );
                    this.logger.log(
                        `Team created successfully with ID: ${savedTeam.id}`
                    );

                    return foundRes("Team created successfully", savedTeam);
                }
            );
        } catch (error) {
            this.logger.error(
                "Error occurred during team creation process",
                error.stack
            );

            if (error instanceof ConflictException) {
                return errorRes(error.message);
            }

            return errorRes("An unexpected error occurred");
        }
    }

    async getTeams(
        search: string,
        sportClubProfileId: string,
        page: number,
        limit: number,
        sortField: string,
        sortOrder: "ASC" | "DESC"
    ): Promise<CustomResponseType<{ items: Team[]; meta: any }>> {
        try {
            this.logger.log(
                `Fetching teams with search: ${search || "None"}, sportClubProfileId: ${sportClubProfileId || "None"}, page: ${page}, limit: ${limit}, sortField: ${sortField}, sortOrder: ${sortOrder}`
            );

            const queryBuilder = this.teamRepository
                .createQueryBuilder("team")
                .leftJoinAndSelect("team.branch", "branch")
                .leftJoinAndSelect("team.academy", "academy")
                .leftJoinAndSelect("team.coach", "coach")
                .leftJoinAndSelect("team.clubAdmin", "clubAdmin")
                .leftJoinAndSelect("team.subCoaches", "subCoach")
                .leftJoinAndSelect("team.athletes", "athlete")
                .leftJoinAndSelect("team.sportProfile", "sportProfile")
                .leftJoinAndSelect("team.sessions", "session")
                .leftJoinAndSelect("team.weeklySessions", "weeklySession");

            if (sportClubProfileId) {
                queryBuilder.andWhere(
                    "team.sportProfileId = :sportClubProfileId",
                    {
                        sportClubProfileId,
                    }
                );
            }

            if (search) {
                queryBuilder.andWhere(
                    "(team.name ILIKE :search OR coach.firstName ILIKE :search OR coach.lastName ILIKE :search)",
                    { search: `%${search}%` }
                );
            }

            const allowedSortFields = [
                "name",
                "createdAt",
                "updatedAt",
                "category",
            ];
            if (!allowedSortFields.includes(sortField)) {
                sortField = "createdAt";
            }
            queryBuilder.orderBy(`team.${sortField}`, sortOrder);

            const options: IPaginationOptions = {
                page,
                limit,
            };

            const totalItems = await queryBuilder.getCount();

            const paginatedResults: Pagination<Team> = await paginate<Team>(
                queryBuilder as any,
                {
                    ...options,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    metaTransformer: ({
                        currentPage,
                        itemCount,
                        itemsPerPage,
                    }) => {
                        const totalPages = Math.round(
                            totalItems / itemsPerPage
                        );
                        return {
                            currentPage,
                            itemCount,
                            itemsPerPage,
                            totalItems,
                            totalPages: totalPages === 0 ? 1 : totalPages,
                        };
                    },
                }
            );

            await Promise.all(
                paginatedResults.items.map(async (team) => {
                    if (team.logo) {
                        team.logo = await this.s3Service.getFileUrl(team.logo);
                    }
                    if (team.background) {
                        team.background = await this.s3Service.getFileUrl(
                            team.background
                        );
                    }
                })
            );

            const meta = paginatedResults.meta;

            this.logger.log(
                `Fetched ${paginatedResults.items.length} teams successfully out of ${paginatedResults.meta.totalItems} total items`
            );

            return foundRes("Teams retrieved successfully", {
                items: paginatedResults.items,
                meta,
            });
        } catch (error) {
            this.logger.error("Error fetching teams", error.stack);
            return errorRes("An error occurred while retrieving teams");
        }
    }

    async getTeamById(
        id: string,
        sportClubProfileId: string
    ): Promise<CustomResponseType<Team>> {
        try {
            this.logger.log(
                `Fetching team with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const team = await this.teamRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: [
                    "branch",
                    "academy",
                    "coach",
                    "subCoaches",
                    "athletes",
                    "sportProfile",
                    "sessions",
                    "weeklySessions",
                ],
            });

            if (!team) {
                this.logger.warn(
                    `Team with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Team with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            if (team.logo) {
                try {
                    team.logo = await this.s3Service.getFileUrl(team.logo);
                    this.logger.log(
                        `Signed URL generated for logo: ${team.logo}`
                    );
                } catch (error) {
                    this.logger.warn(
                        `Failed to generate signed URL for logo: ${team.logo}`,
                        error.stack
                    );
                }
            }

            if (team.background) {
                try {
                    team.background = await this.s3Service.getFileUrl(
                        team.background
                    );
                    this.logger.log(
                        `Signed URL generated for background: ${team.background}`
                    );
                } catch (error) {
                    this.logger.warn(
                        `Failed to generate signed URL for background: ${team.background}`,
                        error.stack
                    );
                }
            }

            this.logger.log(`Fetched team with ID: ${id} successfully`);
            return foundRes("Team retrieved successfully", team);
        } catch (error) {
            this.logger.error(
                `Error fetching team with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while retrieving the team");
        }
    }

    async updateTeam(
        id: string,
        updateDto: UpdateClubTeamDto,
        logoFile?: Express.Multer.File,
        backgroundFile?: Express.Multer.File,
        sportClubProfileId?: string
    ): Promise<CustomResponseType<Team>> {
        try {
            this.logger.log(
                `Updating team with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const team = await this.teamRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: ["subCoaches", "athletes", "coach"],
            });

            if (!team) {
                this.logger.warn(
                    `Team with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Team with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            return await this.teamRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    if (logoFile) {
                        const s3Path = this.generateS3Path(
                            updateDto.name || team.name,
                            "logo"
                        );
                        const newLogoUrl = await this.s3Service.uploadFile(
                            s3Path,
                            logoFile
                        );

                        if (team.logo) {
                            await this.s3Service.deleteFile(team.logo);
                            this.logger.log(
                                `Deleted old logo from S3: ${team.logo}`
                            );
                        }

                        team.logo = newLogoUrl;
                    }

                    if (backgroundFile) {
                        const s3Path = this.generateS3Path(
                            updateDto.name || team.name,
                            "background"
                        );
                        const newBackgroundUrl =
                            await this.s3Service.uploadFile(
                                s3Path,
                                backgroundFile
                            );

                        if (team.background) {
                            await this.s3Service.deleteFile(team.background);
                            this.logger.log(
                                `Deleted old background from S3: ${team.background}`
                            );
                        }

                        team.background = newBackgroundUrl;
                    }

                    if (updateDto.name) {
                        team.name = updateDto.name;
                    }

                    if (updateDto.background) {
                        team.background = updateDto.background;
                    }

                    if (updateDto.branch) {
                        const branchEntity =
                            await transactionalEntityManager.findOne(Branch, {
                                where: { id: updateDto.branch },
                            });
                        if (!branchEntity) {
                            throw new ConflictException("Branch not found");
                        }
                        team.branch = branchEntity;
                    }

                    if (updateDto.academy) {
                        const academyEntity =
                            await transactionalEntityManager.findOne(Academy, {
                                where: { id: updateDto.academy },
                            });
                        if (!academyEntity) {
                            throw new ConflictException("Academy not found");
                        }
                        team.academy = academyEntity;
                    }

                    if (updateDto.coach) {
                        const coachEntity =
                            await transactionalEntityManager.findOne(Coach, {
                                where: { id: updateDto.coach },
                            });
                        if (!coachEntity) {
                            throw new ConflictException("Coach not found");
                        }
                        team.coach = coachEntity;
                    }

                    if (updateDto.coach) {
                        const adminEntity =
                            await transactionalEntityManager.findOne(
                                ClubAdmin,
                                {
                                    where: { id: updateDto.admin },
                                }
                            );

                        if (!adminEntity) {
                            throw new ConflictException("Coach not found");
                        }
                        team.clubAdmin = adminEntity;
                    }

                    if (updateDto.subCoaches) {
                        const subCoachesEntities =
                            await transactionalEntityManager.findByIds(
                                Coach,
                                updateDto.subCoaches
                            );
                        if (
                            subCoachesEntities.length !==
                            updateDto.subCoaches.length
                        ) {
                            throw new ConflictException(
                                "One or more Sub-Coaches not found"
                            );
                        }
                        team.subCoaches = subCoachesEntities;
                    }

                    if (updateDto.athletes) {
                        const athletesEntities =
                            await transactionalEntityManager.findByIds(
                                Athlete,
                                updateDto.athletes
                            );
                        if (
                            athletesEntities.length !==
                            updateDto.athletes.length
                        ) {
                            throw new ConflictException(
                                "One or more Athletes not found"
                            );
                        }
                        team.athletes = athletesEntities;
                    }

                    if (updateDto.category) {
                        team.category = updateDto.category;
                    }

                    if (updateDto.gender) {
                        team.gender = updateDto.gender;
                    }

                    if (sportClubProfileId) {
                        const sportProfileEntity =
                            await transactionalEntityManager.findOne(
                                sportClubProfiles,
                                {
                                    where: { id: sportClubProfileId },
                                }
                            );
                        if (!sportProfileEntity) {
                            throw new ConflictException(
                                "SportClubProfile not found"
                            );
                        }
                        team.sportProfile = sportProfileEntity;
                    }

                    const updatedTeam = await transactionalEntityManager.save(
                        Team,
                        team
                    );
                    this.logger.log(
                        `Team with ID: ${updatedTeam.id} updated successfully`
                    );

                    if (updatedTeam.logo) {
                        try {
                            updatedTeam.logo = await this.s3Service.getFileUrl(
                                updatedTeam.logo
                            );
                            this.logger.log(
                                `Signed URL generated for logo: ${updatedTeam.logo}`
                            );
                        } catch (error) {
                            this.logger.warn(
                                `Failed to generate signed URL for logo: ${updatedTeam.logo}`,
                                error.stack
                            );
                        }
                    }

                    if (updatedTeam.background) {
                        try {
                            updatedTeam.background =
                                await this.s3Service.getFileUrl(
                                    updatedTeam.background
                                );
                            this.logger.log(
                                `Signed URL generated for background: ${updatedTeam.background}`
                            );
                        } catch (error) {
                            this.logger.warn(
                                `Failed to generate signed URL for background: ${updatedTeam.background}`,
                                error.stack
                            );
                        }
                    }

                    return foundRes("Team updated successfully", updatedTeam);
                }
            );
        } catch (error) {
            this.logger.error(
                "Error occurred during team update process",
                error.stack
            );
            if (error instanceof ConflictException) {
                return errorRes(error.message);
            }
            return errorRes("An unexpected error occurred");
        }
    }

    async deleteTeam(
        id: string,
        sportClubProfileId: string
    ): Promise<CustomResponseType<null>> {
        try {
            this.logger.log(
                `Deleting team with ID: ${id} under SportClubProfile ID: ${sportClubProfileId}`
            );

            const team = await this.teamRepository.findOne({
                where: { id, sportProfile: { id: sportClubProfileId } },
                relations: ["coach", "subCoaches", "athletes"],
            });

            if (!team) {
                this.logger.warn(
                    `Team with ID "${id}" not found under SportClubProfile ID "${sportClubProfileId}"`
                );
                return notFoundRes(
                    `Team with ID "${id}" not found under the specified SportClubProfile`
                );
            }

            await this.teamRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    if (team.logo) {
                        try {
                            await this.s3Service.deleteFile(team.logo);
                            this.logger.log(
                                `Deleted logo from S3: ${team.logo}`
                            );
                        } catch (error) {
                            this.logger.warn(
                                `Failed to delete logo from S3: ${team.logo}`,
                                error.stack
                            );
                        }
                    }

                    if (team.background) {
                        try {
                            await this.s3Service.deleteFile(team.background);
                            this.logger.log(
                                `Deleted background from S3: ${team.background}`
                            );
                        } catch (error) {
                            this.logger.warn(
                                `Failed to delete background from S3: ${team.background}`,
                                error.stack
                            );
                        }
                    }

                    await transactionalEntityManager.remove(Team, team);
                    this.logger.log(`Team with ID: ${id} deleted successfully`);
                }
            );

            return deletedRes("Team deleted successfully", null);
        } catch (error) {
            this.logger.error(
                `Error deleting team with ID: ${id}`,
                error.stack
            );
            return errorRes("An error occurred while deleting the team");
        }
    }

    async deleteAllTeams(): Promise<CustomResponseType<null>> {
        try {
            this.logger.log("Deleting all teams");

            const teams = await this.teamRepository.find();

            await this.teamRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    await Promise.all(
                        teams.map(async (team) => {
                            if (team.logo) {
                                try {
                                    await this.s3Service.deleteFile(team.logo);
                                    this.logger.log(
                                        `Deleted logo from S3: ${team.logo}`
                                    );
                                } catch (error) {
                                    this.logger.warn(
                                        `Failed to delete logo from S3: ${team.logo}`,
                                        error.stack
                                    );
                                }
                            }

                            if (team.background) {
                                try {
                                    await this.s3Service.deleteFile(
                                        team.background
                                    );
                                    this.logger.log(
                                        `Deleted background from S3: ${team.background}`
                                    );
                                } catch (error) {
                                    this.logger.warn(
                                        `Failed to delete background from S3: ${team.background}`,
                                        error.stack
                                    );
                                }
                            }
                        })
                    );

                    await transactionalEntityManager.clear(Team);
                    this.logger.log("All teams deleted successfully");
                }
            );

            return deletedRes("All teams deleted successfully", null);
        } catch (error) {
            this.logger.error("Error deleting all teams", error.stack);
            return errorRes("An error occurred while deleting all teams");
        }
    }

    async getAthletesByTeam(
        teamId: string,
        options: IPaginationOptions,
        filters: any,
        searchQuery?: string
    ): Promise<CustomResponseType<{ items: Athlete[]; meta: any }>> {
        try {
            this.logger.log(`Fetching athletes for team ID: ${teamId}`);

            const queryBuilder = this.athleteRepository
                .createQueryBuilder("athlete")
                .leftJoinAndSelect("athlete.teams", "team")
                .where("team.id = :teamId", { teamId });

            if (searchQuery) {
                queryBuilder.andWhere(
                    "(athlete.firstName ILIKE :search OR athlete.lastName ILIKE :search)",
                    { search: `%${searchQuery}%` }
                );
            }

            if (filters.status) {
                queryBuilder.andWhere("athlete.status = :status", {
                    status: filters.status,
                });
            }

            if (filters.age) {
                queryBuilder.andWhere(
                    "EXTRACT(YEAR FROM AGE(athlete.birthday)) = :age",
                    { age: filters.age }
                );
            }

            if (filters.categories) {
                queryBuilder.andWhere("athlete.category IN (:...categories)", {
                    categories: filters.categories.split(","),
                });
            }

            const totalItems = await queryBuilder.getCount();

            const paginatedResults: Pagination<Athlete> =
                await paginate<Athlete>(queryBuilder as any, {
                    ...options,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    metaTransformer: ({
                        currentPage,
                        itemCount,
                        itemsPerPage,
                    }) => {
                        const totalPages = Math.round(
                            totalItems / itemsPerPage
                        );
                        return {
                            currentPage,
                            itemCount,
                            itemsPerPage,
                            totalItems: itemCount,
                            totalPages: totalPages === 0 ? 1 : totalPages,
                        };
                    },
                });
            await Promise.all(
                paginatedResults.items.map(async (athlete) => {
                    if (athlete.avatar) {
                        athlete.avatar = await this.s3Service.getFileUrl(
                            athlete.avatar
                        );
                    }
                })
            );

            const meta = paginatedResults.meta;

            this.logger.log(
                `Fetched ${paginatedResults.items.length} athletes successfully out of ${paginatedResults.meta.totalItems} total items`
            );

            return foundRes("Athletes retrieved successfully", {
                items: paginatedResults.items,
                meta,
            });
        } catch (error) {
            this.logger.error("Error fetching athletes by team", error.stack);
            return errorRes("An error occurred while retrieving athletes");
        }
    }
}
