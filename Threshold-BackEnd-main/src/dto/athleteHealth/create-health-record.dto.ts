import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsString } from "class-validator";
import { SessionRecordStatus } from "src/enums/athletes.enum";

export class CreateHealthRecordDto {
    @IsEnum(SessionRecordStatus)
    @ApiProperty({
        description: "The status type of the health record.",
        example: SessionRecordStatus.INJURY,
        enum: SessionRecordStatus,
        required: true,
    })
    type: SessionRecordStatus;

    @IsString()
    @ApiProperty({
        description: "A brief description of the health record.",
        example: "Sprained ankle during training.",
        required: true,
    })
    description: string;

    @IsDateString()
    @ApiProperty({
        description: "The start date of the health issue.",
        example: "2024-08-01",
        required: true,
    })
    startDate: string;

    @IsDateString()
    @ApiProperty({
        description: "The end date of the health issue, if applicable.",
        example: "2024-08-10",
        required: false,
    })
    endDate?: string;

    @IsString()
    @ApiProperty({
        description: "Medical recommendations related to the health record.",
        example: "Rest for two weeks and avoid physical activity.",
        required: true,
    })
    medicalRecommendation: string;
}
