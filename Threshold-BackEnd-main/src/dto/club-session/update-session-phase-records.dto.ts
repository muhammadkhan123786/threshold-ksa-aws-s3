import {
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class TechniqueRecordDto {
    @IsString()
    techniqueId: string;

    @IsString()
    playerId: string;

    @IsNumber()
    value: number;
}

export class PhaseRecordDto {
    @IsString()
    phaseId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechniqueRecordDto)
    records: TechniqueRecordDto[];
}

export class UpdateSessionPhaseRecordsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhaseRecordDto)
    phaseRecords: PhaseRecordDto[];
}
