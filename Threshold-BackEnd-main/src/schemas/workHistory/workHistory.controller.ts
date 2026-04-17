import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    Patch,
    UseGuards,
    Res,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiBody, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/enums/users.enum";
import { WorkHistoryService } from "./workHistory.service";
import {
    CreateWorkHistoryDto,
    UpdateWorkHistoryDto,
    GetWorkHistoryQueryDto,
} from "src/dto/workHistory/work-history.dto";
import {
    ApiCreateWorkHistory,
    ApiDeleteWorkHistory,
    ApiGetWorkHistory,
    ApiGetWorkHistoryById,
    ApiUpdateWorkHistory,
    SWAGGER_WORK_HISTORY,
} from "./workHistory.swagger.decorator";

@ApiTags("Work History")
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkHistoryController {
    private readonly logger = new Logger(WorkHistoryController.name);

    constructor(private readonly workHistoryService: WorkHistoryService) {}

    // Coach Work History
    @Get("coaches/:coachId/work-history")
    @ApiGetWorkHistory()
    @ApiParam({ name: "coachId", description: "Coach ID", type: "string" })
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async getWorkHistoryForCoach(
        @Param("coachId") coachId: string,
        @Query() query: GetWorkHistoryQueryDto,
        @Res() res: Response
    ) {
        try {
            const result = await this.workHistoryService.getWorkHistoryForCoach(
                coachId,
                query.page,
                query.limit
            );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryForCoach: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error retrieving work history",
                error: error.message,
            });
        }
    }

    @Post("coaches/:coachId/work-history")
    @ApiCreateWorkHistory()
    @ApiParam({ name: "coachId", description: "Coach ID", type: "string" })
    @ApiBody({ type: CreateWorkHistoryDto })
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async createWorkHistoryForCoach(
        @Param("coachId") coachId: string,
        @Body() createDto: CreateWorkHistoryDto,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.workHistoryService.createWorkHistoryForCoach(
                    coachId,
                    createDto
                );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in createWorkHistoryForCoach: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error creating work history",
                error: error.message,
            });
        }
    }

    // Club Admin Work History
    @Get("club-admins/:adminId/work-history")
    @ApiGetWorkHistory()
    @ApiParam({ name: "adminId", description: "Club Admin ID", type: "string" })
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async getWorkHistoryForClubAdmin(
        @Param("adminId") adminId: string,
        @Query() query: GetWorkHistoryQueryDto,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.workHistoryService.getWorkHistoryForClubAdmin(
                    adminId,
                    query.page,
                    query.limit
                );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryForClubAdmin: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error retrieving work history",
                error: error.message,
            });
        }
    }

    @Post("club-admins/:adminId/work-history")
    @ApiCreateWorkHistory()
    @ApiParam({ name: "adminId", description: "Club Admin ID", type: "string" })
    @ApiBody({ type: CreateWorkHistoryDto })
    @Roles(UserRole.ADMIN, UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN)
    async createWorkHistoryForClubAdmin(
        @Param("adminId") adminId: string,
        @Body() createDto: CreateWorkHistoryDto,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.workHistoryService.createWorkHistoryForClubAdmin(
                    adminId,
                    createDto
                );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in createWorkHistoryForClubAdmin: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error creating work history",
                error: error.message,
            });
        }
    }

    // Manager Work History
    @Get("managers/:managerId/work-history")
    @ApiGetWorkHistory()
    @ApiParam({ name: "managerId", description: "Manager ID", type: "string" })
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async getWorkHistoryForManager(
        @Param("managerId") managerId: string,
        @Query() query: GetWorkHistoryQueryDto,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.workHistoryService.getWorkHistoryForManager(
                    managerId,
                    query.page,
                    query.limit
                );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryForManager: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error retrieving work history",
                error: error.message,
            });
        }
    }

    @Post("managers/:managerId/work-history")
    @ApiCreateWorkHistory()
    @ApiParam({ name: "managerId", description: "Manager ID", type: "string" })
    @ApiBody({ type: CreateWorkHistoryDto })
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async createWorkHistoryForManager(
        @Param("managerId") managerId: string,
        @Body() createDto: CreateWorkHistoryDto,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.workHistoryService.createWorkHistoryForManager(
                    managerId,
                    createDto
                );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in createWorkHistoryForManager: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error creating work history",
                error: error.message,
            });
        }
    }

    // Common endpoints for all work history entries
    @Get("work-history/:id")
    @ApiGetWorkHistoryById()
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async getWorkHistoryById(@Param("id") id: string, @Res() res: Response) {
        try {
            const result = await this.workHistoryService.getWorkHistoryById(id);
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryById: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error retrieving work history",
                error: error.message,
            });
        }
    }

    @Patch("work-history/:id")
    @ApiUpdateWorkHistory()
    @ApiBody({ type: UpdateWorkHistoryDto })
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async updateWorkHistory(
        @Param("id") id: string,
        @Body() updateDto: UpdateWorkHistoryDto,
        @Res() res: Response
    ) {
        try {
            const result = await this.workHistoryService.updateWorkHistory(
                id,
                updateDto
            );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in updateWorkHistory: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error updating work history",
                error: error.message,
            });
        }
    }

    @Delete("work-history/:id")
    @ApiDeleteWorkHistory()
    @Roles(UserRole.ADMIN, UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN)
    async deleteWorkHistory(@Param("id") id: string, @Res() res: Response) {
        try {
            const result = await this.workHistoryService.deleteWorkHistory(id);
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in deleteWorkHistory: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error deleting work history",
                error: error.message,
            });
        }
    }
}
