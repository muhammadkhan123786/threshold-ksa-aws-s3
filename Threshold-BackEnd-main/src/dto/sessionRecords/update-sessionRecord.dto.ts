import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateSessionRecordDto } from "./create-sessionRecord.dto";
import { SessionRecordStatus } from "src/enums/athletes.enum";

export class UpdateSessionRecordDto extends PartialType(
    CreateSessionRecordDto
) {
    // --- Original fields ---

    @ApiProperty({
        description: "",
        required: false,
    })
    status?: SessionRecordStatus;

    @ApiProperty({ description: "", required: false, example: "" })
    comment?: string;

    @ApiProperty({ description: "", required: false, example: "0" })
    scale?: number;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related athlete ID",
    })
    athlete?: string;

    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related session ID",
    })
    session?: string;
}
