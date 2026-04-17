import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateTeamDto } from "./create-team.dto";

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
    // --- Original fields ---

    @ApiProperty({ description: "", required: false, example: "" })
    logo?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    sport?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    branch?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    name?: string;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related academy ID",
    })
    academy?: string;

    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related coach ID",
    })
    coach?: string;

    @ApiProperty({
        required: false,
        description: "enter the related athletes' IDs",
    })
    athletes?: string[];
}
