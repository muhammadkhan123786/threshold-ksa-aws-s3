import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsString,
    IsOptional,
    IsEnum,
    IsDate,
    IsNumber,
} from "class-validator";
import {
    Gender,
    Nationality,
    Education,
    AthleteLevel,
} from "src/enums/athletes.enum";

export class UpdatePersonalInfoDto {
    @IsString()
    @ApiProperty({
        description: "The first name of the athlete.",
        example: "John",
        required: true,
    })
    firstName: string;

    @IsString()
    @ApiProperty({
        description: "The last name of the athlete.",
        example: "Doe",
        required: true,
    })
    lastName: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @ApiPropertyOptional({
        description: "The date the athlete joined.",
        example: "2024-01-01T00:00:00Z",
    })
    joinDate?: Date;

    @ApiProperty({
        description: "The level of the athlete.",
        enum: AthleteLevel,
        example: AthleteLevel.SHABAB,
    })
    @IsOptional()
    @IsEnum(AthleteLevel)
    level?: AthleteLevel;

    @ApiProperty({
        description: "The educational level of the athlete.",
        enum: Education,
        example: Education.PRIMARY,
    })
    @IsOptional()
    @IsEnum(Education)
    education?: Education;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "The name of the school the athlete attended.",
        example: "Springfield High School",
    })
    schoolName?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @ApiPropertyOptional({
        description: "The athlete's date of birth.",
        example: "2000-05-15T00:00:00Z",
    })
    dateOfBirth?: Date;

    @IsOptional()
    @IsEnum(Gender)
    @ApiPropertyOptional({
        description: "The gender of the athlete.",
        example: Gender.MALE,
    })
    gender?: Gender;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "The nationality of the athlete.",
        example: "Saudi Arabia",
    })
    nationality?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "The national identification number of the athlete.",
        example: "1234567890",
    })
    nin?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @ApiPropertyOptional({
        description:
            "The expiration date of the athlete's national identification number (NIN).",
        example: "2026-01-01T00:00:00Z",
    })
    ninExpirationDate?: Date;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value ? Number(value) : undefined))
    @ApiPropertyOptional({
        description: "The weight of the athlete in kilograms.",
        example: 70.5,
    })
    weight?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value ? Number(value) : undefined))
    @ApiPropertyOptional({
        description: "The height of the athlete in centimeters.",
        example: 175.0,
    })
    height?: number;
}
