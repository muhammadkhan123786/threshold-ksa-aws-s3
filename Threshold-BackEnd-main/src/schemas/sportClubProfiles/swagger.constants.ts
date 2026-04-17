import {
    ApiResponseOptions,
    ApiParamOptions,
    ApiQueryOptions,
    ApiBodyOptions,
} from "@nestjs/swagger";

export const ApiResponseExamples = {
    GET_ALL: {
        status: 200,
        description: "List of all sport club profiles",
        schema: {
            example: [
                {
                    id: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
                    name: "Elite Sports Club",
                    avatarUrl: "https://example.com/avatar.jpg",
                    active: true,
                    createdAt: "2024-12-13T00:00:00.000Z",
                    updatedAt: "2024-12-13T00:00:00.000Z",
                },
            ],
        },
    } as ApiResponseOptions,
    GET_ONE: {
        status: 200,
        description: "Sport club profile details",
        schema: {
            example: {
                id: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
                name: "Elite Sports Club",
                avatarUrl: "https://example.com/avatar.jpg",
                active: true,
                createdAt: "2024-12-13T00:00:00.000Z",
                updatedAt: "2024-12-13T00:00:00.000Z",
            },
        },
    } as ApiResponseOptions,
    CREATED: {
        status: 201,
        description: "Sport club profile successfully created",
        schema: {
            example: {
                id: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
                name: "Elite Sports Club",
                avatarUrl: "https://example.com/avatar.jpg",
                active: true,
                createdAt: "2024-12-13T00:00:00.000Z",
                updatedAt: "2024-12-13T00:00:00.000Z",
            },
        },
    } as ApiResponseOptions,
    UPDATED: {
        status: 200,
        description: "Sport club profile successfully updated",
        schema: {
            example: {
                id: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
                name: "Elite Sports Club Updated",
                avatarUrl: "https://example.com/avatar-updated.jpg",
                active: false,
                createdAt: "2024-12-13T00:00:00.000Z",
                updatedAt: "2024-12-14T00:00:00.000Z",
            },
        },
    } as ApiResponseOptions,
    DELETED: {
        status: 204,
        description: "Sport club profile successfully deleted",
    } as ApiResponseOptions,
};

export const ApiParams = {
    ID: {
        name: "id",
        type: String,
        description: "Unique ID of the sport club profile",
        example: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
    } as ApiParamOptions,
    CLUB_ID: {
        name: "clubId",
        description: "The unique ID of the sport club",
        required: true,
        type: String,
        example: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
    },
};

export const ApiQueries = {
    ACADEMY_ID: {
        name: "academyId",
        type: String,
        required: false,
        description: "Filter sport club profiles by academy ID",
    } as ApiQueryOptions,
    INCLUDE_INACTIVE: {
        name: "includeInactive",
        type: Boolean,
        required: false,
        description: "Whether to include inactive sport profiles",
        example: false,
    } as ApiQueryOptions,
};

export const ApiBodies = {
    CREATE: {
        description: "Data to create a new sport club profile",
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "Elite Sports Club" },
                academyId: { type: "string", example: "academy-123" },
                avatar: { type: "string", format: "binary" },
                active: { type: "boolean", example: true, default: true },
                sport: {
                    type: "string",
                    enum: [
                        "football",
                        "handball",
                        "netball",
                        "basketball",
                        "volleyball",
                        "tennis",
                        "swimming",
                        "gymnastics",
                        "cricket",
                        "karate",
                        "judo",
                        "boxing",
                        "muay",
                        "running",
                        "athletics",
                        "taekwondo",
                        "padel",
                        "DEFAULT",
                    ],
                    example: "football",
                    description: "The sport type of the club",
                },
            },
        },
    } as ApiBodyOptions,

    UPDATE: {
        description: "Data to update the sport club profile",
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "Elite Sports Club Updated" },
                academyId: { type: "string", example: "academy-123" },
                avatar: { type: "string", format: "binary" },
                active: { type: "boolean", example: false },
                sport: {
                    type: "string",
                    enum: [
                        "football",
                        "handball",
                        "netball",
                        "basketball",
                        "volleyball",
                        "tennis",
                        "swimming",
                        "gymnastics",
                        "cricket",
                        "karate",
                        "judo",
                        "boxing",
                        "muay",
                        "running",
                        "athletics",
                        "taekwondo",
                        "padel",
                        "DEFAULT",
                    ],
                    example: "basketball",
                    description: "Updated sport type of the club",
                },
            },
        },
    } as ApiBodyOptions,
};
