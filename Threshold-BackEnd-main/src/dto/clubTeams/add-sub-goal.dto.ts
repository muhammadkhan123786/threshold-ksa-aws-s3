import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsInt,
    Min,
    Max,
    IsOptional,
    IsDate,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { AddWeekDto } from "./add-week.dto";

export class AddSubGoalDto {
    @ApiProperty({
        example: "Achieve 10 wins in January",
        description: "Sub-goal title",
        required: false,
    })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({
        example: 1,
        description: "Month number (1-12)",
        required: false,
    })
    @IsNumber()
    @IsInt()
    @Min(1)
    @Max(12)
    @Transform(({ value }) => Number(value))
    @IsOptional()
    monthNumber: number;

    @ApiProperty({
        example: "100 counts",
        description: "Volume targeted for this sub-goal",
        required: false,
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    volumeTargeted: string;

    @ApiProperty({
        example: "2023-01-01",
        description: "Start date of the sub-goal",
        required: false,
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    startDate: Date;

    @ApiProperty({
        example: "2023-01-31",
        description: "End date of the sub-goal",
        required: false,
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate: Date;

    @ApiProperty({
        type: [AddWeekDto],
        description: "Weeks associated with the sub-goal",
        required: false,
    })
    @Type(() => AddWeekDto)
    @IsOptional()
    weeks: AddWeekDto[];
}
