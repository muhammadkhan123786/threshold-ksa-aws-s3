import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from "@nestjs/swagger";
import { WorkType } from "src/entities/workHistory.entity";

export const SWAGGER_WORK_HISTORY = {
    GET_WORK_HISTORY_SUCCESS: {
        status: 200,
        description: "Work history retrieved successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Work history retrieved successfully",
                },
                payload: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        example:
                                            "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
                                    },
                                    companyName: {
                                        type: "string",
                                        example: "Sports Academy Barcelona",
                                    },
                                    position: {
                                        type: "string",
                                        example: "Head Coach",
                                    },
                                    description: {
                                        type: "string",
                                        example:
                                            "Managed youth development program for ages 10-16",
                                    },
                                    startDate: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2018-01-01T00:00:00.000Z",
                                    },
                                    endDate: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2020-12-31T00:00:00.000Z",
                                    },
                                    location: {
                                        type: "string",
                                        example: "Barcelona, Spain",
                                    },
                                    workType: {
                                        type: "string",
                                        enum: Object.values(WorkType),
                                        example: WorkType.FULL_TIME,
                                    },
                                    responsibilities: {
                                        type: "string",
                                        example:
                                            "Training sessions, tactical planning, player development",
                                    },
                                    achievements: {
                                        type: "string",
                                        example:
                                            "Won regional championship in 2019, improved team performance by 35%",
                                    },
                                    createdAt: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2023-05-15T10:00:00.000Z",
                                    },
                                    updatedAt: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2023-05-15T10:00:00.000Z",
                                    },
                                    deletedAt: {
                                        type: "string",
                                        format: "date-time",
                                        example: null,
                                    },
                                },
                            },
                        },
                        meta: {
                            type: "object",
                            properties: {
                                page: { type: "number", example: 1 },
                                limit: { type: "number", example: 10 },
                                total: { type: "number", example: 20 },
                                totalPages: { type: "number", example: 2 },
                            },
                        },
                    },
                },
            },
        },
    },

    GET_WORK_HISTORY_BY_ID_SUCCESS: {
        status: 200,
        description: "Work history entry retrieved successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Work history retrieved successfully",
                },
                payload: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
                        },
                        companyName: {
                            type: "string",
                            example: "Sports Academy Barcelona",
                        },
                        position: { type: "string", example: "Head Coach" },
                        description: {
                            type: "string",
                            example:
                                "Managed youth development program for ages 10-16",
                        },
                        startDate: {
                            type: "string",
                            format: "date-time",
                            example: "2018-01-01T00:00:00.000Z",
                        },
                        endDate: {
                            type: "string",
                            format: "date-time",
                            example: "2020-12-31T00:00:00.000Z",
                        },
                        location: {
                            type: "string",
                            example: "Barcelona, Spain",
                        },
                        workType: {
                            type: "string",
                            enum: Object.values(WorkType),
                            example: WorkType.FULL_TIME,
                        },
                        responsibilities: {
                            type: "string",
                            example:
                                "Training sessions, tactical planning, player development",
                        },
                        achievements: {
                            type: "string",
                            example:
                                "Won regional championship in 2019, improved team performance by 35%",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T10:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T10:00:00.000Z",
                        },
                        deletedAt: {
                            type: "string",
                            format: "date-time",
                            example: null,
                        },
                    },
                },
            },
        },
    },

    CREATE_WORK_HISTORY_SUCCESS: {
        status: 201,
        description: "Work history created successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 201 },
                message: {
                    type: "string",
                    example: "Work history created successfully",
                },
                payload: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
                        },
                        companyName: {
                            type: "string",
                            example: "Sports Academy Barcelona",
                        },
                        position: { type: "string", example: "Head Coach" },
                        description: {
                            type: "string",
                            example:
                                "Managed youth development program for ages 10-16",
                        },
                        startDate: {
                            type: "string",
                            format: "date-time",
                            example: "2018-01-01T00:00:00.000Z",
                        },
                        endDate: {
                            type: "string",
                            format: "date-time",
                            example: "2020-12-31T00:00:00.000Z",
                        },
                        location: {
                            type: "string",
                            example: "Barcelona, Spain",
                        },
                        workType: {
                            type: "string",
                            enum: Object.values(WorkType),
                            example: WorkType.FULL_TIME,
                        },
                        responsibilities: {
                            type: "string",
                            example:
                                "Training sessions, tactical planning, player development",
                        },
                        achievements: {
                            type: "string",
                            example:
                                "Won regional championship in 2019, improved team performance by 35%",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T10:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T10:00:00.000Z",
                        },
                    },
                },
            },
        },
    },

    UPDATE_WORK_HISTORY_SUCCESS: {
        status: 200,
        description: "Work history updated successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Work history updated successfully",
                },
                payload: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
                        },
                        companyName: {
                            type: "string",
                            example: "Sports Academy Barcelona",
                        },
                        position: { type: "string", example: "Senior Coach" },
                        description: {
                            type: "string",
                            example:
                                "Led youth development program for ages 10-16",
                        },
                        startDate: {
                            type: "string",
                            format: "date-time",
                            example: "2018-01-01T00:00:00.000Z",
                        },
                        endDate: {
                            type: "string",
                            format: "date-time",
                            example: "2021-06-30T00:00:00.000Z",
                        },
                        location: {
                            type: "string",
                            example: "Barcelona, Spain",
                        },
                        workType: {
                            type: "string",
                            enum: Object.values(WorkType),
                            example: WorkType.FULL_TIME,
                        },
                        responsibilities: {
                            type: "string",
                            example:
                                "Training sessions, tactical planning, player development, staff management",
                        },
                        achievements: {
                            type: "string",
                            example:
                                "Won regional championship in 2019 and 2020, improved team performance by 40%",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-15T10:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-05-16T14:30:00.000Z",
                        },
                    },
                },
            },
        },
    },

    DELETE_WORK_HISTORY_SUCCESS: {
        status: 200,
        description: "Work history deleted successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Work history deleted successfully",
                },
                payload: { type: "null", example: null },
            },
        },
    },

    ERROR_RESPONSE: {
        status: 400,
        description: "Bad Request",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "An error occurred" },
                error: { type: "string", example: "Error details" },
            },
        },
    },

    NOT_FOUND_RESPONSE: {
        status: 404,
        description: "Not Found",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Work history with ID abc123 not found",
                },
                error: { type: "string", example: "Not Found" },
            },
        },
    },
};

