import { applyDecorators } from "@nestjs/common";
import {
    ApiQuery,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from "@nestjs/swagger";
import { CreateClothingDataDto } from "src/dto/athletes/create-clothing-data.dto";
import { UpdateClothingDataDto } from "src/dto/athletes/update-clothing-data.dto";
import {
    AthleteLevel,
    Gender,
    Nationality,
    Education,
    AvailabilityStatus,
    FoodAllergies,
    SportProfileType,
} from "src/enums/athletes.enum";
import { PaymentMethod } from "src/enums/payment-method.enum";
import { SubscriptionStatus } from "src/enums/subscription-status.enum";

export function ApiPaginatedAthletes() {
    return applyDecorators(
        ApiOperation({
            summary: "Get athletes with pagination, sorting, and filtering",
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
            name: "level",
            required: false,
            enum: Object.values(AthleteLevel),
            description: "Filter by athlete level",
            example: AthleteLevel.SHABAB,
        }),
        ApiQuery({
            name: "team",
            required: false,
            description: "Filter by team name",
            example: "Team A",
        }),
        ApiQuery({
            name: "subscriptionStatus",
            required: false,
            isArray: true,
            enum: Object.values(SubscriptionStatus),
            description: "Filter by subscription status",
            example: ["active", "inactive"],
        }),
        ApiQuery({
            name: "paymentMethod",
            required: false,
            enum: Object.values(PaymentMethod),
            description: "Filter by payment method",
            example: PaymentMethod.ONLINE,
        }),
        ApiQuery({
            name: "gender",
            required: false,
            enum: Object.values(Gender),
            description: "Filter by gender",
            example: Gender.MALE,
        }),
        ApiQuery({
            name: "nationality",
            required: false,
            enum: Object.values(Nationality),
            description: "Filter by nationality",
            example: Nationality.SA,
        }),
        ApiQuery({
            name: "education",
            required: false,
            enum: Object.values(Education),
            description: "Filter by education level",
            example: Education.GRADUATE,
        }),
        ApiQuery({
            name: "availabilityStatus",
            required: false,
            enum: Object.values(AvailabilityStatus),
            description: "Filter by availability status",
            example: AvailabilityStatus.available,
        }),
        ApiQuery({
            name: "foodAllergies",
            required: false,
            enum: Object.values(FoodAllergies),
            description: "Filter by food allergies",
            example: FoodAllergies.PEANUTS,
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
            description: "Athletes retrieved successfully.",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Athletes retrieved successfully",
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
                                level: {
                                    type: "string",
                                    enum: Object.values(AthleteLevel),
                                    example: AthleteLevel.SHABAB,
                                },
                                gender: {
                                    type: "string",
                                    enum: Object.values(Gender),
                                    example: Gender.MALE,
                                },
                                nationality: {
                                    type: "string",
                                    example: "Saudi Arabia",
                                    required: [],
                                },
                                education: {
                                    type: "string",
                                    enum: Object.values(Education),
                                    example: Education.GRADUATE,
                                },
                                availabilityStatus: {
                                    type: "string",
                                    enum: Object.values(AvailabilityStatus),
                                    example: AvailabilityStatus.available,
                                },
                                foodAllergies: {
                                    type: "string",
                                    enum: Object.values(FoodAllergies),
                                    example: FoodAllergies.PEANUTS,
                                },
                                subscription: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            example: "active",
                                        },
                                        period: {
                                            type: "string",
                                            example: "monthly",
                                        },
                                        paymentMethod: {
                                            type: "string",
                                            example: PaymentMethod.ONLINE,
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
                                example: "/athletes?page=1&limit=10",
                            },
                            previous: {
                                type: "string",
                                example: "/athletes?page=1&limit=10",
                            },
                            next: {
                                type: "string",
                                example: "/athletes?page=2&limit=10",
                            },
                            last: {
                                type: "string",
                                example: "/athletes?page=10&limit=10",
                            },
                        },
                    },
                },
            },
        })
    );
}

