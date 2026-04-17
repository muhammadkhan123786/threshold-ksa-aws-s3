import { ApiProperty } from "@nestjs/swagger";
import {
    Matches,
    IsBoolean,
    IsOptional,
    IsString,
    IsEnum,
} from "class-validator";
import { AcademyType } from "src/enums/appType.enum";

export class CreateClubDto {
    @ApiProperty({
        description: "Phone number of the club.",
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

    @IsString()
    @ApiProperty({
        description:
            "The name of the academy. Example names: 'Academy of Excellence', 'Future Scholars Academy', 'Elite Learning Center'.",
        example: "Academy of Excellence",
        required: true,
    })
    name: string;

    @IsOptional()
    @IsEnum(AcademyType)
    @ApiProperty({
        description: "Indicates if the academy has type branches.",
        example: AcademyType.CLUB,
        required: false,
    })
    type?: AcademyType;

    @IsBoolean()
    @ApiProperty({
        description: "Indicates if the academy has multiple branches.",
        example: false,
        nullable: true,
    })
    isMultiBranch: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "The address of the academy.",
        example: "99, ElZahara, Gada",
        required: false,
    })
    address?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Academy avatar URL.",
        example: "https://example.com/avatar.jpg",
        required: false,
        nullable: true,
    })
    avatarUrl?: string;
}
