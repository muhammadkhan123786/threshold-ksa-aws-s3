import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Academy } from "src/entities/academy.entity";
import { Branch } from "src/entities/branch.entity";

export class UpdateCoachDto {
    @ApiProperty({ description: "", required: false, example: "" })
    avatar?: string;

    @ApiProperty({ description: "", required: false, example: "0" })
    experience?: number;

    @ApiProperty({ description: "", required: false, example: "" })
    birthday?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    phone?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    gender?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    sport?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    joinDate?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    lastName?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    firstName?: string;

    @IsOptional()
    academy?: Academy;

    @IsOptional()
    branch?: Branch;
}
