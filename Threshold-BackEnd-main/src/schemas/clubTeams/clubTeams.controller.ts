import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
    ApiQuery,
    ApiConsumes,
    ApiBody,
} from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ConflictException } from "@nestjs/common";

import { CreateClubTeamDto } from "src/dto/clubTeams/create-club-team.dto";
import { UpdateClubTeamDto } from "src/dto/clubTeams/update-club-team.dto";
import { GetClubTeamsQueryDto } from "src/dto/clubTeams/get-club-teams-query.dto";

import { ClubTeamsService } from "./clubTeams.service";

import {
    SWAGGER_TAGS,
    SWAGGER_OPERATIONS,
    SWAGGER_API_PARAMS,
    SWAGGER_API_QUERIES,
    SWAGGER_RESPONSES,
    SWAGGER_BODIES,
} from "./swagger.constants";
import { AddSubGoalDto } from "src/dto/clubTeams/add-sub-goal.dto";
import { CreateTeamGoalDto } from "src/dto/clubTeams/create-team-goal.dto";
import {
    UpdateSubGoalDto,
    UpdateTeamGoalDto,
} from "src/dto/clubTeams/update-team-goal.dto";
import { GetTeamPlayersQueryDto } from "src/dto/clubTeams/get-team-players-query.dto";

