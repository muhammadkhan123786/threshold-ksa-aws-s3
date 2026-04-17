import {
    Body,
    ConflictException,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    HttpStatus,
} from "@nestjs/common";
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
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
    ApiPlayerAnalytics,
    SwaggerCreateClothingData,
    SwaggerUpdateClothingData,
} from "./swagger-decorators";
import { ClubPlayerService } from "./clubPlayer.service";
import { CreatePlayerDto } from "src/dto/clubPlayer/create-player.dto";
import { UpdatePlayerDto } from "src/dto/clubPlayer/update-player.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { SWAGGER_PLAYER } from "./clubPlayer.swagger.decorator";
import { CreatePlayerByTeamDto } from "src/dto/clubPlayer/create-player-by-team.dto";

@ApiTags("Players")
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("players")
export class ClubPlayerController {
    constructor(private readonly clubPlayerService: ClubPlayerService) {}

    @Get("subscriptions/analytics")
    @ApiOperation({
        summary: "Get analytics on player subscriptions by status",
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
        const response: CustomResponseType<any> =
            await this.clubPlayerService.getSubscriptionAnalytics(
                (user as any).payload?.academy?.id
            );
        return res.status(response.status).json(response);
    }

    @Get(":id/details")
    @ApiOperation({ summary: "Get comprehensive details of a player" })
    async getPlayerDetails(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<any> =
            await this.clubPlayerService.getPlayerDetails(id);
        return res.status(response.status).json(response);
    }

    @ApiTags("Player Analytics")
    @Get(":id/analytics")
    @ApiPlayerAnalytics()
    async getPlayerAnalytics(
        @Param("id") playerId: string,
        @Query("trainingStartDate") trainingStartDate: string,
        @Query("trainingEndDate") trainingEndDate: string
    ) {
        return this.clubPlayerService.getPlayerAnalytics(
            playerId,
            trainingStartDate,
            trainingEndDate
        );
    }

    @Patch(":id/personal-info")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("avatar", {
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
        })
    )
    @ApiBody(SWAGGER_PLAYER.UPDATE_PERSONAL_INFORMATION)
    @ApiOperation({ summary: "Update personal information" })
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async updatePersonalInfo(
        @Param("id") id: string,
        @UploadedFile() avatar: Express.Multer.File,
        @Body() updatePersonalInfoDto: UpdatePersonalInfoDto
    ) {
        return this.clubPlayerService.updatePersonalInfo(
            id,
            avatar,
            updatePersonalInfoDto
        );
    }

    @Patch(":id/availability-status")
    @ApiOperation({ summary: "Update availability status" })
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async updateAvailabilityStatus(
        @Param("id") id: string,
        @Body() updateAvailabilityStatusDto: UpdateAvailabilityStatusDto
    ) {
        return this.clubPlayerService.updateAvailabilityStatus(
            id,
            updateAvailabilityStatusDto
        );
    }

    @Post(":id/emergency-contact")
    @ApiOperation({ summary: "Create emergency contact information" })
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async createEmergencyContact(
        @Param("id") id: string,
        @Body() createEmergencyContactDto: CreateEmergencyContactDto
    ) {
        return this.clubPlayerService.createEmergencyContact(
            id,
            createEmergencyContactDto
        );
    }

    @Patch(":id/emergency-contact")
    @ApiOperation({ summary: "Update emergency contact information" })
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async updateEmergencyContact(
        @Param("id") id: string,
        @Body() updateEmergencyContactDto: UpdateEmergencyContactDto
    ) {
        return this.clubPlayerService.updateEmergencyContact(
            id,
            updateEmergencyContactDto
        );
    }

    @Post(":id/clothing-data")
    @SwaggerCreateClothingData()
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async createClothingData(
        @Param("id") id: string,
        @Body() createClothingDataDto: CreateClothingDataDto
    ) {
        return this.clubPlayerService.createClothingData(
            id,
            createClothingDataDto
        );
    }

    @Patch(":id/clothing-data")
    @SwaggerUpdateClothingData()
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async updateClothingData(
        @Param("id") id: string,
        @Body() updateClothingDataDto: UpdateClothingDataDto
    ) {
        return this.clubPlayerService.updateClothingData(
            id,
            updateClothingDataDto
        );
    }

    @Post(":id/bank-data")
    @ApiOperation({ summary: "Create bank data for a player" })
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async createBankData(
        @Param("id") id: string,
        @Body() createBankDataDto: CreateBankDataDto
    ) {
        return this.clubPlayerService.createBankData(id, createBankDataDto);
    }

    @Patch(":id/bank-data")
    @ApiOperation({ summary: "Update bank data" })
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    async updateBankData(
        @Param("id") id: string,
        @Body() updateBankDataDto: UpdateBankDataDto
    ) {
        return this.clubPlayerService.updateBankData(id, updateBankDataDto);
    }

