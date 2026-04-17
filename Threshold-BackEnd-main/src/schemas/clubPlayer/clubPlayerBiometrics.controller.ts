import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
    HttpStatus,
    ParseUUIDPipe,
    ValidationPipe,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiParam,
} from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ClubPlayerBiometricsService } from "./clubPlayerBiometrics.service";
import { CreateClubPlayerBiometricDto } from "src/dto/clubPlayerBiometrics/create-club-player-biometric.dto";
import { UpdateClubPlayerBiometricDto } from "src/dto/clubPlayerBiometrics/update-club-player-biometric.dto";
import { ClubPlayerBiometricDto } from "src/dto/clubPlayerBiometrics/club-player-biometric.dto";
import {
    BMICategory,
    HealthRisk,
} from "src/entities/clubPlayerBiometric.entity";

@ApiTags("Club Player Biometrics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("players/:playerId/biometrics")
export class ClubPlayerBiometricsController {
    constructor(
        private readonly biometricsService: ClubPlayerBiometricsService
    ) {}

    @Get()
    @ApiOperation({
        summary: "Get player biometric data for a specific period",
        description:
            "Retrieve comprehensive biometric measurements including BMI, weight trends, and health assessments.",
    })
    @ApiParam({
        name: "playerId",
        description: "UUID of the player",
        type: String,
        required: true,
    })
    @ApiQuery({
        name: "startDate",
        required: true,
        description: "Start date for data retrieval (ISO 8601 format)",
        example: "2024-01-01T00:00:00.000Z",
    })
    @ApiQuery({
        name: "endDate",
        required: true,
        description: "End date for data retrieval (ISO 8601 format)",
        example: "2024-06-30T23:59:59.999Z",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully retrieved biometric data",
        type: [ClubPlayerBiometricDto],
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid date format or date range",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Player not found",
    })
    async getBiometricDataForPeriod(
        @Param("playerId", ParseUUIDPipe) playerId: string,
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string,
        @Res() res: Response
    ) {
        try {
            const data = await this.biometricsService.getBiometricDataForPeriod(
                playerId,
                startDate,
                endDate
            );
            return res.status(HttpStatus.OK).json({
                message: "Biometric data retrieved successfully",
                data,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error retrieving biometric data",
                error: error.message,
            });
        }
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get a specific biometric record",
        description:
            "Retrieve detailed information about a specific biometric measurement including BMI calculations and health assessments.",
    })
    @ApiParam({
        name: "playerId",
        description: "UUID of the player",
        type: String,
        required: true,
    })
    @ApiParam({
        name: "id",
        description: "UUID of the biometric record",
        type: String,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully retrieved biometric record",
        type: ClubPlayerBiometricDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Biometric record not found",
    })
    async getBiometricById(
        @Param("id", ParseUUIDPipe) id: string,
        @Res() res: Response
    ) {
        const response = await this.biometricsService.getBiometricById(id);
        return res.status(response.status).json(response);
    }

    @Post()
    @ApiOperation({
        summary: "Create a new biometric record",
        description:
            "Create a new biometric measurement with automatic calculation of BMI, health risk assessment, and ideal weight ranges.",
    })
    @ApiParam({
        name: "playerId",
        description: "UUID of the player",
        type: String,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Biometric record created successfully",
        type: ClubPlayerBiometricDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid input data",
    })
    async createBiometric(
        @Param("playerId", ParseUUIDPipe) playerId: string,
        @Body(new ValidationPipe({ transform: true }))
        createDto: CreateClubPlayerBiometricDto,
        @Res() res: Response
    ) {
        createDto.playerId = playerId;
        const response =
            await this.biometricsService.createBiometric(createDto);
        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Update a biometric record",
        description:
            "Update an existing biometric record with automatic recalculation of BMI-related metrics.",
    })
    @ApiParam({
        name: "playerId",
        description: "UUID of the player",
        type: String,
        required: true,
    })
    @ApiParam({
        name: "id",
        description: "UUID of the biometric record",
        type: String,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Biometric record updated successfully",
        type: ClubPlayerBiometricDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Biometric record not found",
    })
    async updateBiometric(
        @Param("id", ParseUUIDPipe) id: string,
        @Body(new ValidationPipe({ transform: true }))
        updateDto: UpdateClubPlayerBiometricDto,
        @Res() res: Response
    ) {
        const response = await this.biometricsService.updateBiometric(
            id,
            updateDto
        );
        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({
        summary: "Delete a biometric record",
        description:
            "Soft delete a biometric record while maintaining historical data integrity.",
    })
    @ApiParam({
        name: "playerId",
        description: "UUID of the player",
        type: String,
        required: true,
    })
    @ApiParam({
        name: "id",
        description: "UUID of the biometric record",
        type: String,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Biometric record deleted successfully",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Biometric record not found",
    })
    async deleteBiometric(
        @Param("id", ParseUUIDPipe) id: string,
        @Res() res: Response
    ) {
        const response = await this.biometricsService.deleteBiometric(id);
        return res.status(response.status).json(response);
    }
}
