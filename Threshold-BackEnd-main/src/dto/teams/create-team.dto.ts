import { IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SportProfileType } from "src/enums/athletes.enum";
export class CreateTeamDto {
    // --- Original fields ---

    @ApiProperty({
        description: "",
        required: false,
    })
    logo: string;

    @ApiProperty({
        required: true,
        enum: SportProfileType,
        description: "",
    })
    sport: string;

    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    branch: string;

    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    name: string;

    // --- Relational fields ---
    @ApiProperty({
        required: true,
        description: "enter the related academy ID",
    })
    academy: string;

    @ApiProperty({ required: true, description: "enter the related coach ID" })
    coach: string;

    @ApiProperty({
        required: false,
        description: "enter the related athletes' IDs",
    })
    athletes?: string[];
}