    @Get("today")
    async getPlayersForToday(@GetUser() user: any, @Res() res: Response) {
        try {
            const response: CustomResponseType<Athlete[]> =
                await this.clubPlayerService.getPlayersForToday(user);
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
    async getPlayers(
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
        @Query("sportId") sportId?: string
    ) {
        try {
            const options = { page, limit };
            const filters = {
                firstName,
                lastName,
                level,
                team,
                subscriptionStatus,
                sportId,
            };

            const response = await this.clubPlayerService.getPlayers(
                user,
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Players retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving players",
                error: error.message,
            });
        }
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a single player using its ID" })
    async getPlayerById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Athlete> =
            await this.clubPlayerService.getPlayerById(id);
        return res.status(response.status).json(response);
    }

    @Post(":sport_id")
    @UseInterceptors(
        FileInterceptor("avatar", {
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
    @ApiOperation(SWAGGER_PLAYER.CREATE_OPERATION)
    @ApiParam(SWAGGER_PLAYER.SPORT_ID_PARAM)
    @ApiBody(SWAGGER_PLAYER.CREATE_BODY)
    @ApiResponse(SWAGGER_PLAYER.CREATE_SUCCESS)
    @ApiResponse(SWAGGER_PLAYER.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER.SERVER_ERROR_RESPONSE)
    @ApiConsumes("multipart/form-data")
    async createPlayerBySportId(
        @Param("sport_id") sportId: string,
        @Body() createAthleteDto: CreatePlayerDto,
        @UploadedFile() avatar: Express.Multer.File,
        @GetUser() user: any,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Athlete> =
            await this.clubPlayerService.createAthleteForSport(
                sportId,
                createAthleteDto,
                user,
                avatar
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a player's information" })
    @ApiParam({ name: "id", description: "Player ID" })
    @ApiBody(SWAGGER_PLAYER.CREATE_BODY)
    @ApiResponse({
        status: 200,
        description: "Player updated successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Player updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        dateOfBirth: { type: "string", format: "date-time" },
                        gender: { type: "string" },
                        nationality: { type: "string" },
                        education: { type: "string" },
                        weight: { type: "string" },
                        nin: { type: "string" },
                        // Add other relevant fields
                    },
                },
            },
        },
    })
    @ApiResponse(SWAGGER_PLAYER.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER.SERVER_ERROR_RESPONSE)
    @EditorsWrapper(UpdatePlayerDto, "update a player")
    async updatePlayer(
        @Param("id") id: string,
        @Body() updateAthleteDto: UpdatePlayerDto,
        @Res() res: Response
    ) {
        const response = await this.clubPlayerService.updatePlayer(
            id,
            updateAthleteDto
        );

        if (response.status === 200) {
            // Fetch the updated player data
            const updatedPlayer =
                await this.clubPlayerService.getPlayerById(id);
            return res.status(response.status).json({
                message: response.message,
                data: updatedPlayer.payload,
            });
        }

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    @ApiOperation({ summary: "Delete a player" })
    async deletePlayer(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.clubPlayerService.deletePlayer(id);

        return res.status(response.status).json(response);
    }

    @Patch("recover/:id")
    @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER)
    @ApiOperation({ summary: "Recover a player" })
    async recoverPlayer(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Athlete> =
            await this.clubPlayerService.recoverPlayer(id);

        return res.status(response.status).json(response);
    }

    @Get("coach-levels")
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
        @Query("sport") sport?: SportProfileType,
        @Query("sportId") sportId?: string
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
                sportId,
            };

            const response = await this.clubPlayerService.getCoachLevel(
                user,
                options,
                filters,
                sortField,
                sortOrder
            );

            return res.status(200).json({
                message: "Players retrieved successfully",
                data: response.items,
                meta: response.meta,
                links: response.links,
            });
        } catch (error) {
            return res.status(500).json({
                message: "An error occurred while retrieving players",
                error: error.message,
            });
        }
    }

    @Post(":team_id/player")
    @UseInterceptors(
        FileInterceptor("avatar", {
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
        })
    )
    @ApiOperation({ summary: "Create a new player for a specific team" })
    @ApiParam({ name: "team_id", description: "Team ID", type: String })
    @ApiBody(SWAGGER_PLAYER.CREATE_BODY)
    @ApiResponse(SWAGGER_PLAYER.CREATE_SUCCESS)
    @ApiResponse(SWAGGER_PLAYER.VALIDATION_ERROR_RESPONSE)
    @ApiResponse(SWAGGER_PLAYER.SERVER_ERROR_RESPONSE)
    @ApiConsumes("multipart/form-data")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    )
    async createPlayerByTeamId(
        @Param("team_id") teamId: string,
        @Body() createPlayerByTeamDto: CreatePlayerByTeamDto,
        @UploadedFile() avatar: Express.Multer.File,
        @GetUser() user: any,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Athlete> =
            await this.clubPlayerService.createPlayerForTeam(
                teamId,
                createPlayerByTeamDto,
                user,
                avatar
            );

        return res.status(response.status).json(response);
    }
}
