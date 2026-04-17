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
import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { AthletesService } from "./athletes.service";
import { Athlete } from "../../entities/athlete.entity";
import { CreateAthleteDto } from "../../dto/athletes/create-athlete.dto";
import { UpdateAthleteDto } from "../../dto/athletes/update-athlete.dto";
import CustomResponseType from "src/types/customResponseType";
import { EditorsWrapper, ControllerWrapper } from "src/decorators";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/enums/users.enum";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UpdatePersonalInfoDto } from "src/dto/athletes/update-personal-info.dto";
import { UpdateEmergencyContactDto } from "src/dto/athletes/update-emergency-contact.dto";
import { UpdateClothingDataDto } from "src/dto/athletes/update-clothing-data.dto";
import { UpdateBankDataDto } from "src/dto/athletes/update-bank-data.dto";
import { CreateEmergencyContactDto } from "src/dto/athletes/create-emergency-contact.dto";
import { CreateClothingDataDto } from "src/dto/athletes/create-clothing-data.dto";
import { CreateBankDataDto } from "src/dto/athletes/create-bank-data.dto";
import { UpdateAvailabilityStatusDto } from "src/dto/athletes/update-availability-status";
import { User } from "src/entities/user.entity";
import { AthleteLevel, SportProfileType } from "src/enums/athletes.enum";
import {
    ApiPaginatedAthletes,
    SwaggerCreateClothingData,
    SwaggerUpdateClothingData,
} from "./swagger-decorators";

@ApiTags("Athletes")
@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("athletes")
export class AthletesController {
    constructor(private readonly athletesService: AthletesService) {}

    @Get("subscriptions/analytics")
    @ApiOperation({
        summary: "Get analytics on athlete subscriptions by status",
    })
    @ApiResponse({
        status: 200,
        description: "Subscription analytics retrieved successfully.",
    })
    @ApiResponse({ status: 403, description: "Forbidden." })
    async getSubscriptionAnalytics(
        @Res() res: Response,
        @GetUser() user: User
    ): Promise<Response> {
        console.log("user", user);
        const response: CustomResponseType<any> =
            await this.athletesService.getSubscriptionAnalytics(
                (user as any).payload?.academy?.id
            );

        return res.status(response.status).json(response);
    }

    @Get(":id/details")
    @ApiOperation({ summary: "Get comprehensive details of an athlete" })
    async getAthleteDetails(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<any> =
            await this.athletesService.getAthleteDetails(id);
        return res.status(response.status).json(response);
    }
    @ApiTags("Athlete Analytics")
    @Get(":id/analytics")
    @ApiOperation({
        summary: "Get detailed athlete analytics including training load",
    })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiQuery({
        name: "trainingStartDate",
        description:
            "The start date for calculating training load (YYYY-MM-DD format)",
        example: "2024-01-01",
    })
    @ApiQuery({
        name: "trainingEndDate",
        description:
            "The end date for calculating training load (YYYY-MM-DD format)",
        example: "2024-12-31",
    })
    @ApiResponse({
        status: 200,
        description:
            "Successfully retrieved athlete analytics, including training load data",
        schema: {
            example: {
                sessions: [
                    {
                        date: "2024-09-01",
                        scale: 8,
                        comment: "Good effort today.",
                        load: 120,
                    },
                    {
                        date: "2024-09-02",
                        scale: 6,
                        comment: "Felt tired.",
                        load: 90,
                    },
                ],
                totalSessions: 21,
                practicingPercentage: 100,
                presencePercentage: 90,
                trainingLoad: [
                    {
                        week: "Week of 2024-09-01",
                        totalLoad: 500,
                        averageScale: 7,
                    },
                    {
                        week: "Week of 2024-09-08",
                        totalLoad: 450,
                        averageScale: 6,
                    },
                ],
                level: "Intermediate",
                analyticsBreakdown: {
                    totalSessions: 21,
                    averageLoadPerSession: 105,
                },
            },
        },
    })
    async getAthleteAnalytics(
        @Param("id") athleteId: string,
        @Query("trainingStartDate") trainingStartDate: string,
        @Query("trainingEndDate") trainingEndDate: string
    ) {
        return this.athletesService.getAthleteAnalytics(
            athleteId,
            trainingStartDate,
            trainingEndDate
        );
    }

    @Patch(":id/personal-info")
    @ApiOperation({ summary: "Update personal information" })
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async updatePersonalInfo(
        @Param("id") id: string,
        @Body() updatePersonalInfoDto: UpdatePersonalInfoDto
    ) {
        return this.athletesService.updatePersonalInfo(
            id,
            updatePersonalInfoDto
        );
    }

    @Patch(":id/availability-status")
    @ApiOperation({ summary: "Update availability status" })
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async updateAvailabilityStatus(
        @Param("id") id: string,
        @Body() updateAvailabilityStatusDto: UpdateAvailabilityStatusDto
    ) {
        return this.athletesService.updateAvailabilityStatus(
            id,
            updateAvailabilityStatusDto
        );
    }

