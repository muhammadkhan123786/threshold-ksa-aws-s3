import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { CoachesService } from "./coaches.service";
import { Coach } from "../../entities/coach.entity";
import { CreateCoachDto } from "../../dto/coaches/create-coach.dto";
import { UpdateCoachDto } from "../../dto/coaches/update-coach.dto";
import { EditorsWrapper, ControllerWrapper } from "src/decorators";
import CustomResponseType from "src/types/customResponseType";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { NewInstanceTransformer } from "src/types/app.type";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { GetCoachSessionsDto } from "src/dto/coaches/get-coach-sessions.dto";
import { Session } from "src/entities/session.entity";
import { CustomRequest } from "src/types/customRequest";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/enums/users.enum";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { SportProfileType } from "src/enums/athletes.enum";
import { ApiPaginatedCoaches } from "./swagger-decorators";

const transferMapping: NewInstanceTransformer = {
    experience: "number",
    birthday: "date",
    joinDate: "date",
};

@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("coaches")
export class CoachesController {
    constructor(private readonly coachesService: CoachesService) {}

    @Get()
    @ApiPaginatedCoaches()
    async getCoaches(
        @Res() res: Response,
        @GetUser() user: any,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sortField") sortField: string = "createdAt",
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
        @Query("firstName") firstName?: string,
        @Query("lastName") lastName?: string,
        @Query("sport") sport?: SportProfileType,
        @Query("team") team?: string
    ) {
        try {
            const options = { page, limit };
            const filters = { firstName, lastName, sport, team };

            const response = await this.coachesService.getCoaches(
                user,
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Coaches retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving coaches",
                error: error.message,
            });
        }
    }
    @Get("sessions")
    async getSessions(
        @Query() query: GetCoachSessionsDto,
        @Req() req: CustomRequest,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Session[]> =
            await this.coachesService.getSessionsByCoach(query, req.user);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single coach using its ID" })
    async getCoachById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Coach> =
            await this.coachesService.getCoachById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateCoachDto, "create a new coach")
    async createCoach(
        @Body(new NewInstancePipe(transferMapping))
        createCoachDto: CreateCoachDto,
        @GetUser() user: any,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Coach> =
            await this.coachesService.createCoach(createCoachDto, user);

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateCoachDto, "update a coach")
    async updateCoach(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateCoachDto: UpdateCoachDto,
        @GetUser() user: any,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.coachesService.updateCoach(id, updateCoachDto, user);

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    @ApiOperation({ summary: "delete a coach" })
    async deleteCoach(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.coachesService.deleteCoach(id);

        return res.status(response.status).json(response);
    }

    @Patch("recover/:id")
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    @ApiOperation({ summary: "recover a coach" })
    async recoverCoach(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Coach> =
            await this.coachesService.recoverCoach(id);

        return res.status(response.status).json(response);
    }
}
