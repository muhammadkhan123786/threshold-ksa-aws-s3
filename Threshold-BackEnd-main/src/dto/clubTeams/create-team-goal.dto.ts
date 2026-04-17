import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsDateString,
    IsInt,
    Min,
    Max,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateTeamGoalDto {
    @ApiProperty({
        example: "Win 40 Matches",
        description: "Title of the main team goal",
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "Win at least 40 matches this year",
        description: "Detailed description of the goal",
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    description: string;

    @ApiProperty({
        example: 2025,
        description: "Year in which the goal is set",
    })
    @IsNumber()
    @IsInt()
    @Min(2020)
    @Max(2100)
    @Transform(({ value }) => Number(value))
    year: number;

    @ApiProperty({
        example: "2025-01-01",
        description: "Start date of the goal",
        type: "string",
        format: "date",
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        example: "2025-12-31",
        description: "End date of the goal",
        type: "string",
        format: "date",
    })
    @IsDateString()
    endDate: string;
}
