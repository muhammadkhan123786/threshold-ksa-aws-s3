import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateFeedbackDto } from "./create-feedback.dto";

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
    // --- Original fields ---

    @ApiProperty({ description: "", required: false, example: "" })
    notes?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    email?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    name?: string;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related academy ID",
    })
    academy?: string;
}
