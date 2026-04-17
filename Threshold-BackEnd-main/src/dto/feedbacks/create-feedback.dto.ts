import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FeedbackType } from "../../entities/feedback.entity";

export class CreateFeedbackDto {
    // --- Original fields ---

    @ApiProperty({
        description: "Provide a valid message.",
        example: "This is a feedback message.",
        required: true,
    })
    @IsString()
    message: string;

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
    @IsString()
    subject: string;

    @ApiProperty({
        description: "Provide a valid feedback type.",
        example: FeedbackType.ISSUE,
        required: true,
        enum: FeedbackType,
    })
    @IsEnum(FeedbackType)
    type: FeedbackType;

    @ApiProperty({
        description: "Provide a valid email.",
        example: "Sample email",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({
        description: "Provide a valid name.",
        example: "Sample name",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    name?: string;

    // --- Relational fields ---
    @ApiProperty({
        description: "Provide a valid academy ID.",
        example: "Sample academy ID",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    academy?: string;
}
