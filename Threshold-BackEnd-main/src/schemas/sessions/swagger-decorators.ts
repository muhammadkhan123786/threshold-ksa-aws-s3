import { applyDecorators } from "@nestjs/common";
import { ApiQuery, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
    PlayingSessionStatus,
    PlayingSessionType,
} from "src/enums/athletes.enum";

export const SWAGGER_TAGS = {
    PLAYER_ATTENDANCE: "Player Attendance",
};

export const SWAGGER_OPERATIONS = {
    GET_PLAYER_ATTENDANCE: {
        summary: "Retrieve player attendance records",
        description:
            "Fetches attendance records for a specific player by their ID.",
    },
};

export const SWAGGER_PARAMS = {
    PLAYER_ID: {
        name: "playerId",
        type: String,
        required: true,
        description: "The unique identifier of the player",
    },
};

export const SWAGGER_RESPONSES = {
    SUCCESS: {
        status: 200,
        description: "Player attendance records retrieved successfully",
        schema: {
            type: "object",
            properties: {
                message: { type: "string" },
                attendanceRecords: { type: "array", items: { type: "object" } },
            },
        },
    },
    NOT_FOUND: {
        status: 404,
        description: "Player not found",
    },
    SERVER_ERROR: {
        status: 500,
        description: "Internal server error",
    },
};

export function ApiPaginatedSessions() {
    return applyDecorators(
        ApiOperation({
            summary: "Get sessions with pagination, sorting, and filtering",
        }),
        ApiQuery({
            name: "page",
            required: false,
            description: "Page number",
            example: 1,
        }),
        ApiQuery({
            name: "limit",
            required: false,
            description: "Number of items per page",
            example: 10,
        }),
        ApiQuery({
            name: "sortField",
            required: false,
            description: "Field to sort by",
            example: "createdAt",
        }),
        ApiQuery({
            name: "sortOrder",
            required: false,
            enum: ["ASC", "DESC"],
            description: "Order to sort by",
            example: "ASC",
        }),
        ApiQuery({
            name: "status",
            required: false,
            enum: Object.values(PlayingSessionStatus),
            description: "Filter by session status",
            example: PlayingSessionStatus.NOT_STARTED,
        }),
        ApiQuery({
            name: "type",
            required: false,
            enum: Object.values(PlayingSessionType),
            description: "Filter by session type",
            example: PlayingSessionType.TRAINING,
        }),
        ApiQuery({
            name: "teamId",
            required: false,
            description: "Filter by team ID",
            example: "123e4567-e89b-12d3-a456-426614174000",
        }),
        ApiResponse({
            status: 200,
            description: "Sessions retrieved successfully.",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Sessions retrieved successfully",
                    },
                    data: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "123e4567-e89b-12d3-a456-426614174000",
                                },
                                status: {
                                    type: "string",
                                    enum: Object.values(PlayingSessionStatus),
                                    example: PlayingSessionStatus.NOT_STARTED,
                                },
                                from: { type: "string", example: "2024-01-01" },
                                to: { type: "string", example: "2024-01-01" },
                                type: {
                                    type: "string",
                                    enum: Object.values(PlayingSessionType),
                                    example: PlayingSessionType.TRAINING,
                                },
                                date: {
                                    type: "string",
                                    example: "2024-01-01",
                                },
                                createdAt: {
                                    type: "string",
                                    example: "2024-01-01T00:00:00Z",
                                },
                                updatedAt: {
                                    type: "string",
                                    example: "2024-01-01T00:00:00Z",
                                },
                            },
                        },
                    },
                    meta: {
                        type: "object",
                        properties: {
                            totalItems: { type: "number", example: 100 },
                            itemCount: { type: "number", example: 10 },
                            itemsPerPage: { type: "number", example: 10 },
                            totalPages: { type: "number", example: 10 },
                            currentPage: { type: "number", example: 1 },
                        },
                    },
                    links: {
                        type: "object",
                        properties: {
                            first: {
                                type: "string",
                                example: "/sessions?page=1&limit=10",
                            },
                            previous: {
                                type: "string",
                                example: "/sessions?page=1&limit=10",
                            },
                            next: {
                                type: "string",
                                example: "/sessions?page=2&limit=10",
                            },
                            last: {
                                type: "string",
                                example: "/sessions?page=10&limit=10",
                            },
                        },
                    },
                },
            },
        })
    );
}
