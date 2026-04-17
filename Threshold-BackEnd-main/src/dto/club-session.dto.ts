import {
    IsString,
    IsUUID,
    IsDate,
    IsOptional,
    IsArray,
    IsNumber,
    MinLength,
    MaxLength,
    Min,
    Max,
    IsEnum,
    ValidateNested,
    ArrayMinSize,
    IsNotEmpty,
    Matches,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ClubSessionStatus } from "../entities/clubSession.entity";
import { ApiProperty } from "@nestjs/swagger";

export class FieldDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string;

    @IsString()
    @IsNotEmpty()
    unit: string;
}

export class TechniqueDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string;

    @IsString()
    @IsNotEmpty()
    unit: string;
}

export class PhaseResultTechniqueDto {
    @IsString()
    techniqueId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsArray()
    results: {
        playerId: string;
        value: number;
    }[];
}

class PhaseResultValueDto {
    @IsString()
    @IsNotEmpty()
    playerId: string;

    @IsNumber()
    @Min(0)
    value: number;
}

export class CreateClubSessionDto {
    @ApiProperty({
        description: "Team identifier",
        example: "team-550e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    @IsOptional()
    teamId?: string;

    @ApiProperty({
        description: "Mission associated with this session",
        example: "Mission 1: Speed Development",
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(200, { message: "Mission name cannot exceed 200 characters" })
    missionAssociated?: string;

    @ApiProperty({
        description: "Volume targeted for this session",
        example: 10000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    volumeTargeted?: number;

    @ApiProperty({
        description: "Session type template identifier",
        example: "template-123",
    })
    @IsString()
    @IsNotEmpty({ message: "Template ID is required" })
    @IsUUID(undefined, { message: "Invalid template ID format" })
    templateId: string;

    @ApiProperty({
        description: "Title of the session",
        example: "Speed Training Session #1",
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty({ message: "Session title is required" })
    @MinLength(3, { message: "Title must be at least 3 characters long" })
    @MaxLength(100, { message: "Title cannot exceed 100 characters" })
    title: string;

    @ApiProperty({
        description: "List of spaces/venues where the session will be held",
        example: ["Main Training Ground", "Secondary Field", "Indoor Gym"],
        type: [String],
        isArray: true,
        minItems: 1,
        maxItems: 10,
        examples: {
            single: {
                value: ["Main Training Ground"],
                description: "Single venue",
            },
            multiple: {
                value: [
                    "Main Training Ground",
                    "Secondary Field",
                    "Indoor Gym",
                ],
                description: "Multiple venues",
            },
        },
    })
    @IsArray({ message: "Spaces must be an array" })
    @IsString({ each: true, message: "Each space must be a string" })
    @IsNotEmpty({ each: true, message: "Each space name is required" })
    @MaxLength(200, {
        each: true,
        message: "Space names cannot exceed 200 characters",
    })
    @ArrayMinSize(1, { message: "At least one space must be specified" })
    spaces: string[];

    @ApiProperty({
        description: "Average perceived exertion (scale 1-10)",
        example: 7.5,
        minimum: 0,
        maximum: 10,
    })
    @IsNumber()
    @Min(0)
    @Max(10)
    @Transform(({ value }) => Number(value))
    averagePE: number;

    @ApiProperty({
        description: "Date of the session",
        example: "2024-03-15",
    })
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    day: Date;

    @ApiProperty({
        description: "Start time of the session",
        example: "11:00 am",
    })
    @IsString()
    @IsNotEmpty({ message: "Start time is required" })
    @Matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(am|pm)$/i, {
        message: "Start time must be in 12-hour format (e.g., 11:00 am)",
    })
    startTime: string;

    @ApiProperty({
        description: "End time of the session",
        example: "01:30 pm",
    })
    @IsString()
    @IsNotEmpty({ message: "End time is required" })
    @Matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(am|pm)$/i, {
        message: "End time must be in 12-hour format (e.g., 1:30 pm)",
    })
    endTime: string;

    @ApiProperty({
        description: "Additional notes about the session",
        example: "Focus on technique and form",
        maxLength: 1000,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(1000, { message: "Notes cannot exceed 1000 characters" })
    notes?: string;

    @ApiProperty({
        description: "Positions invited to this session",
        example: ["Forward", "Midfielder"],
        required: false,
        type: [String],
    })
    @IsArray()
    @IsString({ each: true, message: "Each position must be a string" })
    @IsOptional()
    @ArrayMinSize(1, {
        message:
            "At least one position must be selected when positions are specified",
    })
    invitedPositions?: string[];
}

export class UpdateClubSessionDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsOptional()
    title?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    startTime?: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endTime?: Date;

    @ApiProperty({
        description: "List of spaces/venues where the session will be held",
        example: ["Main Training Ground", "Secondary Field"],
        type: [String],
        isArray: true,
        required: false,
        examples: {
            single: {
                value: ["Main Training Ground"],
                description: "Single venue",
            },
            multiple: {
                value: [
                    "Main Training Ground",
                    "Secondary Field",
                ],
                description: "Multiple venues",
            },
        },
    })
    @IsArray({ message: "Spaces must be an array" })
    @IsString({ each: true, message: "Each space must be a string" })
    @IsNotEmpty({ each: true, message: "Each space name is required" })
    @MaxLength(200, {
        each: true,
        message: "Space names cannot exceed 200 characters",
    })
    @IsOptional()
    spaces?: string[];

    @IsEnum(ClubSessionStatus)
    @IsOptional()
    status?: ClubSessionStatus;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    invitedPositions?: string[];

    @IsString()
    @MaxLength(1000)
    @IsOptional()
    notes?: string;

    @ValidateNested({ each: true })
    @Type(() => PhaseResultTechniqueDto)
    @IsOptional()
    phaseResults?: {
        phaseId: string;
        techniques: PhaseResultTechniqueDto[];
    }[];

    @ApiProperty({
        description: "Volume targeted for this session",
        example: 10000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    volumeTargeted?: number;

    @ApiProperty({
        description: "Average perceived exertion (scale 1-10)",
        example: 7.5,
        minimum: 0,
        maximum: 10,
    })
    @IsNumber()
    @Min(0)
    @Max(10)
    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    averagePE?: number;
}

export class PhaseResultDto {
    @IsString()
    phaseId: string;

    @IsString()
    phaseName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechniqueDto)
    techniques: {
        name: string;
        value: string;
        unit: string;
        results: {
            playerId: string;
            value: number;
        }[];
    }[];

    @IsArray()
    @ValidateNested({ each: true })
    athleteRecords: {
        athleteId: string;
        athleteName: string;
        measurements: Record<string, number>;
    }[];
}

export class UpdateSessionResultsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhaseResultDto)
    phaseResults: PhaseResultDto[];
}
