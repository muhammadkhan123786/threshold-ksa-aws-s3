import { PartialType, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, IsOptional } from "class-validator";
import { CreateClubDto } from "./create-club.dto";

export class UpdateClubDto extends PartialType(CreateClubDto) {
    // --- Original fields ---

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "The contact number of the academy, starting with 05 followed by 8 digits.",
        required: false,
        example: "0512345678",
    })
    contactNumber?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "The registration number of the academy, a 10-digit number.",
        required: false,
        example: "1234567890",
    })
    registrationNumber?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "The name of the academy.",
        required: false,
        example: "Academy of Excellence",
    })
    name?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        description: "Indicates whether the academy has multiple branches.",
        required: false,
        default: false,
        example: true,
    })
    isMultiBranch?: boolean;
}
