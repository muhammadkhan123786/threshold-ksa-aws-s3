import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsDate,
    IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Gender, Nationality, Relationship } from "src/enums/athletes.enum";
import { Branch } from "src/entities/branch.entity";
import { Transform } from "class-transformer";
import { UserRole } from "src/enums/users.enum";
import { ClubCoachRole } from "src/enums/coach-type.enum";

export class CreateClubCoachDto {
    @ApiProperty({
        description: "URL of the coach's avatar.",
        example: "https://example.com/avatar.jpg",
        required: false,
    })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({
        description: "Years of coaching experience (must be an integer).",
        example: 5,
        required: true,
    })
    @Transform(({ value }) => (value ? Number(value) : undefined))
    @IsInt({ message: "experience must be an integer number" })
    @IsNotEmpty()
    experience: number;

    @ApiProperty({
        description: "Coach's date of birth (must be a Date instance).",
        example: "1990-01-01",
        required: true,
    })
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "joinDate must be a valid date." })
    @IsNotEmpty()
    birthday: Date;

    @ApiProperty({
        description: "Phone number starting with '05' followed by 8 digits.",
        example: "0512345678",
        required: true,
    })
    @IsString()
    phone: string;

    @ApiProperty({
        description: "Emergency contact number.",
        example: "0512345678",
        required: false,
    })
    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @ApiProperty({
        description: "Nationality of the coach.",
        example: "Saudi Arabia",
        required: false,
    })
    @IsString()
    @IsOptional()
    nationality?: string;

    @ApiProperty({
        description: "Relationship to the emergency contact.",
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    relationship?: string;

    @ApiProperty({
        description:
            "Type of the coach (must be one of the predefined values).",
        enum: UserRole,
        example: UserRole.CLUB_COACH_ASSISTANT,
        required: true,
    })
    @IsEnum(UserRole, {
        message:
            "type must be one of the following values: Head, Assistant, Trainer, Analyst",
    })
    @IsNotEmpty()
    type: ClubCoachRole;

    @ApiProperty({
        description: "Gender of the coach.",
        enum: Gender,
        example: Gender.MALE,
        required: true,
    })
    @IsEnum(Gender, {
        message: "gender must be one of the following values: Male, Female",
    })
    @IsNotEmpty()
    gender: Gender;

    @ApiProperty({
        description: "Last name of the coach.",
        example: "Doe",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: "First name of the coach.",
        example: "John",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: "Joining date of the coach (must be a Date instance).",
        example: "2024-01-01",
        required: true,
    })
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "joinDate must be a Date instance" })
    @IsNotEmpty()
    joinDate: Date;

    @ApiProperty({
        description: "Username for the coach.",
        example: "johndoe",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: "Email address of the coach.",
        example: "johndoe@example.com",
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "Password for the coach.",
        example: "StrongPassword123!",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: "Branch associated with the coach.",
        required: false,
    })
    @IsOptional()
    branch?: Branch;

    @IsUUID("4", { message: "academy must be a UUID" })
    @IsOptional()
    academy?: string;

    @ApiProperty({
        description: "National ID of the coach.",
        example: "1234567890",
        required: false,
    })
    @IsOptional()
    @IsString()
    nationalId?: string;

    @ApiProperty({
        description: "National ID expiration date.",
        example: "2028-01-01",
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate()
    nationalIdExpiration?: Date;
}
