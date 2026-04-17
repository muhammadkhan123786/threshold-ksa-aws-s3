import {
    Controller,
    Post,
    Patch,
    Get,
    Param,
    Body,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiParam,
} from "@nestjs/swagger";
import { CreateHealthRecordDto } from "src/dto/athleteHealth/create-health-record.dto";
import { AthleteHealthService } from "./athleteHealth.service";
import { UpdateHealthRecordDto } from "src/dto/athleteHealth/update-health-record.dto";
import { UpdateMedicalInfoDto } from "src/dto/athleteHealth/update-medical-Info.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Consideration, FoodAllergies, YesNo } from "src/enums/athletes.enum";

@ApiTags("Athlete Health")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("athletes/:id/health")
export class AthleteHealthController {
    constructor(private readonly athleteHealthService: AthleteHealthService) {}

    // Health Records Management

    @Post("records")
    @ApiOperation({
        summary: "Create a new health record for an athlete",
        description:
            "Create a health record associated with a specific athlete.",
    })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiBody({
        description: "Data for the new health record",
        type: CreateHealthRecordDto,
    })
    @ApiResponse({
        status: 201,
        description: "Health record created successfully",
        schema: {
            example: {
                message: "Health record created successfully",
                athlete: [
                    {
                        id: "223e4567-e89b-12d3-a456-426614174000",
                        type: "Injury",
                        description: "Sprained ankle during training.",
                        startDate: "2024-08-01",
                        endDate: "2024-08-10",
                        medicalRecommendation: "Rest for two weeks.",
                        dateOfUpdating: "2024-08-10T12:34:56.789Z",
                    },
                ],
            },
        },
    })
    async createHealthRecord(
        @Param("id") athleteId: string,
        @Body() createHealthRecordDto: CreateHealthRecordDto
    ) {
        const athlete = await this.athleteHealthService.createHealthRecord(
            athleteId,
            createHealthRecordDto
        );
        return {
            message: "Health record created successfully",
            athlete,
        };
    }

    @Patch("records/:recordId")
    @ApiOperation({
        summary: "Update an existing health record",
        description:
            "Update the details of a specific health record for an athlete.",
    })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiParam({
        name: "recordId",
        description: "The ID of the health record to be updated",
        example: "223e4567-e89b-12d3-a456-426614174000",
    })
    @ApiBody({
        description: "Updated data for the health record",
        type: UpdateHealthRecordDto,
    })
    @ApiResponse({
        status: 200,
        description: "Health record updated successfully",
        schema: {
            example: {
                message: "Health record updated successfully",
                athlete: {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    healthRecords: [
                        {
                            id: "223e4567-e89b-12d3-a456-426614174000",
                            type: "Injury",
                            description: "Updated description",
                            startDate: "2024-08-01",
                            endDate: "2024-08-10",
                            medicalRecommendation: "Updated recommendation",
                            dateOfUpdating: "2024-08-11T12:34:56.789Z",
                        },
                    ],
                },
            },
        },
    })
    async updateHealthRecord(
        @Param("id") athleteId: string,
        @Param("recordId") recordId: string,
        @Body() updateHealthRecordDto: UpdateHealthRecordDto
    ) {
        const athlete = await this.athleteHealthService.updateHealthRecord(
            athleteId,
            recordId,
            updateHealthRecordDto
        );
        return {
            message: "Health record updated successfully",
            athlete,
        };
    }

