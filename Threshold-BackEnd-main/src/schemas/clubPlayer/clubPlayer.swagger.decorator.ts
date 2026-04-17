import { applyDecorators } from "@nestjs/common";
import {
    ApiBodyOptions,
    ApiOperation,
    ApiOperationOptions,
    ApiParam,
    ApiParamOptions,
    ApiQuery,
    ApiResponse,
    ApiResponseOptions,
    ApiTags,
    ApiBody,
} from "@nestjs/swagger";
import {
    Education,
    Gender,
    AthleteLevel,
    SkillLevel,
    YesNo,
    Consideration,
    AvailabilityStatus,
    FoodAllergies,
} from "src/enums/athletes.enum";
import { SubscriptionPeriod } from "src/enums/subscription-period.enum";

export function SwaggerGetClubPlayers() {
    return applyDecorators(
        ApiTags("Club Players"),
        ApiOperation({
            summary: "Retrieve club players for a specific sport",
        }),
        ApiParam({
            name: "sportId",
            description: "The ID of the sport to retrieve players for",
            example: "sport-uuid-123",
        }),
        ApiQuery({
            name: "page",
            required: false,
            description: "Page number for pagination",
            example: 1,
        }),
        ApiQuery({
            name: "limit",
            required: false,
            description: "Number of items per page",
            example: 10,
        }),
        ApiResponse({
            status: 200,
            description: "Club players retrieved successfully.",
            schema: {
                example: {
                    message: "Club players retrieved successfully.",
                    data: [
                        {
                            player: {
                                fullName: "Ahmed Yasser",
                                id: "uuid-123",
                            },
                            category: {
                                gender: "Male",
                                age: 12,
                            },
                            team: {
                                name: "El Hilal",
                                id: "team-124",
                            },
                            position: "Striker",
                            contract: {
                                status: "Available",
                                endDate: "20 Aug 2025",
                            },
                        },
                    ],
                    meta: {
                        totalItems: 50,
                        itemCount: 10,
                        itemsPerPage: 10,
                        totalPages: 5,
                        currentPage: 1,
                    },
                    links: {
                        first: "/sports/:sportId/club-players?page=1&limit=10",
                        previous: null,
                        next: "/sports/:sportId/club-players?page=2&limit=10",
                        last: "/sports/:sportId/club-players?page=5&limit=10",
                    },
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: "An error occurred while retrieving club players",
        })
    );
}

export const SWAGGER_PLAYER = {
    CREATE_OPERATION: {
        summary: "Create a new player for a specific sport",
        description:
            "This endpoint allows you to create a new player for a sport club. It supports optional avatar upload.",
    } as ApiOperationOptions,

    SPORT_ID_PARAM: {
        name: "sport_id",
        required: true,
        description: "The unique ID of the sport club.",
        schema: { type: "string", format: "uuid" },
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,

    UPDATE_PERSONAL_INFORMATION: {
        description:
            "Data required to update personal information, including an optional avatar file upload.",
        required: true,
        schema: {
            type: "object",
            properties: {
                firstName: {
                    type: "string",
                    example: "John",
                    description: "The first name of the athlete.",
                },
                lastName: {
                    type: "string",
                    example: "Doe",
                    description: "The last name of the athlete.",
                },
                joinDate: {
                    type: "string",
                    format: "date-time",
                    example: "2024-01-01T00:00:00Z",
                    description: "The date the athlete joined.",
                },
                level: {
                    type: "string",
                    enum: Object.values(AthleteLevel),
                    example: AthleteLevel.SHABAB,
                    description: "The level of the athlete.",
                },
                education: {
                    type: "string",
                    description: "The educational level of the athlete.",
                    example: "GRADUATE",
                },
                schoolName: {
                    type: "string",
                    example: "Springfield High School",
                    description: "The name of the school the athlete attended.",
                },
                dateOfBirth: {
                    type: "string",
                    format: "date-time",
                    example: "2000-05-15T00:00:00Z",
                    description: "The athlete's date of birth.",
                },
                gender: {
                    type: "string",
                    enum: Object.values(Gender),
                    example: Gender.MALE,
                    description: "The gender of the athlete.",
                },
                nationality: {
                    type: "string",
                    example: "Saudi Arabia",
                    required: [],
                },
                nin: {
                    type: "string",
                    example: "1234567890",
                    description:
                        "The national identification number of the athlete.",
                },
                ninExpirationDate: {
                    type: "string",
                    format: "date-time",
                    example: "2026-01-01T00:00:00Z",
                    description: "The expiration date of the athlete's NIN.",
                },
                weight: {
                    type: "number",
                    example: 70.5,
                    description: "The weight of the athlete in kilograms.",
                },
                height: {
                    type: "number",
                    example: 175.0,
                    description: "The height of the athlete in centimeters.",
                },
                avatar: {
                    type: "string",
                    format: "binary",
                    description: "Avatar image file (optional).",
                },
            },
            required: [
                "firstName",
                "lastName",
                "gender",
                "dateOfBirth",
                "nationality",
            ],
        },
    },
    CREATE_BODY: {
        schema: {
            type: "object",
            properties: {
                dateOfUpdating: {
                    type: "string",
                    format: "date",
                    description: "The date of updating player data.",
                    example: "2025-01-06",
                },
                avatar: {
                    type: "string",
                    format: "binary",
                    description: "Optional avatar image file for the player.",
                },
                category: {
                    type: "string",
                    description: "The category of the player.",
                    example: "0512345678",
                },
                position: {
                    type: "string",
                    description: "The position of the player.",
                    example: "Forward",
                },
                nationality: {
                    type: "string",
                    example: "Saudi Arabia",
                    required: [],
                },
                education: {
                    type: "string",
                    description: "The education level of the player.",
                    example: "GRADUATE",
                },
                clublevel: {
                    type: "string",
                    description: "The skill level of the player.",
                    example: "Beginner",
                },
                periodOfSubscription: {
                    type: "string",
                    enum: Object.values(SubscriptionPeriod),
                    description: "The subscription period for the player.",
                    example: SubscriptionPeriod.ONE_YEAR,
                },
                gender: {
                    type: "string",
                    enum: Object.values(Gender),
                    description: "The gender of the player.",
                    example: Gender.MALE,
                },
                weight: {
                    type: "string",
                    description: "The weight of the player in kilograms.",
                    example: "70.5",
                },
                nin: {
                    type: "string",
                    description: "The National ID Number of the player.",
                    example: "1234567890",
                },
                ninExpirationDate: {
                    type: "string",
                    format: "date",
                    description:
                        "The expiration date of the player's national ID number.",
                    example: "2026-01-01",
                },
                dateOfBirth: {
                    type: "string",
                    format: "date",
                    description: "The date of birth of the player.",
                    example: "1995-05-26",
                },
                lastName: {
                    type: "string",
                    description: "The last name of the player.",
                    example: "Smith",
                },
                firstName: {
                    type: "string",
                    description: "The first name of the player.",
                    example: "John",
                },
                allergyDetails: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of allergy details (optional).",
                    nullable: true,
                    default: [],
                    example: ["Pollen", "Dust", "Peanuts"],
                },
                chronicConditions: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of chronic conditions",
                    example: ["Asthma", "Diabetes"],
                    default: [],
                },
                healthFactors: {
                    type: "array",
                    items: { type: "string" },
                    description:
                        "List of health factors or considerations (optional).",
                    nullable: true,
                    default: [],
                    example: ["Wheelchair Access", "Special Diet"],
                },
            },
            required: [
                "nationality",
                "education",
                "periodOfSubscription",
                "gender",
                "weight",
                "nin",
                "dateOfBirth",
                "lastName",
                "firstName",
            ],
        },
    } as ApiBodyOptions,

    CREATE_SUCCESS: {
        status: 201,
        description: "Player created successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Player created successfully.",
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "65983ffb-9cb4-4fc7-8f6d-3f4ab9f0cee8",
                        },
                        firstName: { type: "string", example: "John" },
                        lastName: { type: "string", example: "Doe" },
                        avatarUrl: {
                            type: "string",
                            example:
                                "https://s3-bucket-name.s3.amazonaws.com/avatar.jpg",
                        },
                    },
                },
            },
        },
    } as ApiResponseOptions,

    VALIDATION_ERROR_RESPONSE: {
        status: 400,
        description: "Validation error",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Validation error occurred.",
                },
                errors: {
                    type: "array",
                    items: {
                        type: "string",
                        example: "Field 'firstName' is required.",
                    },
                },
            },
        },
    } as ApiResponseOptions,

    SERVER_ERROR_RESPONSE: {
        status: 500,
        description: "Internal server error",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "An unexpected error occurred.",
                },
            },
        },
    } as ApiResponseOptions,
};

// Add new Swagger decorator for creating a player by team ID
export function SwaggerCreatePlayerByTeam() {
    return applyDecorators(
        ApiOperation({ summary: "Create a new player for a specific team" }),
        ApiParam({
            name: "team_id",
            description: "The unique ID of the team.",
            schema: { type: "string", format: "uuid" },
            example: "123e4567-e89b-12d3-a456-426614174000",
        }),
        ApiBody(SWAGGER_PLAYER.CREATE_BODY),
        ApiResponse(SWAGGER_PLAYER.CREATE_SUCCESS),
        ApiResponse(SWAGGER_PLAYER.VALIDATION_ERROR_RESPONSE),
        ApiResponse(SWAGGER_PLAYER.SERVER_ERROR_RESPONSE)
    );
}
