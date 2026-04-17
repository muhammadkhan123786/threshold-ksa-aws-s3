import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsString, IsOptional, IsDate } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateMedicalInformationDto {
    @ApiPropertyOptional({
        description: "List of allergy details (optional).",
        nullable: true,
        default: [],
        example: ["Pollen", "Dust", "Peanuts"],
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    allergyDetails?: string[];

    @ApiPropertyOptional({
        description: "List of chronic conditions (optional).",
        nullable: true,
        default: [],
        example: ["Diabetes", "Hypertension"],
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    chronicConditions?: string[];

    @ApiPropertyOptional({
        description: "List of health considerations (optional).",
        nullable: true,
        default: [],
        example: ["Wheelchair Access", "Special Diet"],
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    healthConsiderations?: string[];

    @ApiPropertyOptional({
        description: "Last updated date for the medical information.",
        nullable: true,
        example: "2025-01-01",
    })
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    lastUpdatedDate?: Date;
}
