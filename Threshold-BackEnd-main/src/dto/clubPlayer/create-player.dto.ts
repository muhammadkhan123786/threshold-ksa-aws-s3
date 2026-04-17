import { Transform } from "class-transformer";
import {
    IsEnum,
    Matches,
    IsArray,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDate,
    Length,
    IsDecimal,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    Education,
    Gender,
    YesNo,
    Consideration,
    AvailabilityStatus,
    FoodAllergies,
} from "src/enums/athletes.enum";
import { SubscriptionPeriod } from "src/enums/subscription-period.enum";

export class CreatePlayerDto {
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "dateOfUpdating must be a valid date." })
    @ApiPropertyOptional({
        description: "The date of updating.",
        example: "2025-01-06T00:00:00Z",
    })
    dateOfUpdating?: Date;

    @ApiProperty({
        description: "URL of the coach's avatar.",
        example: "https://example.com/avatar.jpg",
        required: false,
    })
    @IsOptional()
    @IsString()
    avatar?: string;

    @IsNotEmpty()
    @ApiProperty({
        description:
            "Valid phone number starting with 05 followed by 8 digits.",
        required: true,
        example: "0512345678",
    })
    category?: string;

    @IsNotEmpty()
    @ApiProperty({
        description:
            "Valid phone number starting with 05 followed by 8 digits.",
        required: true,
        example: "0512345678",
    })
    position?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        description: "The nationality of the player.",
        example: "Saudi Arabia",
    })
    nationality?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "The education level of the player.",
        example: "test",
    })
    education?: string;

    @IsString()
    @ApiProperty({
        description: "The skill level of the player.",
        example: "Beginner",
    })
    clublevel?: string;

    @IsEnum(SubscriptionPeriod)
    @ApiProperty({ enum: SubscriptionPeriod, required: true })
    periodOfSubscription: SubscriptionPeriod;

    @IsEnum(Gender)
    @ApiProperty({
        enum: Gender,
        required: true,
        description: "The gender of the player.",
        example: Gender.MALE,
    })
    gender: Gender;

    @ApiProperty({
        description: "The weight of the athlete in kilograms",
        example: "70.5",
    })
    @IsDecimal()
    weight: string;

    @IsString()
    @IsNotEmpty({ message: "NIN is required." })
    @Length(10, 10, { message: "NIN must be exactly 10 characters long." })
    @Matches(/^(1|2)\d{9}$/, {
        message: "NIN must start with '1' or '2' followed by 9 digits.",
    })
    @ApiProperty({
        required: true,
        description: "The national ID number of the player.",
        example: "1234567890",
    })
    nin: string;

    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : value))
    @IsDate({ message: "ninExpirationDate must be a valid date." })
    @ApiPropertyOptional({
        description: "The expiration date of the player's national ID number.",
        example: "2026-01-01T00:00:00Z",
    })
    ninExpirationDate?: Date;

    @Transform(({ value }) => new Date(value))
    @IsNotEmpty({ message: "dateOfBirth is required." })
    @IsDate({ message: "dateOfBirth must be a valid date." })
    @ApiProperty({
        required: true,
        description: "The date of birth of the player.",
        example: "1995-05-26T00:00:00Z",
    })
    dateOfBirth: Date;

    @IsString()
    @IsNotEmpty({ message: "Last name is required." })
    @ApiProperty({
        required: true,
        description: "The last name of the player.",
        example: "Smith",
    })
    lastName: string;

    @IsString()
    @IsNotEmpty({ message: "First name is required." })
    @ApiProperty({
        required: true,
        description: "The first name of the player.",
        example: "John",
    })
    firstName: string;

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    @ApiPropertyOptional({
        description: "List of allergy details (optional).",
        nullable: true,
        default: [],
        example: ["Pollen", "Dust", "Peanuts"],
    })
    allergyDetails: string[];

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (typeof value === "string") {
            return value.split(",").map((item) => item.trim());
        }
        return Array.isArray(value) ? value : [];
    })
    @ApiProperty({
        description: "List of chronic conditions",
        type: [String],
        example: ["Asthma", "Diabetes"],
        default: [],
    })
    chronicConditions: string[];

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (typeof value === "string") {
            return value.split(",").map((item) => item.trim());
        }
        return Array.isArray(value) ? value : [];
    })
    @ApiPropertyOptional({
        description: "List of health factors or considerations (optional).",
        nullable: true,
        default: [],
        example: ["Wheelchair Access", "Special Diet"],
    })
    healthFactors: string[];

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "URL for food allergies documentation",
        example: "https://example.com/allergies.pdf",
    })
    foodAllergiesUrl?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "URL for consideration documentation",
        example: "https://example.com/consideration.pdf",
    })
    considerationUrl?: string;
}