export function ApiGetWorkHistory() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Get work history records" })(
            target,
            key,
            descriptor
        );
        ApiQuery({
            name: "page",
            description: "Page number",
            type: "number",
            required: false,
        })(target, key, descriptor);
        ApiQuery({
            name: "limit",
            description: "Items per page",
            type: "number",
            required: false,
        })(target, key, descriptor);
        ApiResponse(SWAGGER_WORK_HISTORY.GET_WORK_HISTORY_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}

export function ApiGetWorkHistoryById() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Get a work history entry by ID" })(
            target,
            key,
            descriptor
        );
        ApiParam({
            name: "id",
            description: "Work History ID",
            type: "string",
        })(target, key, descriptor);
        ApiResponse(SWAGGER_WORK_HISTORY.GET_WORK_HISTORY_BY_ID_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.NOT_FOUND_RESPONSE)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}

export function ApiCreateWorkHistory() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Create a work history entry" })(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.CREATE_WORK_HISTORY_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}

export function ApiUpdateWorkHistory() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Update a work history entry" })(
            target,
            key,
            descriptor
        );
        ApiParam({
            name: "id",
            description: "Work History ID",
            type: "string",
        })(target, key, descriptor);
        ApiResponse(SWAGGER_WORK_HISTORY.UPDATE_WORK_HISTORY_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.NOT_FOUND_RESPONSE)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}

export function ApiDeleteWorkHistory() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Delete a work history entry" })(
            target,
            key,
            descriptor
        );
        ApiParam({
            name: "id",
            description: "Work History ID",
            type: "string",
        })(target, key, descriptor);
        ApiResponse(SWAGGER_WORK_HISTORY.DELETE_WORK_HISTORY_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.NOT_FOUND_RESPONSE)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_WORK_HISTORY.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}
