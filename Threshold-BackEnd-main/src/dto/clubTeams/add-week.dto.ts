import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDate, IsInt, Min, Max, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class AddWeekDto {
    @ApiProperty({
        example: "Week 1",
        description: "Title of the week",
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: 1,
        description: "Week number (1-4)",
    })
    @IsInt()
    @Min(1)
    @Max(4)
    weekNumber: number;

    @ApiProperty({
        example: "2023-01-01",
        description: "Start date of the week",
    })
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({
        example: "2023-01-07",
        description: "End date of the week",
    })
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @ApiProperty({
        example: "2000",
        description: "Volume targeted for the week",
    })
    @IsString()
    volumeTargeted: string;

    @ApiProperty({
        example: "meters",
        description: "Unit of the volume targeted",
    })
    @IsString()
    @IsOptional()
    volumeUnit: string;

    @ApiProperty({
        example: 5,
        description: "Total sessions planned for the week",
    })
    @IsInt()
    totalSessions: number;

    @ApiProperty({
        example: 3,
        description: "Sessions needed to achieve the weekly goal",
    })
    @IsInt()
    neededSessions: number;
}
