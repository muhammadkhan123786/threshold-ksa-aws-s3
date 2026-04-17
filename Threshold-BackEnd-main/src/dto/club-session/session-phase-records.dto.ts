import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class TechniqueResultDto {
    @ApiProperty({ description: "Unique identifier of the player" })
    @IsString()
    playerId: string;

    @ApiProperty({ description: "Value recorded for this technique" })
    @IsNumber()
    value: number;
}

export class TechniqueDto {
    @ApiProperty({ description: "Unique identifier of the technique" })
    @IsString()
    id: string;

    @ApiProperty({ description: "Name of the technique" })
    @IsString()
    name: string;

    @ApiProperty({ description: "Target value for the technique" })
    @IsString()
    value: string;

    @ApiProperty({ description: "Unit of measurement" })
    @IsString()
    unit: string;

    @ApiProperty({ description: "Results for this technique" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechniqueResultDto)
    results: TechniqueResultDto[];
}

export class AthleteRecordDto {
    @ApiProperty({ description: "Unique identifier of the athlete" })
    @IsString()
    athleteId: string;

    @ApiProperty({ description: "Full name of the athlete" })
    @IsString()
    athleteName: string;

    @ApiProperty({ description: "Position of the athlete" })
    @IsString()
    position: string;

    @ApiProperty({ description: "Measurements recorded for this athlete" })
    @IsOptional()
    measurements: Record<string, number>;
}

export class PhaseRecordResponseDto {
    @ApiProperty({ description: "Unique identifier of the phase" })
    @IsString()
    phaseId: string;

    @ApiProperty({ description: "Name of the phase" })
    @IsString()
    phaseName: string;

    @ApiProperty({ description: "List of techniques in this phase" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechniqueDto)
    techniques: TechniqueDto[];
}

export class SessionPhaseRecordsResponseDto {
    @ApiProperty({ description: "Unique identifier of the session" })
    @IsString()
    sessionId: string;

    @ApiProperty({ description: "Title of the session" })
    @IsString()
    sessionTitle: string;

    @ApiProperty({ description: "Sport profile identifier" })
    @IsString()
    sportId: string;

    @ApiProperty({ description: "Records for each phase in the session" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhaseRecordResponseDto)
    phaseRecords: PhaseRecordResponseDto[];
}
