import { IsDate, IsDecimal, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AthleteBiometricStatus } from "src/enums/athletes.enum";
export class CreateAthleteBiometricDto {
    // --- Original fields ---
    @IsEnum(AthleteBiometricStatus)
    @ApiProperty({
        required: true,
        enum: AthleteBiometricStatus,
    })
    @ApiProperty({
        description: "Provide a valid status.",
        example: "Sample status",
        required: true,
    })
    status: AthleteBiometricStatus;

    @IsDecimal()
    @ApiProperty({
        required: true,
        description: "",
    })
    @ApiProperty({
        description: "Provide a valid bmi.",
        example: "Sample bmi",
        required: true,
    })
    bmi: string;

    @IsDecimal()
    @ApiProperty({
        required: true,
        description: "",
    })
    @ApiProperty({
        description: "Provide a valid bmiPercentile.",
        example: "Sample bmiPercentile",
        required: true,
    })
    bmiPercentile: string;

    @IsDecimal()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid weight.",
        example: "Sample weight",
        required: true,
    })
    weight: string;

    @IsDecimal()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid height.",
        example: "Sample height",
        required: true,
    })
    height: string;

    @IsDate()
    @ApiProperty({
        required: true,
        description: "",
        default: new Date().toLocaleDateString(),
        example: new Date().toLocaleDateString(),
    })
    @ApiProperty({
        description: "Provide a valid date.",
        example: "Sample date",
        required: true,
    })
    date: string;

    // --- Relational fields ---
    @ApiProperty({
        required: true,
        description: "enter the related athlete ID",
    })
    @ApiProperty({
        description: "Provide a valid athlete.",
        example: "Sample athlete",
        required: true,
    })
    athlete: string;
}