    @Post(":id/emergency-contact")
    @ApiOperation({ summary: "Create emergency contact information" })
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async createEmergencyContact(
        @Param("id") id: string,
        @Body() createEmergencyContactDto: CreateEmergencyContactDto
    ) {
        console.log(
            "createEmergencyContactDtocreateEmergencyContactDto",
            createEmergencyContactDto
        );
        return this.athletesService.createEmergencyContact(
            id,
            createEmergencyContactDto
        );
    }

    @Patch(":id/emergency-contact")
    @ApiOperation({ summary: "Update emergency contact information" })
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async updateEmergencyContact(
        @Param("id") id: string,
        @Body() updateEmergencyContactDto: UpdateEmergencyContactDto
    ) {
        return this.athletesService.updateEmergencyContact(
            id,
            updateEmergencyContactDto
        );
    }

    @Post(":id/clothing-data")
    @SwaggerCreateClothingData()
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async createClothingData(
        @Param("id") id: string,
        @Body() createClothingDataDto: CreateClothingDataDto
    ) {
        return this.athletesService.createClothingData(
            id,
            createClothingDataDto
        );
    }

    @Patch(":id/clothing-data")
    @SwaggerUpdateClothingData()
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async updateClothingData(
        @Param("id") id: string,
        @Body() updateClothingDataDto: UpdateClothingDataDto
    ) {
        return this.athletesService.updateClothingData(
            id,
            updateClothingDataDto
        );
    }

    @Post(":id/bank-data")
    @ApiOperation({ summary: "Create bank data for an athlete" })
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async createBankData(
        @Param("id") id: string,
        @Body() createBankDataDto: CreateBankDataDto
    ) {
        return this.athletesService.createBankData(id, createBankDataDto);
    }

    @Patch(":id/bank-data")
    @ApiOperation({ summary: "Update bank data" })
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    async updateBankData(
        @Param("id") id: string,
        @Body() updateBankDataDto: UpdateBankDataDto
    ) {
        return this.athletesService.updateBankData(id, updateBankDataDto);
    }

    @Get("today")
    async getAthletesForToday(
        @GetUser() user: any,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const response: CustomResponseType<Athlete[]> =
                await this.athletesService.getAthletesForToday(user);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }
    @Get()
    @ApiPaginatedAthletes()
    async getAthletes(
        @Res() res: Response,
        @GetUser() user: User,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sortField") sortField: string = "createdAt",
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
        @Query("firstName") firstName?: string,
        @Query("lastName") lastName?: string,
        @Query("level") level?: AthleteLevel,
        @Query("team") team?: string,
        @Query("subscriptionStatus") subscriptionStatus?: string,
        @Query("sport") sport?: SportProfileType
    ) {
        try {
            const options = { page, limit };
            const filters = {
                firstName,
                lastName,
                level,
                team,
                subscriptionStatus,
                sport,
            };

            const response = await this.athletesService.getAthletes(
                user,
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Athletes retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving athletes",
                error: error.message,
            });
        }
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single athlete using its ID" })
    async getAthleteById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Athlete> =
            await this.athletesService.getAthleteById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateAthleteDto, "create a new athlete")
    async createAthlete(
        @Body()
        createAthleteDto: CreateAthleteDto,
        @GetUser() user: any,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Athlete> =
            await this.athletesService.createAthlete(createAthleteDto, user);

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateAthleteDto, "update a athlete")
    async updateAthlete(
        @Param("id") id: string,
        @Body()
        updateAthleteDto: UpdateAthleteDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.athletesService.updateAthlete(id, updateAthleteDto);

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    @ApiOperation({ summary: "delete a athlete" })
    async deleteAthlete(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.athletesService.deleteAthlete(id);

        return res.status(response.status).json(response);
    }

    @Patch("recover/:id")
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    @ApiOperation({ summary: "recover an athlete" })
    async recoverAthlete(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Athlete> =
            await this.athletesService.recoverAthlete(id);

        return res.status(response.status).json(response);
    }

    @Get()
    @ApiPaginatedAthletes()
    async getCoachLevels(
        @Res() res: Response,
        @GetUser() user: User,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sortField") sortField: string = "createdAt",
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
        @Query("firstName") firstName?: string,
        @Query("lastName") lastName?: string,
        @Query("level") level?: AthleteLevel,
        @Query("team") team?: string,
        @Query("subscriptionStatus") subscriptionStatus?: string,
        @Query("sport") sport?: SportProfileType
    ) {
        try {
            const options = { page, limit };
            const filters = {
                firstName,
                lastName,
                level,
                team,
                subscriptionStatus,
                sport,
            };

            const response = await this.athletesService.getCoachLevel(
                user,
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Athletes retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving athletes",
                error: error.message,
            });
        }
    }
}
