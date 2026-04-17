import {
    IsOptional,
    IsString,
    IsNumber,
    IsDate,
    Matches,
    IsEnum,
    IsUUID,
    IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "src/enums/athletes.enum";
import { Transform } from "class-transformer";

export class UpdatePersonalInformationDto {
    @ApiProperty({
        description: "The first name of the person.",
        example: "John",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "firstName must be a string" })
    firstName?: string;

    @ApiProperty({
        description: "The last name of the person.",
        example: "Doe",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "lastName must be a string" })
    lastName?: string;

    @ApiProperty({
        description: "The gender of the person.",
        enum: Gender,
        example: Gender.MALE,
        required: false,
    })
    @IsOptional()
    @IsEnum(Gender, { message: "gender must be either 'Male' or 'Female'" })
    gender?: Gender;

    @ApiProperty({
        description: "The birthday of the person.",
        example: "1990-01-01",
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "birthday must be a valid date" })
    birthday?: Date;

    @ApiProperty({
        description: "The nationality of the person.",
        example: "Saudi Arabia",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "nationality must be a string" })
    nationality?: string;

    @ApiProperty({
        description: "The experience of the person.",
        example: 5,
        required: false,
    })
    @IsOptional()
    @IsNumber({}, { message: "experience must be a number" })
    experience?: number;

    @ApiProperty({
        description: "Phone number starting with '05' followed by 8 digits.",
        example: "0512345678",
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: "Emergency contact number.",
        example: "0512345678",
        required: false,
    })
    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @ApiProperty({
        description: "The level of education.",
        example: "Bachelor's Degree",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "levelEducation must be a string" })
    levelEducation?: string;

    @ApiProperty({
        description: "The name of the school attended.",
        example: "Harvard University",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "schoolName must be a string" })
    schoolName?: string;

    @ApiProperty({
        description: "The date the person joined the organization.",
        example: "2023-01-01",
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "joinDate must be a valid date" })
    joinDate?: Date;

    @ApiProperty({
        description: "UUID of the team the person is playing for.",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: false,
    })
    @IsOptional()
    @IsUUID("4", {
        message: "The provided ID for playingFor must be a valid UUID.",
    })
    playingFor?: string;

    @ApiProperty({
        description: "Languages spoken by the person (اللغات التي يتحدثها الشخص).",
        example: ["English", "Arabic", "العربية", "الإنجليزية"],
        required: false,
    })
    @IsOptional()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    @IsArray({ message: "languages must be an array of strings" })
    @IsString({ each: true, message: "Each language must be a string" })
    languages?: string[];

    @ApiProperty({
        description: "The national ID number of the person.",
        example: "1234567890",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "nationalId must be a string" })
    nationalId?: string;

    @ApiProperty({
        description: "The expiration date of the national ID.",
        example: "2025-01-01",
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "nationalIdExpiration must be a valid date" })
    nationalIdExpiration?: Date;
}
