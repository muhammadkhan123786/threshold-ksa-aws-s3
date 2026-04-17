import {
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class SessionFieldDto {
    @IsString()
    name: string;

    @IsString()
    value: string;

    @IsString()
    unit: string;
}

export class TechniqueResultDto {
    @IsString()
    playerId: string;

    @IsNumber()
    value: number;
}

export class SessionTechniqueDto {
    @IsString()
    name: string;

    @IsString()
    value: string;

    @IsString()
    unit: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechniqueResultDto)
    results: TechniqueResultDto[];
}

export class SessionPhaseResultDto {
    @IsString()
    phaseId: string;

    @IsString()
    phaseName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SessionTechniqueDto)
    techniques: SessionTechniqueDto[];

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
    @Type(() => SessionPhaseResultDto)
    phaseResults: SessionPhaseResultDto[];
}
