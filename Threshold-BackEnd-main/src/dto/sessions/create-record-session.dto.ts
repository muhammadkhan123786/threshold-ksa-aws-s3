import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateSessionDto } from "./create-session.dto";
import {
    PlayingSessionType,
    PlayingSessionStatus,
} from "src/enums/athletes.enum";

export class CreateRecordSessionDto extends PartialType(CreateSessionDto) {
    // --- Original fields ---

    @ApiProperty({
        description: "",
        required: false,
    })
    status?: PlayingSessionStatus;

    @ApiProperty({
        description: "",
        required: false,
    })
    type?: PlayingSessionType;

    @ApiProperty({
        required: false,
    })
    from?: string;

    @ApiProperty({
        required: false,
    })
    to?: string;

    @ApiProperty({ description: "", required: false, example: "" })
    date?: string;

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
        description: "enter the related team ID",
    })
    team?: string;
}
