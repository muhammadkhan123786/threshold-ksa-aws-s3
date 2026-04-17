import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Patch,
    Delete,
    Res,
    UseGuards,
    Query,
} from "@nestjs/common";
import { Response } from "express";
import { WeeklySessionService } from "./weeklySession.service";
import { CreateWeeklySessionDto } from "src/dto/sessions/create-weekly-session.dto";
import { UpdateWeeklySessionDto } from "src/dto/sessions/update-weekly-session.dto";
import {
    ApiCreateSessionUnderWeeklySession,
    ApiCreateWeeklySession,
    ApiGetWeeklySessionById,
    ApiUpdateWeeklySession,
    ApiDeleteWeeklySession,
    ApiPaginatedWeeklySessions,
} from "./swagger-decorators";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { User } from "src/entities/user.entity";
import { ApiTags } from "@nestjs/swagger";
import { CreateSessionDto } from "src/dto/sessions/create-session.dto";

@ApiTags("Weekly Sessions")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("weekly-sessions")
export class WeeklySessionController {
    constructor(private readonly weeklySessionService: WeeklySessionService) {}

    @Post("/:id/sessions")
    @ApiCreateSessionUnderWeeklySession()
    async createSessionUnderWeeklySession(
        @Param("id") weeklySessionId: string,
        @Body() createSessionDto: CreateSessionDto,
        @GetUser() user: User,
        @Res() res: Response
    ) {
        const response =
            await this.weeklySessionService.createSessionUnderWeeklySession(
                weeklySessionId,
                createSessionDto
            );
        return res.status(response.status).json(response);
    }

    @Post()
    @ApiCreateWeeklySession()
    async createWeeklySession(
        @GetUser() user: User,
        @Body() createWeeklySessionDto: CreateWeeklySessionDto,
        @Query("team_id") teamId: string,
        @Res() res: Response
    ) {
        const response = await this.weeklySessionService.createWeeklySession(
            createWeeklySessionDto,
            user,
            teamId
        );
        return res.status(response.status).json(response);
    }

    @Get()
    @ApiPaginatedWeeklySessions()
    async getWeeklySessions(
        @Res() res: Response,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sortField") sortField: string = "createdAt",
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
        @Query("searchQuery") searchQuery?: string,
        @Query("weekDate") weekDate?: string,
        @Query("teamId") teamId?: string
    ) {
        try {
            console.log("teamId", teamId);
            const options = { page, limit };
            const filters = {
                searchQuery,
                weekDate,
                teamId,
            };

            const response = await this.weeklySessionService.getWeeklySessions(
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Weekly sessions retrieved successfully",
                data: response.items,
                meta: response.meta,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving weekly sessions",
                error: error.message,
            });
        }
    }

    @Get(":id")
    @ApiGetWeeklySessionById()
    async getWeeklySessionById(@Param("id") id: string, @Res() res: Response) {
        const response =
            await this.weeklySessionService.getWeeklySessionById(id);
        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @ApiUpdateWeeklySession()
    async updateWeeklySession(
        @Param("id") id: string,
        @Body() updateWeeklySessionDto: UpdateWeeklySessionDto,
        @Res() res: Response
    ) {
        const response = await this.weeklySessionService.updateWeeklySession(
            id,
            updateWeeklySessionDto
        );
        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiDeleteWeeklySession()
    async deleteWeeklySession(@Param("id") id: string, @Res() res: Response) {
        const response =
            await this.weeklySessionService.deleteWeeklySession(id);
        return res.status(response.status).json(response);
    }
}
