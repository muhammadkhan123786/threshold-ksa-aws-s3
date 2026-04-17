import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateHealthRecordDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "The updated type of the health record.",
        example: "Surgery",
        required: false,
    })
    type?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "The updated description of the health record.",
        example: "Knee surgery recovery.",
        required: false,
    })
    description?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: "The updated start date of the health issue.",
        example: "2024-01-01",
        required: false,
    })
    startDate?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: "The updated end date of the health issue, if applicable.",
        example: "2024-02-15",
        required: false,
    })
    endDate?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "The updated medical recommendations related to the health record.",
        example: "Physical therapy for six weeks.",
        required: false,
    })
    medicalRecommendation?: string;
}
