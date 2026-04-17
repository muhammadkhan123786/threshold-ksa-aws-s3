import { ApiProperty } from "@nestjs/swagger";
import {
    IsUUID,
    IsString,
    IsEnum,
    IsDate,
    IsInt,
    IsOptional,
    IsArray,
} from "class-validator";
import { Gender } from "src/enums/athletes.enum";
import { PositionType } from "src/enums/manager.enum";
import { UserRole } from "src/enums/users.enum";

export class CreateManagerDTO {
    @ApiProperty({
        description: "First name of the manager",
        example: "John",
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        description: "Last name of the manager",
        example: "Doe",
    })
    @IsString()
    lastName: string;

    @ApiProperty({
        description: "Nationality of the manager",
        example: "Saudi Arabia",
        required: false,
    })
    @IsString()
    @IsOptional()
    nationality?: string;

    @ApiProperty({
        description: "Gender of the manager",
        enum: Gender,
        example: Gender.MALE,
    })
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({
        description: "Birthday of the manager in YYYY-MM-DD format",
        example: "1990-01-01",
    })
    @IsDate()
    birthday: Date;

    @ApiProperty({
        description: "Phone number of the manager",
        example: "+123456789",
    })
    @IsString()
    phone: string;

    @ApiProperty({
        description: "Emergency contact phone number",
        example: "+987654321",
        required: false,
    })
    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @ApiProperty({
        description: "Relationship with the emergency contact",
        example: "Father",
    })
    @IsString()
    relationship: string;

    @ApiProperty({
        description: "Educational level of the manager",
        example: "Bachelor's Degree",
        required: false,
    })
    @IsOptional()
    @IsString()
    educationalLevel?: string;

    @ApiProperty({
        description: "Years of experience",
        example: 5,
    })
    @IsInt()
    experience: number;

    @ApiProperty({
        description: "National ID of the manager",
        example: "123456789",
    })
    @IsString()
    nationalId: string;

    @ApiProperty({
        description: "Expiration date of the National ID in YYYY-MM-DD format",
        example: "2030-01-01",
        required: false,
    })
    @IsOptional()
    @IsDate()
    nationalIdExpiration?: Date;

    @ApiProperty({
        description: "Position of the manager",
        enum: UserRole,
        example: UserRole.CLUB_EXECUTIVE_MANAGER,
    })
    @IsEnum(PositionType)
    position: UserRole;

    @ApiProperty({
        description: "Avatar URL of the manager",
        example: "https://example.com/avatar.png",
        required: false,
    })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({
        description: "Username for the manager account",
        example: "johndoe",
        required: false,
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({
        description: "Email address for the manager account",
        example: "johndoe@example.com",
        required: false,
    })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({
        description: "Password for the manager account",
        example: "securepassword",
        required: false,
    })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({
        description: "School name of the manager",
        example: "Harvard University",
        required: false,
    })
    @IsOptional()
    @IsString()
    schoolName?: string;

    @ApiProperty({
        description: "Languages spoken by the manager",
        example: ["English", "Spanish"],
        required: false,
    })
    @IsOptional()
    @IsArray()
    languages?: string[];
}
