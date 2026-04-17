import {
    IsOptional,
    IsString,
    IsDate,
    IsEnum,
    IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Relationship } from "src/enums/athletes.enum";

export class UpdateContactDto {
    @ApiProperty({
        description: "National ID of the coach.",
        example: "12345678901234",
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

    @ApiProperty({
        description: "Phone number of the coach (must start with 05).",
        example: "05679875456",
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: "Emergency contact phone number (must start with 05).",
        example: "05679875456",
        required: false,
    })
    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @ApiProperty({
        description: "Relationship to the emergency contact.",
        example: "Father",
        required: false,
    })
    @IsString()
    @IsOptional()
    relationship?: string;
}
