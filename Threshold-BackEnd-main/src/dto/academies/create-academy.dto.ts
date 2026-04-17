import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsOptional, Matches, IsString } from "class-validator";

export class CreateAcademyDto {
    @ApiProperty({
        description:
            "A valid contact number that starts with 05 followed by 8 digits.",
        example: "0512345678",
        required: true,
    })
    @IsString()
    contactNumber: string;

    @Matches(/^\d{10}$/)
    @ApiProperty({
        description: "A 10-digit registration number.",
        example: "1234567890",
        required: true,
    })
    registrationNumber: string;

    @ApiProperty({
        description:
            "The name of the academy. Example names: 'Academy of Excellence', 'Future Scholars Academy', 'Elite Learning Center'.",
        example: "Academy of Excellence",
        required: true,
    })
    name: string;

    @IsOptional()
    @ApiProperty({
        description: "Indicates if the academy has multiple branches.",
        example: true,
        nullable: true,
        required: false,
    })
    isMultiBranch?: boolean;

    @IsOptional()
    @ApiProperty({
        description: "The URL of the avatar image (optional).",
        nullable: true,
        required: false,
    })
    avatarUrl?: string;

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

    @IsOptional()
    @ApiProperty({
        description: "The address of the academy.",
        example: "123 Main St, Anytown, USA",
        required: false,
    })
    address?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}
