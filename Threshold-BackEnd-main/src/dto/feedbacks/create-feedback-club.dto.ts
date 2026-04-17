import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FeedbackType } from "../../entities/feedback.entity";

export class CreateFeedbackDto {
    // --- Original fields ---

    @ApiProperty({
        description: "Provide a valid notes.",
        example: "Sample notes",
        required: true,
    })
    notes: string;

    @IsEmail()
    @ApiProperty({
        description: "Provide a valid email.",
        example: "Sample email",
        required: true,
    })
    email: string;

    @ApiProperty({
        description: "Provide a valid name.",
        example: "Sample name",
        required: true,
    })
    name: string;

    // --- New fields ---
    @IsOptional()
    @ApiProperty({
        description: "Provide a valid avatar file.",
        type: "string",
        format: "binary",
        required: false,
    })
    avatar?: any;

    @ApiProperty({
        description: "Provide a valid subject.",
        example: "Feedback Subject",
        required: true,
    })
    subject: string;

    @IsEnum(FeedbackType)
    @ApiProperty({
        description: "Provide a valid feedback type.",
        example: FeedbackType.ISSUE,
        required: true,
    })
    type: FeedbackType;

    // --- Relational fields ---
    @ApiProperty({
        description: "Provide a valid academy ID.",
        example: "Sample academy ID",
        required: true,
    })
    academy: string;
}