@ApiTags(SWAGGER_TAGS.CLUB_TEAMS)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: false,
    })
)
@Controller("sportClubProfile/:sportClubProfileId/teams")
export class ClubTeamsController {
    constructor(private readonly clubTeamsService: ClubTeamsService) {}
    @Get("/:teamId/players")
    @ApiOperation(SWAGGER_OPERATIONS.GET_TEAM_PLAYERS)
    @ApiQuery(SWAGGER_API_QUERIES.PAGE_QUERY)
    @ApiQuery(SWAGGER_API_QUERIES.LIMIT_QUERY)
    @ApiQuery(SWAGGER_API_QUERIES.SEARCH_QUERY)
    @ApiResponse(SWAGGER_RESPONSES.GET_TEAM_PLAYERS_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.TEAM_NOT_FOUND)
    async getTeamPlayers(
        @Param("teamId") teamId: string,
        @Query() query: GetTeamPlayersQueryDto,
        @Res() res: Response
    ) {
        try {
            const { page = 1, limit = 10, search } = query;
            const response = await this.clubTeamsService.getTeamPlayers(
                teamId,
                Number(page),
                Number(limit),
                search
            );
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "An error occurred while retrieving team players",
                error: error.message,
            });
        }
    }
    @Patch("/:mainGoalId/main-goal")
    @ApiOperation(SWAGGER_OPERATIONS.UPDATE_MAIN_TEAM_GOAL)
    @ApiBody({ type: UpdateTeamGoalDto })
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_MAIN_TEAM_GOAL_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.MAIN_TEAM_GOAL_NOT_FOUND)
    @ApiResponse(SWAGGER_RESPONSES.INTERNAL_SERVER_ERROR)
    async updateMainTeamGoal(
        @Param("mainGoalId") mainGoalId: string,
        @Body() updateTeamGoalDto: UpdateTeamGoalDto,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubTeamsService.updateMainTeamGoal(
                mainGoalId,
                updateTeamGoalDto
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "An error occurred while updating the main team goal",
                error: error.message,
            });
        }
    }

    @Patch("/sub-goals/:subGoalId")
    @ApiOperation(SWAGGER_OPERATIONS.UPDATE_SUB_GOAL)
    @ApiBody({ type: UpdateSubGoalDto })
    @ApiResponse(SWAGGER_RESPONSES.SUB_GOALS_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.TEAM_GOAL_NOT_FOUND)
    @ApiResponse(SWAGGER_RESPONSES.INTERNAL_SERVER_ERROR)
    async updateSubGoal(
        @Param("subGoalId") subGoalId: string,
        @Body() updateSubGoalDto: UpdateSubGoalDto,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubTeamsService.updateSubGoal(
                subGoalId,
                updateSubGoalDto
            );
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "An error occurred while updating the sub-goal",
                error: error.message,
            });
        }
    }

    @Get("/:teamId/main-goal")
    @ApiOperation(SWAGGER_OPERATIONS.GET_MAIN_TEAM_GOALS)
    @ApiResponse(SWAGGER_RESPONSES.MAIN_TEAM_GOALS_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.TEAM_GOAL_NOT_FOUND)
    @ApiResponse(SWAGGER_RESPONSES.INTERNAL_SERVER_ERROR)
    @ApiQuery(SWAGGER_API_QUERIES.YEAR_QUERY)
    async getMainTeamGoals(
        @Res() res: Response,
        @Param("teamId") teamId: string,
        @Query("year") year?: string
    ) {
        try {
            const response = await this.clubTeamsService.getMainTeamGoals(
                teamId,
                year
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    "An error occurred while retrieving the main team goals",
                error: error.message,
            });
        }
    }

    @Post("/:teamId/main-goal")
    @ApiOperation(SWAGGER_OPERATIONS.CREATE_TEAM_GOAL)
    @ApiBody({ type: CreateTeamGoalDto })
    @ApiResponse(SWAGGER_RESPONSES.TEAM_GOAL_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.TEAM_GOAL_NOT_FOUND)
    @ApiResponse(SWAGGER_RESPONSES.INTERNAL_SERVER_ERROR)
    async createTeamGoal(
        @Param("teamId") teamId: string,
        @Body() createTeamGoalDto: CreateTeamGoalDto,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubTeamsService.createTeamGoal(
                teamId,
                createTeamGoalDto
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "An error occurred while creating the main team goal",
                error: error.message,
            });
        }
    }

    @Get("/:teamId/sub-goals")
    @ApiOperation(SWAGGER_OPERATIONS.GET_SUB_GOALS_BY_TEAM_GOAL)
    @ApiResponse(SWAGGER_RESPONSES.SUB_GOALS_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.TEAM_GOAL_NOT_FOUND)
    @ApiResponse(SWAGGER_RESPONSES.INTERNAL_SERVER_ERROR)
    async getSubGoalsByTeam(
        @Param("teamId") teamId: string,
        @Res() res: Response
    ) {
        try {
            const response =
                await this.clubTeamsService.getSubGoalsByTeam(teamId);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving sub-goals",
                error: error.message,
            });
        }
    }

    @Post("/:teamId/sub-goals")
    @ApiOperation(SWAGGER_OPERATIONS.ADD_SUB_GOAL)
    @ApiResponse(SWAGGER_RESPONSES.SUB_GOALS_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.INTERNAL_SERVER_ERROR)
    async addSubGoal(
        @Param("teamId") teamId: string,
        @Body() addSubGoalDto: AddSubGoalDto,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubTeamsService.addSubGoal(
                teamId,
                addSubGoalDto
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while adding the sub-goal",
                error: error.message,
            });
        }
    }

    @Get(":teamId/details")
    @ApiOperation(SWAGGER_OPERATIONS.GET_TEAM_FULL_DETAILS)
    @ApiResponse(SWAGGER_RESPONSES.TEAM_DETAILS_SUCCESS)
    @ApiParam(SWAGGER_API_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.TEAM_NOT_FOUND)
    @ApiResponse(SWAGGER_RESPONSES.INTERNAL_SERVER_ERROR)
    async getTeamFullDetails(
        @Param("teamId") teamId: string,
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubTeamsService.getTeamFullDetails(
                teamId,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving the team details",
                error: error.message,
            });
        }
    }

    @Get()
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUB_TEAMS.summary })
    @ApiParam(SWAGGER_API_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiQuery(SWAGGER_API_QUERIES.SEARCH_QUERY)
    @ApiQuery(SWAGGER_API_QUERIES.PAGE_QUERY)
    @ApiQuery(SWAGGER_API_QUERIES.LIMIT_QUERY)
    @ApiQuery(SWAGGER_API_QUERIES.SORT_FIELD_QUERY)
    @ApiQuery(SWAGGER_API_QUERIES.SORT_ORDER_QUERY)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUB_TEAMS_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getTeams(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Query() query: GetClubTeamsQueryDto,
        @Res() res: Response
    ) {
        try {
            const { search, page, limit, sortField, sortOrder } = query;
            const response = await this.clubTeamsService.getTeams(
                search,
                sportClubProfileId,
                page,
                limit,
                sortField,
                sortOrder
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving teams",
                error: error.message,
            });
        }
    }

    @Get(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUB_TEAM_BY_ID.summary })
    @ApiParam(SWAGGER_API_PARAMS.TEAM_ID_PARAM)
    @ApiParam(SWAGGER_API_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUB_TEAM_BY_ID_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async getTeamById(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubTeamsService.getTeamById(
                id,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving the team",
                error: error.message,
            });
        }
    }

    @Post()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: "logo", maxCount: 1 },
                { name: "background", maxCount: 1 },
            ],
            {
                fileFilter: (req, file, cb) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                        cb(
                            new ConflictException(
                                "Only JPG, JPEG, PNG files are allowed!"
                            ),
                            false
                        );
                    }
                    cb(null, true);
                },
                limits: { fileSize: 5 * 1024 * 1024 },
            }
        )
    )
    @ApiOperation({ summary: SWAGGER_OPERATIONS.CREATE_CLUB_TEAM.summary })
    @ApiParam(SWAGGER_API_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiBody(SWAGGER_BODIES.CREATE_CLUB_TEAM)
    @ApiResponse(SWAGGER_RESPONSES.CREATE_CLUB_TEAM_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async createTeam(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Body() createDto: CreateClubTeamDto,
        @UploadedFiles()
        files: {
            logo?: Express.Multer.File[];
            background?: Express.Multer.File[];
        },
        @Res() res: Response
    ) {
        try {
            const logo = files.logo ? files.logo[0] : undefined;
            const background = files.background
                ? files.background[0]
                : undefined;

            const response = await this.clubTeamsService.createTeam(
                createDto,
                logo,
                background,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while creating the team",
                error: error.message,
            });
        }
    }

    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: "logo", maxCount: 1 },
                { name: "background", maxCount: 1 },
            ],
            {
                fileFilter: (req, file, cb) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                        cb(
                            new ConflictException(
                                "Only JPG, JPEG, PNG files are allowed!"
                            ),
                            false
                        );
                    }
                    cb(null, true);
                },
                limits: { fileSize: 5 * 1024 * 1024 },
            }
        )
    )
    @ApiOperation({ summary: SWAGGER_OPERATIONS.UPDATE_CLUB_TEAM.summary })
    @ApiParam(SWAGGER_API_PARAMS.TEAM_ID_PARAM)
    @ApiParam(SWAGGER_API_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiBody(SWAGGER_BODIES.UPDATE_CLUB_TEAM)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_CLUB_TEAM_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async updateTeam(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Body() updateDto: UpdateClubTeamDto,
        @UploadedFiles()
        files: {
            logo?: Express.Multer.File[];
            background?: Express.Multer.File[];
        },
        @Res() res: Response
    ) {
        try {
            const logo = files.logo ? files.logo[0] : undefined;
            const background = files.background
                ? files.background[0]
                : undefined;

            const response = await this.clubTeamsService.updateTeam(
                id,
                updateDto,
                logo,
                background,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while updating the team",
                error: error.message,
            });
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.DELETE_CLUB_TEAM.summary })
    @ApiParam(SWAGGER_API_PARAMS.TEAM_ID_PARAM)
    @ApiParam(SWAGGER_API_PARAMS.SPORT_CLUB_PROFILE_ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.DELETE_CLUB_TEAM_SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND_RESPONSE)
    @ApiResponse(SWAGGER_RESPONSES.ERROR_RESPONSE)
    async deleteTeam(
        @Param("sportClubProfileId") sportClubProfileId: string,
        @Param("id") id: string,
        @Res() res: Response
    ) {
        try {
            const response = await this.clubTeamsService.deleteTeam(
                id,
                sportClubProfileId
            );
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while deleting the team",
                error: error.message,
            });
        }
    }
}
