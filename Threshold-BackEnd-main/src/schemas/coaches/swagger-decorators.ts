import { applyDecorators } from "@nestjs/common";
import { ApiQuery, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SportProfileType, Gender } from "src/enums/athletes.enum";

export function ApiPaginatedCoaches() {
    return applyDecorators(
        ApiOperation({
            summary: "Get coaches with pagination, sorting, and filtering",
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
            name: "firstName",
            required: false,
            description: "Filter by first name",
            example: "John",
        }),
        ApiQuery({
            name: "lastName",
            required: false,
            description: "Filter by last name",
            example: "Doe",
        }),
        ApiQuery({
            name: "sport",
            required: false,
            enum: Object.values(SportProfileType),
            description: "Filter by sport type",
            example: SportProfileType.FOOTBALL,
        }),
        ApiQuery({
            name: "team",
            required: false,
            description: "Filter by team name",
            example: "Team A",
        }),
        ApiQuery({
            name: "gender",
            required: false,
            enum: Object.values(Gender),
            description: "Filter by gender",
            example: Gender.MALE,
        }),
        ApiResponse({
            status: 200,
            description: "Coaches retrieved successfully.",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Coaches retrieved successfully",
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
                                firstName: { type: "string", example: "John" },
                                lastName: { type: "string", example: "Doe" },
                                sport: {
                                    type: "string",
                                    enum: Object.values(SportProfileType),
                                    example: SportProfileType.FOOTBALL,
                                },
                                avatar: {
                                    type: "string",
                                    example: "https://example.com/avatar.jpg",
                                },
                                gender: {
                                    type: "string",
                                    enum: Object.values(Gender),
                                    example: Gender.MALE,
                                },
                                phone: {
                                    type: "string",
                                    example: "0501234567",
                                },
                                birthday: {
                                    type: "string",
                                    example: "1980-01-01",
                                },
                                experience: { type: "number", example: 10 },
                                teams: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string",
                                                example: "Team A",
                                            },
                                        },
                                    },
                                },
                                user: {
                                    type: "object",
                                    properties: {
                                        email: {
                                            type: "string",
                                            example: "john.doe@example.com",
                                        },
                                        username: {
                                            type: "string",
                                            example: "johndoe",
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
                                example: "/coaches?page=1&limit=10",
                            },
                            previous: {
                                type: "string",
                                example: "/coaches?page=1&limit=10",
                            },
                            next: {
                                type: "string",
                                example: "/coaches?page=2&limit=10",
                            },
                            last: {
                                type: "string",
                                example: "/coaches?page=10&limit=10",
                            },
                        },
                    },
                },
            },
        })
    );
}
