import {
    IsString,
    IsArray,
    IsOptional,
    IsInt,
    IsDateString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class SessionDayDto {
    @IsDateString()
    @IsOptional()
    date?: string;
}

export class UpdateWeeklySessionDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsOptional()
    weekTarget?: number;
    
    @IsDateString()
    @IsOptional()
    weekDate?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    @Type(() => SessionDayDto)
    sessionsDays?: SessionDayDto[];
}
