import { ApiProperty } from "@nestjs/swagger";
import {
    BMICategory,
    HealthRisk,
} from "src/entities/clubPlayerBiometric.entity";

export class ClubPlayerBiometricDto {
    @ApiProperty({
        description: "The date of the biometric measurement",
        example: "2024-01-01",
    })
    date: Date;

    @ApiProperty({
        description:
            "Body Mass Index (BMI) calculated as weight(kg)/height²(m)",
        example: "22.5",
        minimum: 0,
    })
    bmi: string;

    @ApiProperty({
        description: "Weight in kilograms",
        example: "75.5",
        minimum: 0,
    })
    weight: string;

    @ApiProperty({
        description: "Height in meters",
        example: "1.82",
        minimum: 0,
    })
    height: string;

    @ApiProperty({
        description: "BMI category based on age-specific percentiles",
        enum: BMICategory,
        example: BMICategory.NORMAL,
        enumName: "BMICategory",
    })
    bmiCategory: BMICategory;

    @ApiProperty({
        description: "Health risk assessment based on BMI category",
        enum: HealthRisk,
        example: HealthRisk.HEALTHY_FITNESS,
        enumName: "HealthRisk",
    })
    healthRisk: HealthRisk;

    @ApiProperty({
        description: "Minimum healthy weight based on height and age (kg)",
        example: "65.5",
        minimum: 0,
    })
    idealWeightMin: string;

    @ApiProperty({
        description: "Maximum healthy weight based on height and age (kg)",
        example: "80.2",
        minimum: 0,
    })
    idealWeightMax: string;

    @ApiProperty({
        description: "Weight that needs to be lost to reach healthy range (kg)",
        example: "5.3",
        required: false,
        nullable: true,
        minimum: 0,
    })
    weightToLose?: string;

    @ApiProperty({
        description:
            "Weight that needs to be gained to reach healthy range (kg)",
        example: "3.2",
        required: false,
        nullable: true,
        minimum: 0,
    })
    weightToGain?: string;

    @ApiProperty({
        description: "BMI percentile relative to age and gender",
        example: "75.5",
        minimum: 0,
        maximum: 100,
    })
    bmiPercentile: string;

    @ApiProperty({
        description: "3rd percentile BMI threshold",
        example: "16.5",
        required: false,
        nullable: true,
    })
    p3?: string;

    @ApiProperty({
        description: "15th percentile BMI threshold",
        example: "17.5",
        required: false,
        nullable: true,
    })
    p15?: string;

    @ApiProperty({
        description: "85th percentile BMI threshold",
        example: "23.5",
        required: false,
        nullable: true,
    })
    p85?: string;

    @ApiProperty({
        description: "97th percentile BMI threshold",
        example: "25.5",
        required: false,
        nullable: true,
    })
    p97?: string;

    @ApiProperty({
        description: "Additional observations or recommendations",
        example: "Good progress in maintaining healthy weight range",
        required: false,
        nullable: true,
    })
    notes?: string;
}
