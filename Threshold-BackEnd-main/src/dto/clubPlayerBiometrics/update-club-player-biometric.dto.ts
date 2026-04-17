import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class UpdateClubPlayerBiometricDto {
    @ApiProperty({
        description: "Date of the biometric measurement",
        example: "2024-03-20T10:00:00.000Z",
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;

    @ApiProperty({
        description: "Player's weight in kilograms (kg)",
        example: 75.5,
        minimum: 20,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(20)
    weight?: number;

    @ApiProperty({
        description: "Player's height in centimeters (cm)",
        example: 180,
        minimum: 100,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(100)
    height?: number;

    @ApiProperty({
        description:
            "Additional notes or observations about the biometric measurement",
        example: "Player reported feeling well. Normal hydration levels.",
        required: false,
    })
    @IsOptional()
    @IsString()
    notes?: string;
}
