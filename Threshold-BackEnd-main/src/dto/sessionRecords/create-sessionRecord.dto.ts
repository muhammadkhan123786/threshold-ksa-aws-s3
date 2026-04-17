import { IsInt, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SessionRecordStatus } from "src/enums/athletes.enum";
export class CreateSessionRecordDto {
    // --- Original fields ---

    @ApiProperty({
        required: true,
        description: "",
        enum: SessionRecordStatus,
    })
    @ApiProperty({
        description: "Provide a valid status.",
        example: "Sample status",
        required: true,
    })
    status: SessionRecordStatus;

    @ApiProperty({
        description: "",
        required: false,
        default: "placeholder",
        example: "placeholder",
    })
    comment?: string;

    @IsInt()
    @Min(0)
    @Max(10)
    @ApiProperty({
        description: "",
        required: false,
        default: 0,
        example: "0",
    })
    scale?: number;

    // --- Relational fields ---
    @ApiProperty({
        required: true,
        description: "enter the related athlete ID",
    })
    @ApiProperty({
        description: "Provide a valid athlete.",
        example: "Sample athlete",
        required: true,
    })
    athlete: string;

    @ApiProperty({
        required: true,
        description: "enter the related session ID",
    })
    @ApiProperty({
        description: "Provide a valid session.",
        example: "Sample session",
        required: true,
    })
    session: string;
}
