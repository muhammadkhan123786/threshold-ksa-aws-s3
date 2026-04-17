import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDate,
    IsEnum,
    Matches,
    Min,
    Max,
    Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender, Nationality, Relationship } from "src/enums/athletes.enum";
import { Transform } from "class-transformer";
import { ClubAdminRole } from "src/enums/admin-type.enum";

export class CreateClubAdminDto {
    @ApiProperty({
        description: "Years of admin's experience (must be an integer).",
        example: 5,
        required: true,
    })
    @Transform(({ value }) => (value ? Number(value) : undefined))
    @IsInt({ message: "experience must be an integer number" })
    @Min(0, { message: "experience cannot be negative" })
    @IsNotEmpty()
    experience: number;

    @ApiProperty({
        description: "Admin's date of birth (must be a valid date).",
        example: "1990-01-01",
        required: true,
    })
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "birthday must be a valid date" })
    @IsNotEmpty()
    birthday: Date;

    @ApiPropertyOptional({
        description: "Phone number starting with '05' followed by 8 digits.",
        example: "0512345678",
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: "Emergency contact number (optional).",
        example: "0512345678",
        required: false,
    })
    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @ApiProperty({
        description: "Nationality of the admin.",
        example: "Saudi Arabia",
        required: false,
    })
    @IsString()
    @IsOptional()
    nationality?: string;

    @ApiProperty({
        description: "Relationship to the emergency contact (e.g., Father).",
        example: "Father",
        required: false,
    })
    @IsString()
    @IsOptional()
    relationship?: string;

    @ApiProperty({
        description: "Type of the admin (Head, Assistant, Trainer, Analyst).",
        enum: ClubAdminRole,
        example: ClubAdminRole.CLUB_ADMIN_ASSISTANT,
        required: true,
    })
    @IsEnum(ClubAdminRole, {
        message:
            "type must be a valid enum value (Head, Assistant, Trainer, Analyst)",
    })
    @IsNotEmpty()
    type: ClubAdminRole;

    @ApiProperty({
        description: "Gender of the admin.",
        enum: Gender,
        example: Gender.MALE,
        required: true,
    })
    @IsEnum(Gender, {
        message: "gender must be a valid enum value (Male, Female)",
    })
    @IsNotEmpty()
    gender: Gender;

    @ApiProperty({
        description: "Last name of the admin.",
        example: "Doe",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: "First name of the admin.",
        example: "John",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: "Joining date of the admin (must be a valid date).",
        example: "2024-01-01",
        required: true,
    })
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    @IsDate({ message: "joinDate must be a valid date" })
    @IsNotEmpty()
    joinDate: Date;

    @ApiProperty({
        description: "Username for the admin's user account.",
        example: "johndoe",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, { message: "username must be between 4 and 20 characters" })
    username: string;

    @ApiProperty({
        description: "Email address of the admin.",
        example: "johndoe@example.com",
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "Password for the admin's user account.",
        example: "StrongPassword123!",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message:
            "Password too weak. It must be at least 8 characters long, include uppercase and lowercase letters, and contain at least one number.",
    })
    password: string;

    @ApiProperty({
        description: "Branch ID associated with the admin (optional).",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: false,
        nullable: true,
    })
    @IsOptional()
    branch?: string;

    @IsOptional()
    academy?: string;

    @ApiPropertyOptional({
        description: "Avatar image file (optional)",
        type: "string",
        format: "binary",
    })
    @IsOptional()
    avatar?: any;
    @ApiPropertyOptional({
        description: "National ID of the admin (optional)",
        example: "12345678901234",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? String(value) : undefined))
    nationalId?: string;

    @ApiPropertyOptional({
        description: "Expiration date of the national ID (optional)",
        example: "2024-01-01",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? new Date(value) : undefined))
    nationalIdExpiration?: Date;
}
