import {
    ApiBodyOptions,
    ApiParamOptions,
    ApiQueryOptions,
    ApiResponseOptions,
    ApiOperationOptions,
} from "@nestjs/swagger";
import { Gender } from "src/enums/team-category.enum";
import { TeamCategory } from "src/enums/team.enum";

export const SWAGGER_TAGS = {
    CLUB_TEAMS: "Club Teams",
    TEAM_GOALS: "Team Goals",
};

export const SWAGGER_OPERATIONS: { [key: string]: ApiOperationOptions } = {
    GET_CLUB_TEAMS: {
        summary: "Retrieve a paginated list of club teams",
    },
    GET_CLUB_TEAM_BY_ID: {
        summary: "Retrieve a specific club team by ID",
    },
    CREATE_CLUB_TEAM: {
        summary: "Create a new club team",
    },
    UPDATE_CLUB_TEAM: {
        summary: "Update an existing club team",
    },
    DELETE_CLUB_TEAM: {
        summary: "Delete a club team",
    },
    GET_TEAM_FULL_DETAILS: {
        summary: "Get full details of a team",
        description:
            "Retrieve detailed information about a team, including managers and sessions.",
    },
    CREATE_TEAM_GOAL: {
        summary: "Create a new team goal",
        description: "Creates a goal for a specific team for a given year.",
    },
    ADD_SUB_GOAL: {
        summary: "Add a sub-goal with weeks to a team",
        description:
            "Create a sub-goal with optional title, month, and associated weeks.",
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string",
                                example: "Improve stamina",
                            },
                            monthNumber: { type: "number", example: 1 },
                            volumeTargeted: {
                                type: "string",
                                example: "100 counts",
                            },
                            startDate: {
                                type: "string",
                                example: "2023-03-01",
                            },
                            endDate: { type: "string", example: "2023-03-31" },
                            weeks: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        title: {
                                            type: "string",
                                            example: "Week 1",
                                        },
                                        weekNumber: {
                                            type: "number",
                                            example: 1,
                                        },
                                        startDate: {
                                            type: "string",
                                            example: "2023-03-01",
                                        },
                                        endDate: {
                                            type: "string",
                                            example: "2023-03-07",
                                        },
                                        volumeTargeted: {
                                            type: "string",
                                            example: "50",
                                        },
                                        volumeUnit: {
                                            type: "string",
                                            example: "counts",
                                        },
                                        totalSessions: {
                                            type: "number",
                                            example: 4,
                                        },
                                        neededSessions: {
                                            type: "number",
                                            example: 2,
                                        },
                                    },
                                },
                                example: [
                                    {
                                        title: "Week 1",
                                        weekNumber: 1,
                                        startDate: "2023-03-01",
                                        endDate: "2023-03-07",
                                        volumeTargeted: "50",
                                        volumeUnit: "counts",
                                        totalSessions: 4,
                                        neededSessions: 2,
                                    },
                                    {
                                        title: "Week 2",
                                        weekNumber: 2,
                                        startDate: "2023-03-08",
                                        endDate: "2023-03-14",
                                        volumeTargeted: "60 counts",
                                        totalSessions: 5,
                                        neededSessions: 3,
                                    },
                                    {
                                        title: "Week 3",
                                        weekNumber: 3,
                                        startDate: "2023-03-15",
                                        endDate: "2023-03-21",
                                        volumeTargeted: "70 counts",
                                        totalSessions: 6,
                                        neededSessions: 4,
                                    },
                                    {
                                        title: "Week 4",
                                        weekNumber: 4,
                                        startDate: "2023-03-22",
                                        endDate: "2023-03-28",
                                        volumeTargeted: "80 counts",
                                        totalSessions: 7,
                                        neededSessions: 5,
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
    },
    GET_MAIN_TEAM_GOALS: {
        summary: "Retrieve all main goals for a team",
        description: "Fetch all main yearly goals set for the specified team.",
    },
    GET_SUB_GOALS_BY_TEAM_GOAL: {
        summary: "Retrieve sub-goals for a team",
        description: "Fetch all sub-goals associated with a specific team.",
    },
    UPDATE_MAIN_TEAM_GOAL: {
        summary: "Update the main goal for a team",
        description: "Modify the details of the main yearly goal for a team.",
    },
    UPDATE_SUB_GOAL: {
        summary: "Update a sub-goal for a team goal",
        description:
            "Modify the details of a specific sub-goal, including associated weeks.",
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string",
                                example: "Enhance endurance",
                            },
                            monthNumber: { type: "number", example: 2 },
                            volumeTargeted: {
                                type: "string",
                                example: "150 counts",
                            },
                            startDate: {
                                type: "string",
                                example: "2023-04-01",
                            },
                            endDate: { type: "string", example: "2023-04-30" },
                            weeks: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        title: {
                                            type: "string",
                                            example: "Week 1",
                                        },
                                        weekNumber: {
                                            type: "number",
                                            example: 1,
                                        },
                                        startDate: {
                                            type: "string",
                                            example: "2023-04-01",
                                        },
                                        endDate: {
                                            type: "string",
                                            example: "2023-04-07",
                                        },
                                        volumeTargeted: {
                                            type: "string",
                                            example: "55",
                                        },
                                        volumeUnit: {
                                            type: "string",
                                            example: "counts",
                                        },
                                        totalSessions: {
                                            type: "number",
                                            example: 6,
                                        },
                                        neededSessions: {
                                            type: "number",
                                            example: 3,
                                        },
                                    },
                                },
                                example: [
                                    {
                                        title: "Week 1",
                                        weekNumber: 1,
                                        startDate: "2023-04-01",
                                        endDate: "2023-04-07",
                                        volumeTargeted: "55",
                                        volumeUnit: "counts",
                                        totalSessions: 6,
                                        neededSessions: 3,
                                    },
                                    {
                                        title: "Week 2",
                                        weekNumber: 2,
                                        startDate: "2023-04-08",
                                        endDate: "2023-04-14",
                                        volumeTargeted: "65 counts",
                                        totalSessions: 7,
                                        neededSessions: 4,
                                    },
                                    {
                                        title: "Week 3",
                                        weekNumber: 3,
                                        startDate: "2023-04-15",
                                        endDate: "2023-04-21",
                                        volumeTargeted: "75 counts",
                                        totalSessions: 8,
                                        neededSessions: 5,
                                    },
                                    {
                                        title: "Week 4",
                                        weekNumber: 4,
                                        startDate: "2023-04-22",
                                        endDate: "2023-04-28",
                                        volumeTargeted: "85 counts",
                                        totalSessions: 9,
                                        neededSessions: 6,
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
    },
    GET_TEAM_PLAYERS: {
        summary: "Retrieve players assigned to a specific team",
    },
};

