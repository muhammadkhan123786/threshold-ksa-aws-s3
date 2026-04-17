import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateAthleteBatteryDto } from "./create-athleteBattery.dto";

export class UpdateAthleteBatteryDto extends PartialType(
    CreateAthleteBatteryDto
) {
    // --- Original fields ---

    @ApiProperty({ description: "", required: false, example: "" })
    pacer?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    sit?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    trunk?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    push?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    curl?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    date?: string;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related athlete ID",
    })
    athlete?: string;
}
