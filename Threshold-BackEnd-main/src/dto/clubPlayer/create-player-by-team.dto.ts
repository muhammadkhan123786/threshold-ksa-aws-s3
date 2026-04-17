import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsDate,
    IsNumber,
    Matches,
    Length,
    IsDecimal,
    IsArray,
} from "class-validator";
import {
    Gender,
    Nationality,
    Education,
    Relationship,
    SkillLevel,
    YesNo,
    Consideration,
    AvailabilityStatus,
    FoodAllergies,
} from "src/enums/athletes.enum";
import { SubscriptionPeriod } from "src/enums/subscription-period.enum";

export class CreatePlayerByTeamDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        description: "The relationship of the player to the account holder.",
        example: "Brother",
    })
    relationship?: string;

    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "joinDate must be a valid date." })
    @ApiPropertyOptional({
        description: "The join date of the player.",
        example: "2025-01-06T00:00:00Z",
    })
    joinDate?: Date;

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

    @ApiProperty({
        description: "Phone number",
        example: "0512345678",
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: "Emergency contact phone number",
        example: "0512345678",
        required: false,
    })
    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        description: "The nationality of the player.",
        example: "Saudi Arabia",
    })
    nationality?: string;

    @IsEnum(Education)
    @ApiProperty({
        enum: Education,
        required: true,
        description: "The education level of the player.",
        example: Education.GRADUATE,
    })
    education: Education;

    @ApiProperty({ example: "Professional", required: false })
    @IsString()
    @IsOptional()
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

    @IsOptional()
    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    @IsNumber({}, { message: "weight must be a number." })
    weight?: number;

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
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    @ApiPropertyOptional({
        description: "List of health factors or considerations (optional).",
        nullable: true,
        default: [],
        example: ["Wheelchair Access", "Special Diet"],
    })
    healthFactors: string[];

    @IsEnum(YesNo)
    @ApiProperty({
        enum: YesNo,
        required: true,
        description: "Whether the player has allergies",
        example: YesNo.NO,
    })
    allergies: YesNo;

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    @ApiProperty({
        description: "List of chronic conditions",
        type: [String],
        example: ["Asthma", "Diabetes"],
        default: [],
    })
    chronic: string[];

    @IsEnum(YesNo)
    @ApiProperty({
        enum: YesNo,
        required: true,
        description: "Whether the player has injuries",
        example: YesNo.NO,
    })
    injury: YesNo;

    @IsEnum(Consideration)
    @ApiProperty({
        enum: Consideration,
        required: true,
        description: "Special considerations for the player",
        example: Consideration.OTHER,
        enumName: "Consideration",
    })
    consideration: Consideration;

    @IsEnum(AvailabilityStatus)
    @ApiProperty({
        enum: AvailabilityStatus,
        required: true,
        description: "Availability status of the player",
        example: AvailabilityStatus.available,
        enumName: "AvailabilityStatus",
    })
    availabilityStatus: AvailabilityStatus;

    @IsEnum(FoodAllergies)
    @ApiProperty({
        enum: FoodAllergies,
        required: true,
        description: "Food allergies of the player",
        example: FoodAllergies.OTHER,
        enumName: "FoodAllergies",
    })
    foodAllergies: FoodAllergies;

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
