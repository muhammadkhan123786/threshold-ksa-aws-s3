import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsArray, IsOptional, IsNumber } from "class-validator";

export class PlayerFieldValueDto {
    @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440001" })
    @IsString()
    playerId: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    value: number;
}

export class PhaseTechniqueDto {
    @ApiProperty({ example: "Freestyle" })
    @IsString()
    name: string;

    @ApiProperty({ example: "400" })
    @IsString()
    value: string;

    @ApiProperty({ example: "meters" })
    @IsString()
    unit: string;

    @ApiProperty({ type: [PlayerFieldValueDto] })
    @IsArray()
    results: PlayerFieldValueDto[];
}

export class SessionPhaseDto {
    @ApiProperty({ example: "ph-1234" })
    @IsString()
    phaseId: string;

    @ApiProperty({ example: "Warm-up" })
    @IsString()
    phaseName: string;

    @ApiProperty({ example: 15, required: false })
    @IsNumber()
    @IsOptional()
    target?: number;

    @ApiProperty({ type: [PhaseTechniqueDto] })
    @IsArray()
    techniques: PhaseTechniqueDto[];
}

export class AthleteDto {
    @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440001" })
    @IsString()
    id: string;

    @ApiProperty({ example: "John Doe" })
    @IsString()
    name: string;

    @ApiProperty({ example: "Forward", required: false })
    @IsString()
    @IsOptional()
    position?: string;

    @ApiProperty({ example: "Advanced", required: false })
    @IsString()
    @IsOptional()
    level?: string;

    @ApiProperty({ example: 75.5, required: false })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiProperty({ example: "Professional", required: false })
    @IsString()
    @IsOptional()
    clublevel?: string;
}

export class GetSessionPhasesResponseDto {
    @ApiProperty({ type: [SessionPhaseDto] })
    @IsArray()
    phases: SessionPhaseDto[];

    @ApiProperty({ type: [AthleteDto], description: "List of team athletes" })
    @IsArray()
    players: AthleteDto[];
}