    @Get("records")
    @ApiOperation({
        summary: "Get all health records for an athlete",
        description:
            "Retrieve all health records associated with a specific athlete.",
    })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 200,
        description: "Health records retrieved successfully",
        schema: {
            example: {
                message: "Health records retrieved successfully",
                records: [
                    {
                        id: "223e4567-e89b-12d3-a456-426614174000",
                        type: "Injury",
                        description: "Sprained ankle during training.",
                        startDate: "2024-08-01",
                        endDate: "2024-08-10",
                        medicalRecommendation: "Rest for two weeks.",
                        dateOfUpdating: "2024-08-10T12:34:56.789Z",
                    },
                    {
                        id: "323e4567-e89b-12d3-a456-426614174000",
                        type: "Surgery",
                        description: "Knee surgery recovery.",
                        startDate: "2024-01-01",
                        endDate: "2024-02-15",
                        medicalRecommendation:
                            "Physical therapy for six weeks.",
                        dateOfUpdating: "2024-02-15T12:34:56.789Z",
                    },
                ],
            },
        },
    })
    async getHealthRecords(@Param("id") athleteId: string) {
        const records =
            await this.athleteHealthService.getHealthRecords(athleteId);
        return {
            message: "Health records retrieved successfully",
            records,
        };
    }

    // Medical Information Management

    @Patch("medical-info")
    @UseInterceptors(AnyFilesInterceptor())
    @ApiOperation({
        summary: "Update medical information for an athlete",
        description:
            "Update the medical information, including food allergies and considerations, for a specific athlete.",
    })
    @ApiConsumes("multipart/form-data")
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiBody({
        description: "Updated medical information",
        schema: {
            type: "object",
            properties: {
                allergies: {
                    type: "string",
                    description:
                        "Indicates whether the athlete has allergies (Yes/No).",
                    enum: Object.values(YesNo),
                    example: YesNo.YES,
                },
                chronicDisease: {
                    type: "string",
                    description:
                        "Indicates whether the athlete has chronic diseases (Yes/No).",
                    enum: Object.values(YesNo),
                    example: YesNo.NO,
                },
                foodAllergies: {
                    type: "string",
                    description: "Details of the athlete's food allergies.",
                    enum: Object.values(FoodAllergies),
                    example: FoodAllergies.PEANUTS,
                },
                consideration: {
                    type: "string",
                    description:
                        "Specific considerations related to the athlete's condition.",
                    enum: Object.values(Consideration),
                    example: Consideration.AUTISTIC,
                },
                foodAllergiesFile: {
                    type: "string",
                    format: "binary",
                    description: "Upload a file related to food allergies.",
                },
                currentConsiderationFile: {
                    type: "string",
                    format: "binary",
                    description:
                        "Upload a file related to current considerations.",
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Medical information updated successfully",
    })
    async updateMedicalInfo(
        @Param("id") athleteId: string,
        @Body() updateMedicalInfoDto: UpdateMedicalInfoDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        // Separate the files based on their field name
        const foodAllergiesFile = files.find(
            (file) => file.fieldname === "foodAllergiesFile"
        );
        const currentConsiderationFile = files.find(
            (file) => file.fieldname === "currentConsiderationFile"
        );

        const athlete = await this.athleteHealthService.updateMedicalInfo(
            athleteId,
            updateMedicalInfoDto,
            foodAllergiesFile,
            currentConsiderationFile
        );
        return {
            message: "Medical information updated successfully",
            athlete,
        };
    }

    @Get("medical-info")
    @ApiOperation({
        summary: "Get medical information for an athlete",
        description:
            "Retrieve the medical information, including food allergies and considerations, for a specific athlete.",
    })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 200,
        description: "Medical information retrieved successfully",
        schema: {
            example: {
                message: "Medical information retrieved successfully",
                medicalInfo: {
                    allergies: "Pollen",
                    chronicDisease: "Asthma",
                    foodAllergies: "Peanuts",
                    foodAllergiesUrl:
                        "https://s3.com/bucketname/athleteId/foodAllergies.pdf",
                    currentConsideration:
                        "Avoid intense exercise during cold weather.",
                    currentConsiderationUrl:
                        "https://s3.com/bucketname/athleteId/currentConsideration.pdf",
                },
            },
        },
    })
    async getMedicalInfo(@Param("id") athleteId: string) {
        const medicalInfo =
            await this.athleteHealthService.getMedicalInfo(athleteId);
        return {
            message: "Medical information retrieved successfully",
            medicalInfo,
        };
    }
}
