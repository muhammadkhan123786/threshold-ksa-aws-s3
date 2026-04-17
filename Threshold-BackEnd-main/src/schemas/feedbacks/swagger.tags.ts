import { applyDecorators } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiConsumes,
} from "@nestjs/swagger";
import { CreateFeedbackDto } from "../../dto/feedbacks/create-feedback.dto";
import { Feedback, FeedbackType } from "../../entities/feedback.entity";

export const SWAGGER_TAGS = {
    FEEDBACKS: "Feedbacks",
};

export function SwaggerCreateClubFeedback() {
    return applyDecorators(
        ApiTags(SWAGGER_TAGS.FEEDBACKS),
        ApiOperation({ summary: "Create a new club feedback" }),
        ApiResponse({
            status: 201,
            description: "Feedback created successfully.",
            type: Feedback,
        }),
        ApiResponse({
            status: 400,
            description: "Invalid input, object invalid.",
        }),
        ApiResponse({ status: 404, description: "Academy doesn't exist." }),
        ApiResponse({ status: 500, description: "Internal server error." }),
        ApiConsumes("multipart/form-data"),
        ApiBody({
            description: "Payload for creating a new club feedback",
            type: CreateFeedbackDto,
            schema: {
                type: "object",
                properties: {
                    notes: {
                        type: "string",
                        example: "This is a feedback note.",
                    },
                    email: { type: "string", example: "user@example.com" },
                    name: { type: "string", example: "John Doe" },
                    type: {
                        type: "string",
                        enum: Object.values(FeedbackType),
                        example: FeedbackType.ISSUE,
                    },
                    academy: { type: "string", example: "Sample academy ID" },
                },
            },
        }),
        ApiBody({
            description: "Avatar file",
            required: false,
            schema: {
                type: "object",
                properties: {
                    avatar: {
                        type: "string",
                        format: "binary",
                    },
                },
            },
        })
    );
}
