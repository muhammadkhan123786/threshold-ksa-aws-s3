import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    Res,
    Body,
    Post,
} from "@nestjs/common";
import { Response } from "express";
import { ExamSessionsService } from "./examSessions.service";
import { UpdateSessionDto } from "../../dto/sessions/update-session.dto";
import {
    ApiPaginatedExamSessions,
    ApiUpdateExamSession,
    ApiDeleteExamSession,
    ApiCreateExamSession,
} from "./swagger-decorators";
import { PlayingSessionStatus } from "src/enums/athletes.enum";
import { CreateSessionDto } from "src/dto/sessions/create-session.dto";

@Controller("exam-sessions")
export class ExamSessionsController {
    constructor(private readonly examSessionsService: ExamSessionsService) {}

    @Get()
    @ApiPaginatedExamSessions()
    async getExamSessions(
        @Res() res: Response,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sortField") sortField: string = "createdAt",
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
        @Query("status") status?: PlayingSessionStatus,
        @Query("teamId") teamId?: string,
        @Query("searchQuery") searchQuery?: string,
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string
    ) {
        const options = { page, limit };
        const filters = { status, searchQuery, teamId, startDate, endDate };

        try {
            const response = await this.examSessionsService.getExamSessions(
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Exam sessions retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving exam sessions",
                error: error.message,
            });
        }
    }

    @Post()
    @ApiCreateExamSession()
    async createExamSession(
        @Body() createSessionDto: CreateSessionDto,
        @Res() res: Response
    ) {
        try {
            const response =
                await this.examSessionsService.createExamSession(
                    createSessionDto
                );

            return res.status(201).json({
                message: "Exam session created successfully",
                data: response.payload,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while creating the exam session",
                error: error.message,
            });
        }
    }

    @Patch(":id")
    @ApiUpdateExamSession()
    async updateExamSession(
        @Param("id") id: string,
        @Body() updateSessionDto: UpdateSessionDto,
        @Res() res: Response
    ) {
        try {
            const response = await this.examSessionsService.updateExamSession(
                id,
                updateSessionDto
            );

            return res.status(200).json({
                message: "Exam session updated successfully",
                data: response.payload,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while updating the exam session",
                error: error.message,
            });
        }
    }

    @Delete(":id")
    @ApiDeleteExamSession()
    async softDeleteExamSession(@Param("id") id: string, @Res() res: Response) {
        try {
            const response =
                await this.examSessionsService.softDeleteExamSession(id);

            return res.status(200).json({
                message: "Exam session deleted successfully",
                data: response.payload,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while deleting the exam session",
                error: error.message,
            });
        }
    }
}
