import { applyDecorators } from "@nestjs/common";
import {
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiTags,
    ApiQuery,
} from "@nestjs/swagger";

export function ApiCreateSessionUnderWeeklySession() {
    return applyDecorators(
        ApiTags("Weekly Sessions"),
        ApiOperation({ summary: "Create a session under a weekly session" }),
        ApiBody({
            description:
                "Details of the session to create under the weekly session",
            schema: {
                example: {
                    type: "TRAINING",
                    from: "10:00",
                    to: "11:30",
                    date: "2024-10-30",
                    weeklySessionId: "weekly-session-id",
                    achievedSession: "1 km", // New optional field
                    space: "Swimming pool almalz", // New optional field
                },
            },
        }),
        ApiResponse({
            status: 201,
            description:
                "Session created successfully under the weekly session.",
            schema: {
                example: {
                    status: 201,
                    message: "Session created under weekly session",
                    data: {
                        id: "session-id",
                        type: "TRAINING",
                        from: "10:00",
                        to: "11:30",
                        date: "2024-10-30",
                        weeklySession: { id: "weekly-session-id" },
                        achievedSession: "1 km", // New optional field
                        space: "Swimming pool almalz", // New optional field
                    },
                },
            },
        }),
        ApiResponse({ status: 400, description: "Invalid input." })
    );
}

export function ApiCreateWeeklySession() {
    return applyDecorators(
        ApiTags("Weekly Sessions"),
        ApiOperation({ summary: "Create a new weekly session" }),
        ApiBody({
            description: "The details of the weekly session to create",
            schema: {
                example: {
                    title: "Week 1 Training",
                    description: "Focused on endurance and strength training",
                    weekTarget: 5,
                    weekDate: "2024-09-25",
                    sessionDays: [
                        { date: "2024-09-25" },
                        { date: "2024-09-27" },
                    ],
                    teamId: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3", // Added teamId
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Weekly session created successfully.",
            schema: {
                example: {
                    status: 201,
                    message: "Weekly session has been created successfully",
                    data: {
                        id: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3",
                        title: "Week 1 Training",
                        description:
                            "Focused on endurance and strength training",
                        weekTarget: 5,
                        weekDate: "2024-09-25",
                        sessionsDays: [
                            { date: "2024-09-25" },
                            { date: "2024-09-27" },
                        ],
                        teamId: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3", // Added teamId
                        createdAt: "2024-09-01T12:45:00.000Z",
                        updatedAt: "2024-09-01T12:45:00.000Z",
                    },
                },
            },
        }),
        ApiResponse({ status: 400, description: "Invalid input." })
    );
}

export function ApiGetWeeklySessions() {
    return applyDecorators(
        ApiTags("Weekly Sessions"),
        ApiOperation({ summary: "Get all weekly sessions" }),
        ApiResponse({
            status: 200,
            description: "List of all weekly sessions retrieved successfully",
            schema: {
                example: {
                    status: 200,
                    message: "Weekly sessions retrieved successfully",
                    data: [
                        {
                            id: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3",
                            title: "Week 1 Training",
                            description:
                                "Focused on endurance and strength training",
                            weekTarget: 5,
                            weekDate: "2024-09-25",
                            sessionsDays: [
                                { date: "2024-09-25" },
                                { date: "2024-09-27" },
                            ],
                            teamId: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3", // Added teamId
                            createdAt: "2024-09-01T12:45:00.000Z",
                            updatedAt: "2024-09-01T12:45:00.000Z",
                        },
                    ],
                },
            },
        })
    );
}

export function ApiGetWeeklySessionById() {
    return applyDecorators(
        ApiTags("Weekly Sessions"),
        ApiOperation({ summary: "Get a single weekly session by ID" }),
        ApiResponse({
            status: 200,
            description: "Weekly session retrieved successfully",
            schema: {
                example: {
                    status: 200,
                    message: "Weekly session retrieved successfully",
                    data: {
                        id: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3",
                        title: "Week 1 Training",
                        description:
                            "Focused on endurance and strength training",
                        weekTarget: 5,
                        weekDate: "2024-09-25",
                        sessionsDays: [
                            { date: "2024-09-25" },
                            { date: "2024-09-27" },
                        ],
                        teamId: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3", // Added teamId
                        createdAt: "2024-09-01T12:45:00.000Z",
                        updatedAt: "2024-09-01T12:45:00.000Z",
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Weekly session not found" })
    );
}

export function ApiUpdateWeeklySession() {
    return applyDecorators(
        ApiTags("Weekly Sessions"),
        ApiOperation({ summary: "Update a weekly session" }),
        ApiBody({
            description: "The details to update in the weekly session",
            schema: {
                example: {
                    title: "Updated Week 1 Training",
                    description: "Updated description for the week",
                    weekTarget: 8,
                    weekDate: "2024-09-30",
                    sessionsDays: [
                        { date: "2024-09-25" },
                        { date: "2024-09-27" },
                    ],
                    teamId: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3", // Added teamId
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Weekly session updated successfully",
            schema: {
                example: {
                    status: 200,
                    message: "Weekly session updated successfully",
                    data: {
                        id: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3",
                        title: "Updated Week 1 Training",
                        description: "Updated description for the week",
                        weekTarget: 8,
                        weekDate: "2024-09-30",
                        sessionsDays: [
                            { date: "2024-09-25" },
                            { date: "2024-09-27" },
                        ],
                        teamId: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3", // Added teamId
                        createdAt: "2024-09-01T12:45:00.000Z",
                        updatedAt: "2024-09-05T12:45:00.000Z",
                    },
                },
            },
        })
    );
}

export function ApiDeleteWeeklySession() {
    return applyDecorators(
        ApiTags("Weekly Sessions"),
        ApiOperation({ summary: "Delete a weekly session" }),
        ApiResponse({
            status: 200,
            description: "Weekly session deleted successfully",
            schema: {
                example: {
                    status: 200,
                    message: "Weekly session deleted successfully",
                },
            },
        }),
        ApiResponse({ status: 404, description: "Weekly session not found" })
    );
}

export function ApiPaginatedWeeklySessions() {
    return applyDecorators(
        ApiTags("Weekly Sessions"),
        ApiOperation({
            summary: "Get paginated weekly sessions with filtering and search",
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
            description: "Order to sort by",
            enum: ["ASC", "DESC"],
            example: "DESC",
        }),
        ApiQuery({
            name: "searchQuery",
            required: false,
            description: "Search by session title or description",
            example: "Endurance",
        }),
        ApiQuery({
            name: "weekDate",
            required: false,
            description: "Filter by session week date (YYYY-MM-DD)",
            example: "2024-09-25",
        }),
        ApiQuery({
            name: "teamId", // Added teamId
            required: false,
            description: "Filter by team ID",
            example: "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3",
        }),
        ApiResponse({
            status: 200,
            description: "Weekly sessions retrieved successfully",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Weekly sessions retrieved successfully",
                    },
                    data: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string", example: "abc123" },
                                title: {
                                    type: "string",
                                    example: "Week 1 Training",
                                },
                                description: {
                                    type: "string",
                                    example: "Endurance training",
                                },
                                weekTarget: { type: "number", example: 5 },
                                weekDate: {
                                    type: "string",
                                    example: "2024-09-25",
                                },
                                teamId: {
                                    type: "string",
                                    example:
                                        "b45bfe59-09df-4d3f-9b64-74f5cf30e5f3", // Added teamId
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
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: "An error occurred while retrieving weekly sessions",
            schema: {
                example: {
                    message:
                        "An error occurred while retrieving weekly sessions",
                    error: "Detailed error message",
                },
            },
        })
    );
}