export const SWAGGER_API_PARAMS: { [key: string]: ApiParamOptions } = {
    SPORT_CLUB_PROFILE_ID_PARAM: {
        name: "sportClubProfileId",
        type: "string",
        description: "UUID of the sport club profile",
        example: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
    } as ApiParamOptions,
    TEAM_ID_PARAM: {
        name: "id",
        type: "string",
        description: "UUID of the Team",
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,
    GOAL_ID_PARAM: {
        name: "goalId",
        type: "string",
        description: "UUID of the Team Goal",
        example: "456e7890-e89b-12d3-a456-426614174001",
    } as ApiParamOptions,
    SUB_GOAL_ID_PARAM: {
        name: "subGoalId",
        type: "string",
        description: "UUID of the Sub-Goal",
        example: "789f1234-e89b-12d3-a456-426614174002",
    } as ApiParamOptions,
    ID_PARAM: {
        name: "id",
        type: "string",
        description: "UUID of the team",
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,
};

export const SWAGGER_API_QUERIES: { [key: string]: ApiQueryOptions } = {
    SEARCH_QUERY: {
        name: "search",
        type: "string",
        required: false,
        description: "Search query for team name or coach's name",
        example: "Tigers",
    } as ApiQueryOptions,

    YEAR_QUERY: {
        name: "year",
        required: false,
        description: "Optional year to filter main team goals",
    },
    PAGE_QUERY: {
        name: "page",
        type: "integer",
        required: false,
        description: "Page number for pagination",
        example: 1,
        schema: {
            type: "integer",
            default: 1,
            minimum: 1,
        },
    } as ApiQueryOptions,

    LIMIT_QUERY: {
        name: "limit",
        type: "integer",
        required: false,
        description: "Number of items per page",
        example: 10,
        schema: {
            type: "integer",
            default: 10,
            minimum: 1,
            maximum: 100,
        },
    } as ApiQueryOptions,

    SORT_FIELD_QUERY: {
        name: "sortField",
        type: "string",
        required: false,
        description: "Field to sort by",
        example: "createdAt",
        enum: ["name", "createdAt", "updatedAt", "category"],
    } as ApiQueryOptions,

    SORT_ORDER_QUERY: {
        name: "sortOrder",
        type: "string",
        required: false,
        description: "Order of sorting",
        example: "DESC",
        enum: ["ASC", "DESC"],
    } as ApiQueryOptions,
};

export const SWAGGER_RESPONSES: { [key: string]: ApiResponseOptions } = {
    GET_TEAM_PLAYERS_SUCCESS: {
        status: 200,
        description:
            "List of players assigned to a team retrieved successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Players retrieved successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        players: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        example:
                                            "123e4567-e89b-12d3-a456-426614174000",
                                    },
                                    athleteId: {
                                        type: "string",
                                        example: "MNG12345",
                                    },
                                    firstName: {
                                        type: "string",
                                        example: "Ahmed",
                                    },
                                    lastName: {
                                        type: "string",
                                        example: "Yasser",
                                    },
                                    avatarSignedUrl: {
                                        type: "string",
                                        example:
                                            "https://s3.example.com/avatar.jpg",
                                    },
                                    level: {
                                        type: "string",
                                        example: "Beginner",
                                    },
                                    position: {
                                        type: "string",
                                        example: "Forward",
                                    },
                                    weight: { type: "number", example: 75 },
                                    height: { type: "number", example: 180 },
                                    dateOfBirth: {
                                        type: "string",
                                        example: "2000-01-01",
                                    },
                                    gender: {
                                        type: "string",
                                        example: "MALE",
                                    },
                                    nationality: {
                                        type: "string",
                                        example: "Saudi",
                                    },
                                    nationalId: {
                                        type: "string",
                                        example: "1234567890",
                                    },
                                    nationalIdExpiration: {
                                        type: "string",
                                        example: "2030-01-01",
                                    },
                                    contract: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                example:
                                                    "123e4567-e89b-12d3-a456-426614174010",
                                            },
                                            type: {
                                                type: "string",
                                                example: "PERMANENT",
                                            },
                                            status: {
                                                type: "string",
                                                example: "ACTIVE",
                                            },
                                            joinDate: {
                                                type: "string",
                                                example: "2023-01-01",
                                            },
                                            expirationDate: {
                                                type: "string",
                                                example: "2026-01-01",
                                            },
                                            contractDuration: {
                                                type: "string",
                                                example: "THREE_YEARS",
                                            },
                                            contractSignedUrl: {
                                                type: "string",
                                                example:
                                                    "https://s3.example.com/contracts/player-contract.pdf",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        total: { type: "number", example: 25 },
                        page: { type: "number", example: 1 },
                        limit: { type: "number", example: 10 },
                        totalPages: { type: "number", example: 3 },
                    },
                },
            },
        },
    } as ApiResponseOptions,
    TEAM_PLAYERS_NOT_FOUND: {
        status: 404,
        description: "No players found for the specified team",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 404 },
                message: {
                    type: "string",
                    example: "No players found for this team",
                },
            },
        },
    },
    MAIN_TEAM_GOAL_UPDATED_SUCCESS: {
        status: 200,
        description: "Main team goal updated successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Main team goal updated successfully",
                },
                data: { $ref: "#/components/schemas/TeamGoal" },
            },
        },
    },
    MAIN_TEAM_GOAL_NOT_FOUND: {
        status: 404,
        description: "Main team goal not found",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 404 },
                message: {
                    type: "string",
                    example: "Main team goal not found",
                },
            },
        },
    },
    SUB_GOAL_UPDATED_SUCCESS: {
        status: 200,
        description: "Sub-goal updated successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Sub-goal updated successfully",
                },
                data: { $ref: "#/components/schemas/SubGoal" },
            },
        },
    },
    SUB_GOAL_NOT_FOUND: {
        status: 404,
        description: "Sub-goal not found",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 404 },
                message: { type: "string", example: "Sub-goal not found" },
            },
        },
    },
    UPDATE_MAIN_TEAM_GOAL_SUCCESS: {
        status: 200,
        description: "Main team goal updated successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Main team goal updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "456e7890-e89b-12d3-a456-426614174001",
                        },
                        title: { type: "string", example: "Win 45 matches" },
                        description: {
                            type: "string",
                            example: "Increase win target for 2025",
                        },
                        year: { type: "number", example: 2025 },
                        startDate: { type: "string", example: "2025-01-01" },
                        endDate: { type: "string", example: "2025-12-31" },
                    },
                },
            },
        },
    },

    UPDATE_SUB_GOAL_SUCCESS: {
        status: 200,
        description: "Sub-goal updated successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Sub-goal updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "789e1234-e89b-12d3-a456-426614174002",
                        },
                        title: {
                            type: "string",
                            example: "Increase training endurance",
                        },
                        weekNumber: { type: "number", example: 3 },
                        volumeTargeted: {
                            type: "string",
                            example: "12 kilometers",
                        },
                    },
                },
            },
        },
    },
    MAIN_TEAM_GOALS_SUCCESS: {
        status: 200,
        description: "Main team goals retrieved successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Main team goals retrieved successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "456e7890-e89b-12d3-a456-426614174001",
                        },
                        title: {
                            type: "string",
                            example: "Win at least 40 matches",
                        },
                        description: {
                            type: "string",
                            example: "Achieve 40 victories in the year.",
                        },
                        year: { type: "number", example: 2025 },
                        startDate: { type: "string", example: "2025-01-01" },
                        endDate: { type: "string", example: "2025-12-31" },
                    },
                },
            },
        },
    },

    SUB_GOALS_SUCCESS: {
        status: 200,
        description: "Sub-goal processed successfully",
    },

    TEAM_GOAL_NOT_FOUND: {
        status: 404,
        description: "Sub-goal not found",
    },
    TEAM_GOAL_SUCCESS: {
        status: 201,
        description: "Team goal created successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 201 },
                message: {
                    type: "string",
                    example: "Team goal created successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "789e4567-e89b-12d3-a456-426614174999",
                        },
                        title: {
                            type: "string",
                            example: "Win at least 40 matches",
                        },
                        description: {
                            type: "string",
                            example: "Yearly target for match wins",
                        },
                        year: { type: "number", example: 2025 },
                        startDate: {
                            type: "string",
                            example: "2025-01-01T00:00:00Z",
                        },
                        endDate: {
                            type: "string",
                            example: "2025-12-31T23:59:59Z",
                        },
                    },
                },
            },
        },
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        description: "Internal server error",
    },
    TEAM_DETAILS_SUCCESS: {
        status: 200,
        description: "Team details retrieved successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Team details retrieved successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "123e4567-e89b-12d3-a456-426614174000",
                        },
                        name: { type: "string", example: "Tigers" },
                        avatarUrl: {
                            type: "string",
                            example: "https://example.com/avatar.jpg",
                        },
                        spaces: {
                            type: "array",
                            items: { type: "string" },
                            example: ["space1", "space2"],
                        },
                        players: {
                            type: "object",
                            properties: {
                                shortDistances: { type: "number", example: 5 },
                                midDistances: { type: "number", example: 3 },
                                longDistances: { type: "number", example: 2 },
                            },
                        },
                        admins: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    role: {
                                        type: "string",
                                        example: "Administrator",
                                    },
                                    name: {
                                        type: "string",
                                        example: "John Doe",
                                    },
                                },
                            },
                        },
                        createdAt: {
                            type: "string",
                            example: "2023-01-01T00:00:00Z",
                        },
                        nextSession: {
                            type: "object",
                            properties: {
                                sessionId: {
                                    type: "string",
                                    example: "session123",
                                },
                                sessionType: {
                                    type: "string",
                                    example: "Training",
                                },
                                kpi: { type: "string", example: "Achieved" },
                                startTime: {
                                    type: "string",
                                    example: "2023-01-10T10:00:00Z",
                                },
                                endTime: {
                                    type: "string",
                                    example: "2023-01-10T12:00:00Z",
                                },
                            },
                        },
                        managers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        example: "manager123",
                                    },
                                    name: {
                                        type: "string",
                                        example: "Jane Smith",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    TEAM_NOT_FOUND: {
        status: 404,
        description: "Team not found",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 404 },
                message: { type: "string", example: "Team not found" },
            },
        },
    },

    GET_CLUB_TEAMS_SUCCESS: {
        status: 200,
        description: "List of club teams retrieved successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Teams retrieved successfully",
                },
                data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Team" },
                },
                meta: { $ref: "#/components/schemas/PaginationMeta" },
            },
        },
    } as ApiResponseOptions,

    GET_CLUB_TEAM_BY_ID_SUCCESS: {
        status: 200,
        description: "Club team retrieved successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Team retrieved successfully",
                },
                data: { $ref: "#/components/schemas/Team" },
            },
        },
    } as ApiResponseOptions,

    CREATE_CLUB_TEAM_SUCCESS: {
        status: 201,
        description: "Club team created successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Team created successfully",
                },
                data: { $ref: "#/components/schemas/Team" },
            },
        },
    } as ApiResponseOptions,

    UPDATE_CLUB_TEAM_SUCCESS: {
        status: 200,
        description: "Club team updated successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Team updated successfully",
                },
                data: { $ref: "#/components/schemas/Team" },
            },
        },
    } as ApiResponseOptions,

    DELETE_CLUB_TEAM_SUCCESS: {
        status: 200,
        description: "Club team deleted successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Team deleted successfully",
                },
                data: { type: "null" },
            },
        },
    } as ApiResponseOptions,

    NOT_FOUND_RESPONSE: {
        status: 404,
        description: "Resource not found",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Resource not found" },
                error: { type: "string", example: "Not Found" },
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
                    type: "array",
                    items: { type: "string" },
                    example: ["name must be a string"],
                },
                error: { type: "string", example: "Bad Request" },
            },
        },
    } as ApiResponseOptions,

    ERROR_RESPONSE: {
        status: 500,
        description: "Internal server error",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "An error occurred" },
                error: { type: "string", example: "Internal Server Error" },
            },
        },
    } as ApiResponseOptions,
};

