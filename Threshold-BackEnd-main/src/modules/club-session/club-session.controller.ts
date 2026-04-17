import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Patch,
    ValidationPipe,
    UsePipes,
    HttpException,
    InternalServerErrorException,
} from "@nestjs/common";
import { ClubSessionService } from "./club-session.service";
import {
    CreateClubSessionDto,
    UpdateClubSessionDto,
} from "../../dto/club-session.dto";
import { UpdateSessionResultsDto } from "../../dto/club-session-results.dto";
import { ClubSession } from "../../entities/clubSession.entity";
import { ClubSessionTemplate } from "../../entities/clubSessionTemplate.entity";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiQuery,
    ApiBearerAuth,
} from "@nestjs/swagger";
import { GetSessionPhasesResponseDto } from "../../dto/club-session/get-session-phases.dto";
import {
    ApiCreateSession,
    ApiUpdateSession,
    ApiGetSessionsByTeam,
    ApiGetUpcomingSessions,
    ApiGetCompletedSessions,
    ApiGetSessionById,
    ApiDeleteSession,
    ApiGetSessionsByDateRange,
    ApiStartSession,
    ApiCompleteSession,
    ApiCancelSession,
    ApiGetSessionTemplate,
    ApiGetSessionResults,
    ApiUpdateSessionResults,
    ApiGetSessionPhasesWithPlayers,
    ApiGetSessionPhaseRecords,
    ApiUpdateSessionPhaseRecords,
    ApiGetTemplatesBySport,
    ApiUpdateTemplatePhases,
    ApiGetTemplatePhases,
    ApiFinishSession,
    ApiSubmitPlayerRevision,
    ApiGetSessionRevision,
} from "../../swagger/club-sessions/api-decorators";
import { SessionPhaseRecordsResponseDto } from "../../dto/club-session/session-phase-records.dto";
import { UpdateSessionPhaseRecordsDto } from "../../dto/club-session/update-session-phase-records.dto";
import { UpdateTemplatePhaseOrderRequestDto } from "../../dto/club-session-template/update-template-phase-order.dto";
import { GetTemplatePhasesResponseDto } from "../../dto/club-session-template/get-template-phases.dto";
import { SubmitPlayerFeedbackDto } from "../../dto/club-session/submit-player-feedback.dto";
import { SessionFeedbackResponseDto } from "../../dto/club-session/session-feedback-response.dto";
import { SubmitPlayerRevisionDto } from "../../dto/club-session/submit-player-revision.dto";
import { SessionRevisionResponseDto } from "../../dto/club-session/session-revision-response.dto";

