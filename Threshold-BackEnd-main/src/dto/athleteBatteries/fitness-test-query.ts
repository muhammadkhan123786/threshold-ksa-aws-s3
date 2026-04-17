import { IsEnum, IsOptional, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IntervalEnum, TestTypeEnum } from "src/enums/athletes.enum";

export class FitnessTestQueryDto {
    @ApiPropertyOptional({
        description:
            "The type of fitness test (e.g., push, curl, trunk, sit, pacer, or 'all' for all types)",
        example: TestTypeEnum.ALL,
        enum: TestTypeEnum,
    })
    @IsEnum(TestTypeEnum)
    @IsOptional()
    testType?: TestTypeEnum;

    @ApiPropertyOptional({
        description:
            "The start date for the data retrieval period (ISO 8601 format)",
        example: "2024-01-01T00:00:00.000Z",
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({
        description:
            "The end date for the data retrieval period (ISO 8601 format)",
        example: "2024-12-01T00:00:00.000Z",
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({
        description:
            "The interval for grouping data (e.g., '15 days', '1 month', or '1 day' for daily)",
        example: IntervalEnum.DAILY,
        enum: IntervalEnum,
    })
    @IsEnum(IntervalEnum)
    @IsOptional()
    interval?: IntervalEnum;
}