export const SWAGGER_BODIES: { [key: string]: ApiBodyOptions } = {
    CREATE_TEAM_GOAL: {
        description: "Payload to create a new team goal",
        required: true,
        schema: {
            type: "object",
            properties: {
                title: { type: "string", example: "Win at least 40 matches" },
                description: {
                    type: "string",
                    example: "Yearly target for match wins",
                },
                year: { type: "number", example: 2025 },
                startDate: { type: "string", example: "2025-01-01T00:00:00Z" },
                endDate: { type: "string", example: "2025-12-31T23:59:59Z" },
            },
            required: ["title", "description", "year", "startDate", "endDate"],
        },
    },
    ADD_SUB_GOAL: {
        description: "Payload to add a sub-goal to a team goal",
        required: true,
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    example: "Win at least 3 matches in January",
                },
                weekNumber: { type: "number", example: 1 },
                volumeTargeted: { type: "string", example: "100 counts" },
            },
            required: ["title", "weekNumber", "volumeTargeted"],
        },
    },
    CREATE_CLUB_TEAM: {
        description:
            "Data required to create a new club team along with optional logo and background files",
        required: true,
        schema: {
            type: "object",
            properties: {
                logo: {
                    type: "string",
                    format: "binary",
                    description: "Logo image file (optional)",
                },
                background: {
                    type: "string",
                    format: "binary",
                    description: "Background image file (optional)",
                },
                branch: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                    description: "Branch ID associated with the team.",
                },
                name: {
                    type: "string",
                    example: "Al-Hilal U19",
                    description: "Name of the team.",
                },
                coach: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174002",
                    description: "Coach ID of the team.",
                },
                admin: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174002",
                    description: "Admin ID of the team.",
                },
                subCoaches: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "uuid",
                        example: "123e4567-e89b-12d3-a456-426614174003",
                    },
                    description:
                        "List of sub-coach IDs associated with the team.",
                    style: "form",
                    explode: true,
                },
                athletes: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "uuid",
                        example: "123e4567-e89b-12d3-a456-426614174005",
                    },
                    description:
                        "List of athlete IDs associated with the team.",
                    style: "form",
                    explode: true,
                },
                gender: {
                    type: "string",
                    enum: [Gender.MALE, Gender.FEMALE],
                    description:
                        "Gender of the team (male - للذكور | female - للإناث)",
                    example: Gender.MALE,
                },
                category: {
                    type: "string",
                    enum: [
                        TeamCategory.CUBS, // اشبال
                        TeamCategory.BUDS, // براعم
                        TeamCategory.JUNIORS, // ناشئين
                        TeamCategory.YOUTH, // شباب
                        TeamCategory.FIRST_TEAM, // فريق اول
                    ],
                    description: `Team category:
cubs - اشبال
buds - براعم
juniors - ناشئين
youth - شباب
first_team - فريق اول`,
                    example: TeamCategory.FIRST_TEAM,
                },
            },
            required: ["name"],
        },
    } as ApiBodyOptions,

    UPDATE_CLUB_TEAM: {
        description:
            "Data required to update an existing club team along with optional logo and background files",
        required: false,
        schema: {
            type: "object",
            properties: {
                logo: {
                    type: "string",
                    format: "binary",
                    description: "Logo image file (optional)",
                },
                background: {
                    type: "string",
                    format: "binary",
                    description: "Background image file (optional)",
                },
                branch: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                    description: "Branch ID associated with the team.",
                },
                name: {
                    type: "string",
                    example: "Al-Hilal U19",
                    description: "Name of the team.",
                },
                coach: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174002",
                    description: "Coach ID of the team.",
                },
                admin: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174002",
                    description: "Admin ID of the team.",
                },
                subCoaches: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "uuid",
                        example: "123e4567-e89b-12d3-a456-426614174003",
                    },
                    description:
                        "List of sub-coach IDs associated with the team.",
                },
                athletes: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "uuid",
                        example: "123e4567-e89b-12d3-a456-426614174005",
                    },
                    description:
                        "List of athlete IDs associated with the team.",
                },
                gender: {
                    type: "string",
                    enum: [Gender.MALE, Gender.FEMALE],
                    description:
                        "Gender of the team (male - للذكور | female - للإناث)",
                    example: Gender.MALE,
                },
                category: {
                    type: "string",
                    enum: [
                        TeamCategory.CUBS, // اشبال
                        TeamCategory.BUDS, // براعم
                        TeamCategory.JUNIORS, // ناشئين
                        TeamCategory.YOUTH, // شباب
                        TeamCategory.FIRST_TEAM, // فريق اول
                    ],
                    description: `Team category:
cubs - اشبال
buds - براعم
juniors - ناشئين
youth - شباب
first_team - فريق اول`,
                    example: TeamCategory.FIRST_TEAM,
                },
            },
        },
    } as ApiBodyOptions,
};
