import { IsDateString, IsDecimal } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AthleteBiometricDto {
    @ApiProperty({
        description: "The date when the biometric data was recorded",
        example: "2024-01-15T00:00:00.000Z",
    })
    @IsDateString()
    date: string;

    @ApiProperty({
        description: "The BMI value of the athlete",
        example: "22.5",
    })
    @IsDecimal()
    bmi: string;

    @ApiProperty({
        description: "The weight of the athlete in kilograms",
        example: "70.5",
    })
    @IsDecimal()
    weight: string;

    @ApiProperty({
        description: "The height of the athlete in centimeters",
        example: "175.0",
    })
    @IsDecimal()
    height: string;
}
