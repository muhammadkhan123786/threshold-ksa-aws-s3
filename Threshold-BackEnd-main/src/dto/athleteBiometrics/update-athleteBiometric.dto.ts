import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateAthleteBiometricDto } from "./create-athleteBiometric.dto";
import { AthleteBiometricStatus } from "src/enums/athletes.enum";

export class UpdateAthleteBiometricDto extends PartialType(
    CreateAthleteBiometricDto
) {
    // --- Original fields ---
    @ApiProperty({ description: "", required: false, example: "" })
    status?: AthleteBiometricStatus;

    @ApiProperty({ description: "", required: false, example: "" })
    bmi?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    bmiPercentile?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    weight?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    height?: string;

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
