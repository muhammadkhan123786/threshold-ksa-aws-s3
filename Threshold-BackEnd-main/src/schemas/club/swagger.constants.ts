export const SWAGGER_TAGS = {
    CLUBS: "Club",
};

export const SWAGGER_OPERATIONS = {
    GET_CLUBS: {
        summary: "Get all clubs",
        description:
            "Fetches a list of all clubs. Optionally filters by search query.",
    },
    GET_CLUB_BY_ID: {
        summary: "Get a single club by ID",
        description: "Fetches a single club by its unique ID.",
    },
    CREATE_CLUB: {
        summary: "Create a new club",
        description:
            "Creates a new club in the system, optionally with an avatar.",
    },
    UPDATE_CLUB: {
        summary: "Update a club's details",
        description:
            "Updates details of an existing club, optionally updating its avatar.",
    },
    DELETE_CLUB: {
        summary: "Delete a club",
        description: "Deletes a club by its unique ID.",
    },
};

export const SWAGGER_PARAMS = {
    ID_PARAM: {
        name: "id",
        type: String,
        description: "Unique ID of the club",
        example: "club-123",
    },
    SEARCH_QUERY: {
        name: "search",
        type: String,
        required: false,
        description: "Filter clubs by name or other attributes",
    },
};

export const SWAGGER_RESPONSES = {
    GET_CLUBS_SUCCESS: {
        status: 200,
        description: "List of all clubs",
        schema: {
            example: [
                {
                    id: "club-123",
                    name: "El Hilal Club",
                    registrationNumber: "123456789",
                    contactNumber: "+01032797524",
                    address: "99, ElZahara, Gada",
                    avatarUrl: "https://s3.bucket.com/club-avatar.png",
                    createdAt: "2024-12-14T00:00:00.000Z",
                },
            ],
        },
    },
    GET_CLUB_BY_ID_SUCCESS: {
        status: 200,
        description: "Club details",
        schema: {
            example: {
                id: "club-123",
                name: "El Hilal Club",
                registrationNumber: "123456789",
                contactNumber: "+01032797524",
                address: "99, ElZahara, Gada",
                avatarUrl: "https://s3.bucket.com/club-avatar.png",
                createdAt: "2024-12-14T00:00:00.000Z",
            },
        },
    },
    CREATE_CLUB_SUCCESS: {
        status: 201,
        description: "Club successfully created",
        schema: {
            example: {
                id: "club-123",
                name: "El Hilal Club",
                registrationNumber: "123456789",
                contactNumber: "+01032797524",
                address: "99, ElZahara, Gada",
                avatarUrl: "https://s3.bucket.com/club-avatar.png",
                createdAt: "2024-12-14T00:00:00.000Z",
            },
        },
    },
    UPDATE_CLUB_SUCCESS: {
        status: 200,
        description: "Club successfully updated",
        schema: {
            example: {
                id: "club-123",
                name: "Updated Club Name",
                registrationNumber: "987654321",
                contactNumber: "+01098765432",
                address: "Updated Address",
                avatarUrl: "https://s3.bucket.com/updated-avatar.png",
                updatedAt: "2024-12-14T00:00:00.000Z",
            },
        },
    },
    DELETE_CLUB_SUCCESS: {
        status: 204,
        description: "Club successfully deleted",
    },
};

export const SWAGGER_BODIES = {
    CREATE_CLUB: {
        description: "Form data to create a new club",
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "El Hilal Club" },
                registrationNumber: { type: "string", example: "123456789" },
                contactNumber: { type: "string", example: "+01032797524" },
                address: { type: "string", example: "99, ElZahara, Gada" },
                avatar: {
                    type: "string",
                    format: "binary",
                    description: "Optional avatar image",
                },
            },
        },
    },
    UPDATE_CLUB: {
        description: "Form data to update an existing club",
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "Updated Club Name" },
                registrationNumber: { type: "string", example: "987654321" },
                contactNumber: { type: "string", example: "+01098765432" },
                address: { type: "string", example: "Updated Address" },
                avatar: {
                    type: "string",
                    format: "binary",
                    description: "Optional updated avatar image",
                },
            },
        },
    },
};
