import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDate,
    IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { WorkType } from "src/entities/workHistory.entity";

export class CreateWorkHistoryDto {
    @ApiProperty({
        description: "Company name",
        example: "Sports Academy Barcelona",
    })
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({
        description: "Position held",
        example: "Head Coach",
    })
    @IsString()
    @IsNotEmpty()
    position: string;

    @ApiProperty({
        description: "Description of role and job",
        example: "Managed youth development program for ages 10-16",
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: "Start date of employment",
        example: "2018-01-01",
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        description: "End date of employment (if applicable)",
        example: "2020-12-31",
        required: false,
    })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    endDate?: Date;

    @ApiProperty({
        description: "Location of employment",
        example: "Barcelona, Spain",
        required: false,
    })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty({
        description: "Type of employment",
        enum: WorkType,
        example: WorkType.FULL_TIME,
    })
    @IsEnum(WorkType)
    @IsNotEmpty()
    workType: WorkType;

    @ApiProperty({
        description: "Key responsibilities at this position",
        example: "Training sessions, tactical planning, player development",
        required: false,
    })
    @IsString()
    @IsOptional()
    responsibilities?: string;

    @ApiProperty({
        description: "Notable achievements during employment",
        example:
            "Won regional championship in 2019, improved team performance by 35%",
        required: false,
    })
    @IsString()
    @IsOptional()
    achievements?: string;
}

export class UpdateWorkHistoryDto {
    @ApiProperty({
        description: "Company name",
        example: "Sports Academy Barcelona",
        required: false,
    })
    @IsString()
    @IsOptional()
    companyName?: string;

    @ApiProperty({
        description: "Position held",
        example: "Head Coach",
        required: false,
    })
    @IsString()
    @IsOptional()
    position?: string;

    @ApiProperty({
        description: "Description of role and job",
        example: "Managed youth development program for ages 10-16",
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: "Start date of employment",
        example: "2018-01-01",
        required: false,
    })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    startDate?: Date;

    @ApiProperty({
        description: "End date of employment (if applicable)",
        example: "2020-12-31",
        required: false,
    })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    endDate?: Date;

    @ApiProperty({
        description: "Location of employment",
        example: "Barcelona, Spain",
        required: false,
    })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty({
        description: "Type of employment",
        enum: WorkType,
        example: WorkType.FULL_TIME,
        required: false,
    })
    @IsEnum(WorkType)
    @IsOptional()
    workType?: WorkType;

    @ApiProperty({
        description: "Key responsibilities at this position",
        example: "Training sessions, tactical planning, player development",
        required: false,
    })
    @IsString()
    @IsOptional()
    responsibilities?: string;

    @ApiProperty({
        description: "Notable achievements during employment",
        example:
            "Won regional championship in 2019, improved team performance by 35%",
        required: false,
    })
    @IsString()
    @IsOptional()
    achievements?: string;
}

export class GetWorkHistoryQueryDto {
    @ApiProperty({
        description: "Page number for pagination",
        default: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @ApiProperty({
        description: "Number of items per page",
        default: 10,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;
}
