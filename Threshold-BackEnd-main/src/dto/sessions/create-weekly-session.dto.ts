import {
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsDateString,
    IsInt,
} from "class-validator";
import { Type } from "class-transformer";

class SessionDayDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;
}

export class CreateWeeklySessionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsInt()
    weekTarget: number;

    @IsDateString()
    @IsNotEmpty()
    weekDate: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SessionDayDto)
    sessionDays: SessionDayDto[];
}