@ApiTags("Club Sessions")
@Controller("club-sessions")
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ClubSessionController {
    constructor(private readonly clubSessionService: ClubSessionService) {}

    @Post("team/:teamId")
    @ApiCreateSession()
    async createSession(
        @Param("teamId") teamId: string,
        @Body() createDto: CreateClubSessionDto
    ): Promise<ClubSession> {
        try {
            return await this.clubSessionService.createSession(
                teamId,
                createDto
            );
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(
                `Failed to create session: ${error.message}`
            );
        }
    }

    @Get("team/:teamId")
    @ApiGetSessionsByTeam()
    async getSessionsByTeam(
        @Param("teamId") teamId: string
    ): Promise<ClubSession[]> {
        return this.clubSessionService.getSessionsByTeam(teamId);
    }

    @Get("team/:teamId/upcoming")
    @ApiGetUpcomingSessions()
    async getUpcomingSessions(
        @Param("teamId") teamId: string
    ): Promise<ClubSession[]> {
        return this.clubSessionService.getUpcomingSessions(teamId);
    }

    @Get("team/:teamId/completed")
    @ApiGetCompletedSessions()
    async getCompletedSessions(
        @Param("teamId") teamId: string
    ): Promise<ClubSession[]> {
        return this.clubSessionService.getCompletedSessions(teamId);
    }

    @Get("team/:teamId/date-range")
    @ApiGetSessionsByDateRange()
    async getSessionsByDateRange(
        @Param("teamId") teamId: string,
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string
    ): Promise<ClubSession[]> {
        return this.clubSessionService.getSessionsByDateRange(
            teamId,
            new Date(startDate),
            new Date(endDate)
        );
    }

    @Get(":id")
    @ApiGetSessionById()
    async getSessionById(@Param("id") id: string): Promise<ClubSession> {
        return this.clubSessionService.getSessionById(id);
    }

    @Put(":id")
    @ApiUpdateSession()
    async updateSession(
        @Param("id") id: string,
        @Body() updateDto: UpdateClubSessionDto
    ): Promise<ClubSession> {
        return this.clubSessionService.updateSession(id, updateDto);
    }

    @Delete(":id")
    @ApiDeleteSession()
    async deleteSession(@Param("id") id: string): Promise<void> {
        return this.clubSessionService.deleteSession(id);
    }

    @Patch(":id/start")
    @ApiStartSession()
    async startSession(@Param("id") id: string): Promise<ClubSession> {
        return this.clubSessionService.startSession(id);
    }

    @Patch(":id/complete")
    @ApiCompleteSession()
    async completeSession(@Param("id") id: string): Promise<ClubSession> {
        return this.clubSessionService.completeSession(id);
    }

    @Patch(":id/cancel")
    @ApiCancelSession()
    async cancelSession(@Param("id") id: string): Promise<ClubSession> {
        return this.clubSessionService.cancelSession(id);
    }

    @Get(":id/template")
    @ApiGetSessionTemplate()
    async getSessionTemplate(
        @Param("id") id: string
    ): Promise<ClubSessionTemplate> {
        return this.clubSessionService.getSessionTemplate(id);
    }

    @Get(":id/results")
    @ApiGetSessionResults()
    async getSessionResults(@Param("id") id: string): Promise<any> {
        return this.clubSessionService.getSessionResults(id);
    }

    @Put(":id/results")
    @ApiUpdateSessionResults()
    async updateSessionResults(
        @Param("id") id: string,
        @Body() resultsDto: UpdateSessionResultsDto
    ): Promise<ClubSession> {
        return this.clubSessionService.updateSessionResults(id, resultsDto);
    }

    @Get(":id/phases-with-players")
    @ApiGetSessionPhasesWithPlayers()
    async getSessionPhasesWithPlayers(
        @Param("id") id: string
    ): Promise<GetSessionPhasesResponseDto> {
        try {
            return await this.clubSessionService.getSessionPhasesWithPlayers(
                id
            );
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(
                `Failed to get session phases with players: ${error.message}`
            );
        }
    }

    @Get(":id/phase-records")
    @ApiGetSessionPhaseRecords()
    async getSessionPhaseRecords(
        @Param("id") id: string
    ): Promise<SessionPhaseRecordsResponseDto> {
        try {
            return await this.clubSessionService.getSessionPhaseRecords(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(
                `Failed to retrieve session phase records: ${error.message}`
            );
        }
    }

    @Post(":id/phase-records")
    @ApiUpdateSessionPhaseRecords()
    async updateSessionPhaseRecords(
        @Param("id") id: string,
        @Body() updateDto: UpdateSessionPhaseRecordsDto
    ): Promise<SessionPhaseRecordsResponseDto> {
        try {
            return await this.clubSessionService.updateSessionPhaseRecords(
                id,
                updateDto
            );
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(
                `Failed to update session phase records: ${error.message}`
            );
        }
    }

    @Get("templates/sport/:sportId")
    @ApiGetTemplatesBySport()
    async getTemplatesBySport(
        @Param("sportId") sportId: string
    ): Promise<ClubSessionTemplate[]> {
        return this.clubSessionService.getTemplatesBySport(sportId);
    }

    @Put("templates/:templateId/phases")
    @ApiUpdateTemplatePhases()
    async updateTemplatePhases(
        @Param("templateId") templateId: string,
        @Body() updateDto: UpdateTemplatePhaseOrderRequestDto
    ): Promise<ClubSessionTemplate> {
        return this.clubSessionService.updateTemplatePhases(
            templateId,
            updateDto
        );
    }

    @Get("templates/:templateId/phases")
    @ApiGetTemplatePhases()
    async getTemplatePhases(
        @Param("templateId") templateId: string
    ): Promise<GetTemplatePhasesResponseDto> {
        return this.clubSessionService.getTemplatePhases(templateId);
    }

    @Post(":id/finish")
    @ApiFinishSession()
    async finishSession(@Param("id") id: string): Promise<ClubSession> {
        try {
            return await this.clubSessionService.finishSession(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(
                `Failed to finish session: ${error.message}`
            );
        }
    }

    @Post(":id/revision")
    @ApiSubmitPlayerRevision
    async submitPlayerRevision(
        @Param("id") id: string,
        @Body() dto: SubmitPlayerRevisionDto
    ): Promise<ClubSession> {
        return this.clubSessionService.submitPlayerRevision(id, dto);
    }

    @Get(":id/revision")
    @ApiGetSessionRevision
    async getSessionRevision(
        @Param("id") id: string
    ): Promise<SessionRevisionResponseDto> {
        return this.clubSessionService.getSessionRevision(id);
    }
}
