import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateSportProfileDto } from "./create-sportProfile.dto";
import { SportProfileType } from "src/enums/athletes.enum";
import { IsArray, IsString } from "class-validator";

export class UpdateSportProfileDto extends PartialType(CreateSportProfileDto) {
    // --- Original fields ---

    @ApiProperty({
        description: "",
        required: false,
    })
    sport?: SportProfileType;

    @ApiProperty({
        required: true,
        description: "",
    })
    hand?: string;

    @ApiProperty({
        required: true,
        description: "",
    })
    foot?: string;

    @ApiProperty({
        required: true,
        description: "",
    })
    position?: string;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related academy ID",
    })
    academy?: string;
}
