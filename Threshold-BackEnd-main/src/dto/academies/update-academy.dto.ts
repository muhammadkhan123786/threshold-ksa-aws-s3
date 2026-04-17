import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateAcademyDto } from "./create-academy.dto";
import { IsArray } from "class-validator";

export class UpdateAcademyDto extends PartialType(CreateAcademyDto) {
    // --- Original fields ---

    @ApiProperty({ description: "", required: false, example: "" })
    contactNumber?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    registrationNumber?: string;

    @ApiProperty({
        description: "name of the academy",
        required: false,
        example: "",
    })
    name?: string;

    @ApiProperty({
        nullable: false,
        default: false,
    })
    isMultiBranch?: boolean;
}
