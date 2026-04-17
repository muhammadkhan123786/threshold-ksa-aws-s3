import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsArray,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Length,
    Matches,
} from "class-validator";
import { UserRole } from "src/enums/users.enum";

export class UnifiedDto {
    @ApiProperty({
        description:
            "The username of the user. Must be between 5 and 25 characters.",
        example: "john_doe",
        required: true,
    })
    @IsString()
    username: string;

    @IsEmail()
    @ApiProperty({
        description: "Provide a valid email address.",
        example: "example@example.com",
        required: true,
    })
    email: string;

    @IsOptional()
    @IsEnum(UserRole)
    @ApiProperty({
        description:
            "The role assigned to the user. Valid roles include ADMIN, ACADEMY_ADMIN, CLUB_ADMIN, etc.",
        example: UserRole.ACADEMY_ADMIN,
        enum: UserRole,
        required: false,
    })
    role?: UserRole;

    @Length(6, 25, {
        message: "Password must be between 6 and 25 characters.",
    })
    @ApiProperty({
        description: "Password must contain at least 6 characters.",
        example: "s5Rsa2?#sd1154",
        required: true,
    })
    password: string;

    @Matches(/^\d{10}$/, {
        message: "The registration number must be exactly 10 digits.",
    })
    @ApiProperty({
        description: "A 10-digit unique registration number for the academy.",
        example: "1234567890",
        required: true,
    })
    registrationNumber: string;

    @IsString()
    @ApiProperty({
        description:
            "The official name of the academy. It should reflect the organization's branding.",
        example: "Elite Sports Academy",
        required: true,
    })
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "The address associated with the user or academy.",
        example: "123 Main Street, City, Country",
        required: false,
    })
    address?: string;

    @IsEnum(["academy", "club"])
    @ApiProperty({
        description:
            "The type of organization the user is associated with. Either 'academy' or 'club'.",
        example: "academy",
        enum: ["academy", "club"],
        required: true,
    })
    organizationType?: "academy" | "club";

    @IsOptional()
    @IsArray()
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    @ApiPropertyOptional({
        description:
            "A list of additional phone numbers (optional). Each phone number must start with '05' and have 10 digits.",
        nullable: true,
        default: [],
        example: ["0598765432", "0587654321"],
    })
    phoneNumbers?: string[];

    @IsString()
    @Matches(/^(05)\d{8}$/, {
        message: "Phone number must start with '05' followed by 8 digits.",
    })
    @ApiProperty({
        description: "Phone number of the company. Must start with '05' followed by 8 digits.",
        example: "0512345678",
        required: true,
    })
    phone: string;
}
