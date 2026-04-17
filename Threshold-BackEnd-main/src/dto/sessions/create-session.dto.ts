import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PlayingSessionType } from "src/enums/athletes.enum";
export class CreateSessionDto {
    // --- Original fields ---

    @ApiProperty({
        required: true,
    })
    @ApiProperty({
        description: "Provide a valid from.",
        example: "Sample from",
        required: true,
    })
    from: string;

    @ApiProperty({
        required: true,
    })
    @ApiProperty({
        description: "Provide a valid to.",
        example: "Sample to",
        required: true,
    })
    to: string;

    @ApiProperty({
        required: true,
        description: "",
        enum: PlayingSessionType,
    })
    @ApiProperty({
        description: "Provide a valid type.",
        example: "Sample type",
        required: true,
    })
    type: PlayingSessionType;

    @IsDate()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid date.",
        example: "Sample date",
        required: true,
    })
    date: string;

    // --- Relational fields ---
    @ApiProperty({
        required: true,
        description: "enter the related academy ID",
    })
    @ApiProperty({
        description: "Provide a valid academy.",
        example: "Sample academy",
        required: true,
    })
    academy: string;

    @ApiProperty({ required: true, description: "enter the related team ID" })
    @ApiProperty({
        description: "Provide a valid team.",
        example: "Sample team",
        required: true,
    })
    team: string;

    @IsUUID()
    @IsOptional()
    weeklySessionId?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "Distance or achievement for the session (e.g., 1 km)",
        example: "1 km",
        required: false,
    })
    achievedSession?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description:
            "space or space of the session (e.g., Swimming pool almalz)",
        example: "Swimming pool almalz",
        required: false,
    })
    space?: string;
}
