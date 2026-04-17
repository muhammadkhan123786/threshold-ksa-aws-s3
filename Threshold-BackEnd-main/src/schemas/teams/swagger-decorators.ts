import { applyDecorators } from "@nestjs/common";
import { ApiQuery, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SportProfileType } from "src/enums/athletes.enum";

export function ApiPaginatedTeams() {
    return applyDecorators(
        ApiOperation({
            summary: "Get teams with pagination, sorting, and filtering",
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
            name: "name",
            required: false,
            description: "Filter by team name",
            example: "Team A",
        }),
        ApiQuery({
            name: "sport",
            required: false,
            enum: Object.values(SportProfileType),
            description: "Filter by sport type",
            example: SportProfileType.FOOTBALL,
        }),
        ApiResponse({
            status: 200,
            description: "Teams retrieved successfully.",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Teams retrieved successfully",
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
                                name: { type: "string", example: "Team A" },
                                sport: {
                                    type: "string",
                                    enum: Object.values(SportProfileType),
                                    example: SportProfileType.FOOTBALL,
                                },
                                logo: {
                                    type: "string",
                                    example: "https://example.com/logo.png",
                                },
                                creationDate: {
                                    type: "string",
                                    example: "2024-01-01T00:00:00Z",
                                },
                                athletes: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                example:
                                                    "789e1234-b56d-789e-1234-56789b123456",
                                            },
                                        },
                                    },
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
                                example: "/teams?page=1&limit=10",
                            },
                            previous: {
                                type: "string",
                                example: "/teams?page=1&limit=10",
                            },
                            next: {
                                type: "string",
                                example: "/teams?page=2&limit=10",
                            },
                            last: {
                                type: "string",
                                example: "/teams?page=10&limit=10",
                            },
                        },
                    },
                },
            },
        })
    );
}

export function ApiGetTeamInfo() {
    return applyDecorators(
        ApiOperation({ summary: "Get team information by ID" }),
        ApiResponse({
            status: 200,
            description: "Team information retrieved successfully.",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Team found successfully",
                    },
                    data: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                example: "123e4567-e89b-12d3-a456-426614174000",
                            },
                            name: { type: "string", example: "Chelsea FC" },
                            sportProfile: {
                                type: "string",
                                example: "Football",
                            },
                            coach: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        example:
                                            "321f4567-e89b-12d3-a456-426614174321",
                                    },
                                    name: {
                                        type: "string",
                                        example: "John Doe",
                                    },
                                },
                            },
                            branch: { type: "string", example: "London" },
                            creationDate: {
                                type: "string",
                                example: "2023-03-23T00:00:00.000Z",
                            },
                            athletesCount: { type: "number", example: 23 },
                            athletes: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string",
                                            example:
                                                "654e4567-e89b-12d3-a456-426614176543",
                                        },
                                        firstName: {
                                            type: "string",
                                            example: "Nawaf",
                                        },
                                        lastName: {
                                            type: "string",
                                            example: "Aloufi",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Team not found." }),
        ApiResponse({ status: 500, description: "Internal server error." })
    );
}