export function SwaggerCreateClothingData() {
    return applyDecorators(
        ApiOperation({ summary: "Create clothing data for a player" }),
        ApiParam({
            name: "id",
            description: "Player ID",
            example: "a123b456-789c-012d-345e-67890f123456",
        }),
        ApiBody({
            description: "Clothing data to create",
            type: CreateClothingDataDto,
            examples: {
                example1: {
                    summary: "Standard player clothing data",
                    value: {
                        tShirtSize: "m",
                        pantSize: "l",
                        shoeSize: "42",
                        driFitSize: "m",
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Clothing data successfully created",
            schema: {
                example: {
                    id: "a123b456-789c-012d-345e-67890f123456",
                    firstName: "John",
                    lastName: "Doe",
                    athleteClothing: {
                        id: "f123b456-789c-012d-345e-67890f123abc",
                        tShirtSize: "m",
                        pantSize: "l",
                        shoeSize: "42",
                        driFitSize: "m",
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Player not found" }),
        ApiResponse({
            status: 409,
            description: "Clothing data already exists for this player",
        })
    );
}

export function SwaggerUpdateClothingData() {
    return applyDecorators(
        ApiOperation({ summary: "Update clothing data" }),
        ApiParam({
            name: "id",
            description: "Player ID",
            example: "a123b456-789c-012d-345e-67890f123456",
        }),
        ApiBody({
            description: "Clothing data to update",
            type: UpdateClothingDataDto,
            examples: {
                example1: {
                    summary: "Updated player clothing data",
                    value: {
                        tShirtSize: "l",
                        pantSize: "xl",
                        shoeSize: "43",
                        driFitSize: "l",
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Clothing data updated successfully",
            schema: {
                example: {
                    id: "a123b456-789c-012d-345e-67890f123456",
                    firstName: "John",
                    lastName: "Doe",
                    athleteClothing: {
                        id: "f123b456-789c-012d-345e-67890f123abc",
                        tShirtSize: "l",
                        pantSize: "xl",
                        shoeSize: "43",
                        driFitSize: "l",
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Player not found" })
    );
}

/**
 * New decorator for documenting `getPlayerAnalytics`
 * usage in the controller.
 */
export function ApiPlayerAnalytics() {
    return applyDecorators(
        ApiOperation({
            summary: "Get detailed player analytics including training load",
        }),
        ApiParam({
            name: "id",
            description: "The ID of the player",
            example: "123e4567-e89b-12d3-a456-426614174000",
        }),
        ApiQuery({
            name: "trainingStartDate",
            description:
                "The start date for calculating training load (YYYY-MM-DD format)",
            example: "2024-01-01",
            required: false,
        }),
        ApiQuery({
            name: "trainingEndDate",
            description:
                "The end date for calculating training load (YYYY-MM-DD format)",
            example: "2024-12-31",
            required: false,
        }),
        ApiResponse({
            status: 200,
            description:
                "Successfully retrieved player analytics, including training load data",
            schema: {
                example: {
                    sessions: [
                        {
                            date: "2024-09-01",
                            scale: 8,
                            comment: "Good effort today.",
                            load: 120,
                        },
                    ],
                    totalSessions: 21,
                    practicingPercentage: 100,
                    presencePercentage: 90,
                    trainingLoad: [
                        {
                            week: "Week of 2024-09-01",
                            totalLoad: 500,
                            averageScale: 7,
                        },
                    ],
                    level: "Intermediate",
                    analyticsBreakdown: {
                        totalSessions: 21,
                        averageLoadPerSession: 105,
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Player not found" })
    );
}

/**
 * Renamed this function to ApiPaginatedPlayers.
 */
export function ApiPaginatedPlayers() {
    return applyDecorators(
        ApiOperation({
            summary: "Get players with pagination, sorting, and filtering",
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
            name: "level",
            required: false,
            enum: Object.values(AthleteLevel),
            description: "Filter by player level",
            example: AthleteLevel.SHABAB,
        }),
        ApiQuery({
            name: "team",
            required: false,
            description: "Filter by team name",
            example: "Team A",
        }),
        ApiQuery({
            name: "subscriptionStatus",
            required: false,
            isArray: true,
            enum: Object.values(SubscriptionStatus),
            description: "Filter by subscription status",
            example: ["active", "inactive"],
        }),
        ApiQuery({
            name: "paymentMethod",
            required: false,
            enum: Object.values(PaymentMethod),
            description: "Filter by payment method",
            example: PaymentMethod.ONLINE,
        }),
        ApiQuery({
            name: "gender",
            required: false,
            enum: Object.values(Gender),
            description: "Filter by gender",
            example: Gender.MALE,
        }),
        ApiQuery({
            name: "nationality",
            required: false,
            enum: Object.values(Nationality),
            description: "Filter by nationality",
            example: Nationality.SA,
        }),
        ApiQuery({
            name: "education",
            required: false,
            enum: Object.values(Education),
            description: "Filter by education level",
            example: Education.GRADUATE,
        }),
        ApiQuery({
            name: "availabilityStatus",
            required: false,
            enum: Object.values(AvailabilityStatus),
            description: "Filter by availability status",
            example: AvailabilityStatus.available,
        }),
        ApiQuery({
            name: "foodAllergies",
            required: false,
            enum: Object.values(FoodAllergies),
            description: "Filter by food allergies",
            example: FoodAllergies.PEANUTS,
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
            description: "Players retrieved successfully.",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Players retrieved successfully",
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
                                level: {
                                    type: "string",
                                    enum: Object.values(AthleteLevel),
                                    example: AthleteLevel.SHABAB,
                                },
                                gender: {
                                    type: "string",
                                    enum: Object.values(Gender),
                                    example: Gender.MALE,
                                },
                                nationality: {
                                    type: "string",
                                    example: "Saudi Arabia",
                                    required: [],
                                },
                                education: {
                                    type: "string",
                                    enum: Object.values(Education),
                                    example: Education.GRADUATE,
                                },
                                availabilityStatus: {
                                    type: "string",
                                    enum: Object.values(AvailabilityStatus),
                                    example: AvailabilityStatus.available,
                                },
                                foodAllergies: {
                                    type: "string",
                                    enum: Object.values(FoodAllergies),
                                    example: FoodAllergies.PEANUTS,
                                },
                                subscription: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            example: "active",
                                        },
                                        period: {
                                            type: "string",
                                            example: "monthly",
                                        },
                                        paymentMethod: {
                                            type: "string",
                                            example: PaymentMethod.ONLINE,
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
                                example: "/players?page=1&limit=10",
                            },
                            previous: {
                                type: "string",
                                example: "/players?page=1&limit=10",
                            },
                            next: {
                                type: "string",
                                example: "/players?page=2&limit=10",
                            },
                            last: {
                                type: "string",
                                example: "/players?page=10&limit=10",
                            },
                        },
                    },
                },
            },
        })
    );
}
