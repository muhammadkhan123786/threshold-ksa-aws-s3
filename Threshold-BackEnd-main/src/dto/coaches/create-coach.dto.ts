import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { IsDate, IsEnum, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Gender, SportProfileType } from "src/enums/athletes.enum";
import { Academy } from "src/entities/academy.entity";
import { Branch } from "src/entities/branch.entity";
export class CreateCoachDto {
    @ApiProperty({
        description: "",
        required: false,
    })
    @ApiProperty({
        description: "Provide a valid avatar.",
        example: "Sample avatar",
        required: true,
    })
    avatar: string;

    @IsInt()
    @ApiProperty({
        required: true,
        description: "",
        default: 0,
        example: "0",
    })
    @ApiProperty({
        description: "Provide a valid experience.",
        example: "123",
        required: true,
    })
    experience: number;

    @IsDate()
    @ApiProperty({
        required: true,
        description: "",
        example: new Date().toLocaleDateString(),
    })
    @ApiProperty({
        description: "Provide a valid birthday.",
        example: "Sample birthday",
        required: true,
    })
    birthday: string;

    @ApiProperty({
        description: "Phone number of the coach.",
        example: "0512345678",
        required: true,
    })
    @IsString()
    phone: string;

    @IsEnum(Gender)
    @ApiProperty({
        required: true,
        enum: Gender,
    })
    @ApiProperty({
        description: "Provide a valid gender.",
        example: "Sample gender",
        required: true,
    })
    gender: string;

    @IsEnum(SportProfileType)
    @ApiProperty({
        required: true,
        enum: SportProfileType,
    })
    @ApiProperty({
        description: "Provide a valid sport.",
        example: "Sample sport",
        required: true,
    })
    sport: string;

    @IsDate()
    @ApiProperty({
        required: true,
        description: "",
        example: new Date().toLocaleDateString(),
    })
    @ApiProperty({
        description: "Provide a valid joinDate.",
        example: "Sample joinDate",
        required: true,
    })
    joinDate: string;

    @ApiProperty({
        required: true,
        description: "",
    })
    @ApiProperty({
        description: "Provide a valid lastName.",
        example: "Sample lastName",
        required: true,
    })
    lastName: string;

    @ApiProperty({
        required: true,
        description: "",
    })
    @ApiProperty({
        description: "Provide a valid firstName.",
        example: "Sample firstName",
        required: true,
    })
    firstName: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "Username for the coach",
    })
    @ApiProperty({
        description: "Provide a valid username.",
        example: "Sample username",
        required: true,
    })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: "Email for the coach",
    })
    @ApiProperty({
        description: "Provide a valid email.",
        example: "Sample email",
        required: true,
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Password for the coach",
    })
    @ApiProperty({
        description: "Provide a valid password.",
        example: "Sample password",
        required: true,
    })
    password: string;

    @ApiProperty({
        required: true,
        description: "Academy object",
    })
    @ApiProperty({
        description: "Provide a valid academy.",
        example: "Sample academy",
        required: true,
    })
    academy: Academy;

    @IsOptional()
    @ApiProperty({
        required: false,
        description: "Branch object (optional)",
    })
    branch?: Branch;
}
