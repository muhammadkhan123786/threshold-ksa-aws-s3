import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateAthleteDto } from "./create-athlete.dto";
import {
    Consideration,
    Nationality,
    Education,
    Gender,
    Relationship,
    YesNo,
} from "src/enums/athletes.enum";
import { Transform, Type } from "class-transformer";
import { IsString, IsOptional } from "class-validator";

export class UpdateAthleteDto extends PartialType(CreateAthleteDto) {
    // --- Original fields ---
    @ApiProperty({ description: "", required: false })
    branch?: string;

    @IsString()
    @IsOptional()
    relationship?: string;

    @ApiProperty({ description: "", required: false })
    contactNumber?: string;

    @ApiProperty({ description: "", required: false })
    @IsString()
    @IsOptional()
    nationality?: string;

    @ApiProperty({ description: "", required: false })
    education?: string;

    @ApiProperty({ description: "", required: false })
    gender?: Gender;

    @ApiProperty({ description: "", required: false })
    allergies?: YesNo;

    @ApiProperty({ description: "", required: false })
    chronic?: string[];

    @ApiProperty({ description: "", required: false })
    injury?: YesNo;

    @ApiProperty({ description: "", required: false })
    consideration?: Consideration;

    @Transform(({ value }) => new Date(value))
    @ApiProperty({ required: true, description: "Date of updating" })
    dateOfUpdating?: Date;

    @Type(() => Date)
    @ApiProperty({ required: true, description: "Join date" })
    joinDate?: Date;

    @Transform(({ value }) => new Date(value))
    @ApiProperty({ required: true, description: "Date of birth" })
    dateOfBirth?: Date;

    @ApiProperty({
        description: "National ID Number",
        required: false,
    })
    nin?: string;

    @ApiProperty({ description: "", required: false })
    avatar?: string;

    @ApiProperty({ description: "", required: false })
    lastName?: string;

    @ApiProperty({ description: "", required: false })
    firstName?: string;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        description: "enter the related academy ID",
    })
    academy?: string;
}
