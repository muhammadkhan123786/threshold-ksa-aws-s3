import {
    Controller,
    Post,
    Patch,
    Get,
    Param,
    Body,
    HttpStatus,
    UseGuards,
    Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { AthleteRecordService } from "./athleteRecord.service";
import { AthleteRecord } from "src/entities/athleteRecord.entity";
import { CreateAthleteRecordDto } from "src/dto/athleteRecord/create-athlete-record.dto";
import { UpdateAthleteRecordDto } from "src/dto/athleteRecord/update-athlete-record.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags("Athlete Records")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("athletes/:id/records")
export class AthleteRecordController {
    constructor(private readonly athleteRecordService: AthleteRecordService) {}

    @Post()
    @ApiOperation({ summary: "Create a new athlete record" })
    @ApiParam({
        name: "id",
        description:
            "The ID of the athlete for whom the record is being created",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Athlete record created successfully",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid input, record creation failed",
    })
    async createRecord(
        @Param("id") athleteId: string,
        @Body() createAthleteRecordDto: CreateAthleteRecordDto
    ): Promise<{ message: string; record: AthleteRecord }> {
        const record = await this.athleteRecordService.createRecord(
            athleteId,
            createAthleteRecordDto
        );
        return {
            message: "Athlete record created successfully",
            record,
        };
    }

    @Patch(":recordId")
    @ApiOperation({ summary: "Update an existing athlete record" })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete whose record is being updated",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiParam({
        name: "recordId",
        description: "The ID of the record to be updated",
        example: "789e1234-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Athlete record updated successfully",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Record not found or update failed",
    })
    async updateRecord(
        @Param("id") athleteId: string,
        @Param("recordId") recordId: string,
        @Body() updateAthleteRecordDto: UpdateAthleteRecordDto
    ): Promise<{ message: string; updatedRecord: AthleteRecord }> {
        const updatedRecord = await this.athleteRecordService.updateRecord(
            athleteId,
            recordId,
            updateAthleteRecordDto
        );
        return {
            message: "Athlete record updated successfully",
            updatedRecord,
        };
    }

    @Get()
    @ApiOperation({ summary: "Get all records for an athlete" })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete whose records are being retrieved",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Athlete records retrieved successfully",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Athlete not found or no records available",
    })
    async getRecordsByAthleteId(
        @Param("id") athleteId: string
    ): Promise<{ message: string; records: AthleteRecord[] }> {
        const records =
            await this.athleteRecordService.getRecordsByAthleteId(athleteId);
        return {
            message: "Athlete records retrieved successfully",
            records,
        };
    }

    @Delete(":recordId")
    @ApiOperation({ summary: "Soft delete an athlete record by ID" })
    @ApiParam({
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiParam({
        name: "recordId",
        description: "The ID of the record to be soft deleted",
        example: "789e1234-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Athlete record soft deleted successfully",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Record not found",
    })
    async softDeleteRecord(
        @Param("id") athleteId: string,
        @Param("recordId") recordId: string
    ): Promise<{ message: string }> {
        await this.athleteRecordService.softDeleteRecord(athleteId, recordId);
        return { message: "Athlete record soft deleted successfully" };
    }
}
