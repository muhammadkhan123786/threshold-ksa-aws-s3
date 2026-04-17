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
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { SessionsService } from "./sessions.service";
import { Session } from "../../entities/session.entity";
import { CreateSessionDto } from "../../dto/sessions/create-session.dto";
import { UpdateSessionDto } from "../../dto/sessions/update-session.dto";
import { SessionFields } from "../../enums/tables-data.enum";
import { ControllerWrapper, EditorsWrapper } from "src/decorators";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetOneProps } from "src/types/getOperators";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import CustomResponseType from "src/types/customResponseType";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { GetOneByQuery } from "src/decorators/getBy.decorator";
import { CreateRecordSessionDto } from "src/dto/sessions/create-record-session.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { SessionDto } from "src/dto/sessions/session.dto";
import { CreatePlanningSessionDto } from "src/dto/sessions/create-planning-session.dto";
import { PlanningSession } from "src/entities/planningSession.entity";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import {
    PlayingSessionStatus,
    PlayingSessionType,
} from "src/enums/athletes.enum";
import {
    ApiPaginatedSessions,
    SWAGGER_OPERATIONS,
    SWAGGER_PARAMS,
    SWAGGER_RESPONSES,
} from "./swagger-decorators";

const transferMapping: NewInstanceTransformer = {
    date: "date",
};

@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("sessions")
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    // --- Basic REST endpoints ---

    @Get("players/:playerId/attendance")
    @ApiOperation(SWAGGER_OPERATIONS.GET_PLAYER_ATTENDANCE)
    @ApiParam(SWAGGER_PARAMS.PLAYER_ID)
    @ApiResponse(SWAGGER_RESPONSES.SUCCESS)
    @ApiResponse(SWAGGER_RESPONSES.NOT_FOUND)
    @ApiResponse(SWAGGER_RESPONSES.SERVER_ERROR)
    async getPlayerAttendance(@Param("playerId") playerId: string) {
        const attendanceRecords =
            await this.sessionsService.getPlayerAttendance(playerId);
        return {
            message: "Player attendance records retrieved successfully",
            attendanceRecords,
        };
    }

    @Get("athletes/:athleteId/summary")
    async getSessionSummary(@Param("athleteId") athleteId: string) {
        const summary = await this.sessionsService.getSessionSummary(athleteId);
        return {
            message: "Session summary retrieved successfully",
            summary,
        };
    }

    @Get("athletes/:athleteId/records")
    async getSessionRecords(@Param("athleteId") athleteId: string) {
        const records = await this.sessionsService.getSessionRecords(athleteId);
        return {
            message: "Session records retrieved successfully",
            records,
        };
    }

    @Delete(":id/planning-sessions/soft-delete")
    @ApiOperation({ summary: "Soft delete a planning session" })
    async softDeletePlanningSession(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        const response =
            await this.sessionsService.softDeletePlanningSession(id);
        return res.status(response.status).json(response);
    }

    @Get(":id/planning-sessions")
    @ApiOperation({
        summary: "Get session and planning sessions by session ID",
    })
    async getSessionAndPlanningSessions(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Session[]> =
            await this.sessionsService.getSessionAndPlanningSessions(id);

        return res.status(response.status).json(response);
    }

    @Post(":id/planning-sessions")
    @ApiOperation({ summary: "Create a planning session for a session" })
    async createPlanningSession(
        @Param("id") sessionId: string,
        @Body(new NewInstancePipe(transferMapping))
        createPlanningSessionDto: CreatePlanningSessionDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<PlanningSession> =
            await this.sessionsService.createPlanningSession(
                sessionId,
                createPlanningSessionDto
            );

        return res.status(response.status).json(response);
    }

    @Post("/upsert/:id")
    @EditorsWrapper(SessionDto, "create or update a session")
    @ApiOperation({ summary: "Create or update a session with records" })
    async saveSession(
        @Param("id") sessionId: string,
        @Body() sessionDto: SessionDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Session | UpdateResult> =
            await this.sessionsService.saveSession(sessionId, sessionDto);

        return res.status(response.status).json(response);
    }

    @Get()
    @ApiPaginatedSessions()
    async getSessions(
        @GetUser() user: any,
        @Res() res: Response,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sortField") sortField: string = "createdAt",
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
        @Query("status") status?: PlayingSessionStatus,
        @Query("type") type?: PlayingSessionType,
        @Query("teamId") teamId?: string
    ) {
        try {
            const options = { page, limit };
            const filters = {
                status,
                type,
                teamId,
            };

            const response = await this.sessionsService.getSessions(
                user,
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Sessions retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving sessions",
                error: error.message,
            });
        }
    }

    @GetOneByQuery({
        summary: "get a single session using its ID",
        descendants: [
            ...RELATIONS.session.oneToMany,
            ...RELATIONS.session.manyToMany,
        ],
    })
    @Get(":id")
    @ApiOperation({ summary: "get a single session using its ID" })
    async getSessionById(
        @Param("id") id: string,
        @Res()
        res: Response
    ) {
        const response: CustomResponseType<Session> =
            await this.sessionsService.getSessionById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateSessionDto, "create a new session")
    async createSession(
        @Body(new NewInstancePipe(transferMapping))
        createSessionDto: CreateSessionDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Session> =
            await this.sessionsService.createSession(createSessionDto);

        return res.status(response.status).json(response);
    }

    @Patch("/record/:id")
    @EditorsWrapper(UpdateSessionDto, "update a record session")
    async updateRecordSession(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateSessionDto: CreateRecordSessionDto,
        @Res() res: Response
    ) {
        console.log("updateSessionDto", updateSessionDto);
        const response: CustomResponseType<any> =
            await this.sessionsService.createRecordSession(
                id,
                updateSessionDto
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateSessionDto, "update a session")
    async updateSession(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateSessionDto: UpdateSessionDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.sessionsService.updateSession(id, updateSessionDto);

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @ApiOperation({ summary: "delete all sessions" })
    async deleteAllSessions(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.sessionsService.deleteAllSessions();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a session" })
    async deleteSession(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.sessionsService.deleteSession(id);

        return res.status(response.status).json(response);
    }
}
