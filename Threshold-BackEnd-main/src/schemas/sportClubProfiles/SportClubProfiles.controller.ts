import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Res,
    HttpException,
    HttpStatus,
    Query,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiQuery,
} from "@nestjs/swagger";
import { Response } from "express";
import { S3Service } from "src/s3/s3.service";
import { SportClubProfilesService } from "./SportClubProfiles.service";
import { CreateSportClubProfileDto } from "src/dto/sportClubProfile/CreateSportClubProfile.dto";
import { UpdateSportClubProfileDto } from "src/dto/sportClubProfile/UpdateSportClubProfile.dto";
import { ApiResponseExamples, ApiParams, ApiBodies } from "./swagger.constants";

@ApiTags("Sport Club Profiles")
@Controller("sport-club-profiles")
export class SportClubProfilesController {
    constructor(
        private readonly sportClubProfilesService: SportClubProfilesService,
        private readonly s3Service: S3Service
    ) {}

    @Get(":clubId")
    @ApiOperation({
        summary: "Get sport club profile by Club ID with relation counts",
    })
    @ApiParam(ApiParams.CLUB_ID)
    @ApiQuery({
        name: "includeInactive",
        required: false,
        type: Boolean,
        description: "Whether to include inactive sport profiles",
        example: false,
    })
    @ApiResponse(ApiResponseExamples.GET_ONE)
    async getByClubId(
        @Param("clubId") clubId: string,
        @Query("includeInactive") includeInactive: string,
        @Res() res: Response
    ) {
        try {
            // Parse the includeInactive query parameter
            const shouldIncludeInactive =
                includeInactive === "true" || includeInactive === "1";

            const clubProfile = await this.sportClubProfilesService.getByClubId(
                clubId,
                shouldIncludeInactive
            );
            return res.status(200).json(clubProfile);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a single sport club profile" })
    @ApiParam(ApiParams.ID)
    @ApiResponse(ApiResponseExamples.GET_ONE)
    async getById(@Param("id") id: string, @Res() res: Response) {
        try {
            const clubProfile = await this.sportClubProfilesService.getById(id);
            return res.status(200).json(clubProfile);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    @ApiOperation({ summary: "Create a new sport club profile" })
    @ApiBody(ApiBodies.CREATE)
    @ApiResponse(ApiResponseExamples.CREATED)
    async create(
        @Body() createDto: CreateSportClubProfileDto,
        @Res() res: Response
    ) {
        try {
            const clubProfile =
                await this.sportClubProfilesService.create(createDto);
            return res.status(201).json(clubProfile);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a sport club profile" })
    @ApiParam(ApiParams.ID)
    @ApiBody(ApiBodies.UPDATE)
    @ApiResponse(ApiResponseExamples.UPDATED)
    async update(
        @Param("id") id: string,
        @Body() updateDto: UpdateSportClubProfileDto,
        @Res() res: Response
    ) {
        try {
            const clubProfile = await this.sportClubProfilesService.update(
                id,
                updateDto
            );
            return res.status(200).json(clubProfile);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(":id/toggle-active")
    @ApiOperation({ summary: "Toggle active status of a sport club profile" })
    @ApiParam(ApiParams.ID)
    @ApiResponse({
        status: 200,
        description: "Sport club profile active status toggled successfully",
        schema: {
            example: {
                id: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
                name: "Elite Sports Club",
                active: false, // Toggled from true to false
                createdAt: "2024-12-13T00:00:00.000Z",
                updatedAt: "2024-12-14T00:00:00.000Z",
            },
        },
    })
    async toggleActive(@Param("id") id: string, @Res() res: Response) {
        try {
            const result = await this.sportClubProfilesService.toggleActive(id);
            return res.status(200).json(result);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a sport club profile" })
    @ApiParam(ApiParams.ID)
    @ApiResponse(ApiResponseExamples.DELETED)
    async delete(@Param("id") id: string, @Res() res: Response) {
        try {
            await this.sportClubProfilesService.delete(id);
            return res.status(204).send();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }
}
