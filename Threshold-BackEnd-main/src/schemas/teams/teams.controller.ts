import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { DeleteResult } from "typeorm";
import { Response } from "express";
import { TeamsService } from "./teams.service";
import { Team } from "../../entities/team.entity";
import { CreateTeamDto } from "../../dto/teams/create-team.dto";
import { UpdateTeamDto } from "../../dto/teams/update-team.dto";
import { TeamFields } from "../../enums/tables-data.enum";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
} from "src/decorators";
import { GetOneProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetOneByQuery } from "src/decorators/getBy.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { SportProfileType } from "src/enums/athletes.enum";
import { ApiGetTeamInfo, ApiPaginatedTeams } from "./swagger-decorators";

const transferMapping: NewInstanceTransformer = {
    creationDate: "date",
};

@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    // --- Basic REST endpoints ---

    @Get(":teamId/athletes")
    @ApiOperation({ summary: "Get athletes by team with filters and search" })
    @ApiQuery({
        name: "searchQuery",
        required: false,
        description: "Search athletes by name or other fields",
    })
    @ApiQuery({
        name: "status",
        required: false,
        description: "Filter athletes by status",
    })
    @ApiQuery({
        name: "age",
        required: false,
        description: "Filter athletes by age",
    })
    @ApiQuery({
        name: "categories",
        required: false,
        description: "Filter athletes by categories",
    })
    @ApiQuery({
        name: "page",
        required: false,
        description: "Page number",
        example: 1,
    })
    @ApiQuery({
        name: "limit",
        required: false,
        description: "Number of items per page",
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: "Athletes retrieved successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Athletes retrieved successfully",
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                example: "123e4567-e89b-12d3-a456-426614174000",
                            },
                            firstName: { type: "string", example: "John" },
                            lastName: { type: "string", example: "Doe" },
                            age: { type: "number", example: 25 },
                            status: { type: "string", example: "active" },
                        },
                    },
                },
                meta: {
                    type: "object",
                    properties: {
                        totalItems: { type: "number", example: 100 },
                        itemCount: { type: "number", example: 10 },
                        itemsPerPage: { type: "number", example: 10 },
                        totalPages: { type: "number", example: 10 },
                        currentPage: { type: "number", example: 1 },
                    },
                },
            },
        },
    })
    async getAthletesByTeam(
        @Res() res: Response,
        @Param("teamId") teamId: string,
        @Query("searchQuery") searchQuery?: string,
        @Query("status") status?: string,
        @Query("age") age?: number,
        @Query("categories") categories?: string,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10
    ) {
        const options = { page, limit };
        const filters = { status, age, categories };

        try {
            const response = await this.teamsService.getAthletesByTeam(
                teamId,
                options,
                filters,
                searchQuery
            );

            return res.status(200).json({
                message: "Athletes retrieved successfully",
                data: response.items,
                meta: response.meta,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving athletes",
                error: error.message,
            });
        }
    }

    @Get()
    @ApiPaginatedTeams()
    async getTeams(
        @Res() res: Response,
        @GetUser() user: any,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sortField") sortField: string = "createdAt",
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
        @Query("name") name?: string,
        @Query("sport") sport?: SportProfileType
    ) {
        try {
            const options = { page, limit };
            const filters = {
                name,
                sport,
            };

            const response = await this.teamsService.getTeams(
                user,
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Teams retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving teams",
                error: error.message,
            });
        }
    }

    @Get(":id")
    @ApiGetTeamInfo()
    async getTeamInfo(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Team> =
            await this.teamsService.getTeamInfo(id);
        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateTeamDto, "create a new team")
    async createTeam(
        @Body(new NewInstancePipe(transferMapping))
        createTeamDto: CreateTeamDto,
        @GetUser() user: any,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Team> =
            await this.teamsService.createTeam(createTeamDto, user);

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateTeamDto, "update a team")
    async updateTeam(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateTeamDto: UpdateTeamDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Team> =
            await this.teamsService.updateTeam(id, updateTeamDto);

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @ApiOperation({ summary: "delete all teams" })
    async deleteAllTeams(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.teamsService.deleteAllTeams();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a team" })
    async deleteTeam(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.teamsService.deleteTeam(id);

        return res.status(response.status).json(response);
    }
}
