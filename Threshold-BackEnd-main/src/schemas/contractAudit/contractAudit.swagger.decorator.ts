import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from "@nestjs/swagger";

// List the available audit actions since the enum import is failing
const ContractAuditActionValues = [
    "CREATED",
    "UPDATED",
    "RENEWED",
    "TERMINATED",
    "EXPIRED",
];

export const SWAGGER_CONTRACT_AUDIT = {
    GET_AUDIT_HISTORY_SUCCESS: {
        status: 200,
        description: "Contract audit history retrieved successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Contract audit history retrieved successfully",
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
                                    action: {
                                        type: "string",
                                        enum: ContractAuditActionValues,
                                        example: "CREATED",
                                    },
                                    description: {
                                        type: "string",
                                        example:
                                            "Initial contract created for player John Doe",
                                    },
                                    previousValues: {
                                        type: "object",
                                        example: null,
                                    },
                                    newValues: {
                                        type: "object",
                                        example: {
                                            startDate:
                                                "2023-01-01T00:00:00.000Z",
                                            endDate: "2024-01-01T00:00:00.000Z",
                                            salary: 50000,
                                            bonuses: 5000,
                                            contractType: "FULL_TIME",
                                        },
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
                                    contract: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                example:
                                                    "b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6",
                                            },
                                        },
                                    },
                                    user: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                example:
                                                    "c1d2e3f4-g5h6-7i8j-9k0l-m1n2o3p4q5r6",
                                            },
                                            firstName: {
                                                type: "string",
                                                example: "Admin",
                                            },
                                            lastName: {
                                                type: "string",
                                                example: "User",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        meta: {
                            type: "object",
                            properties: {
                                page: { type: "number", example: 1 },
                                limit: { type: "number", example: 10 },
                                total: { type: "number", example: 15 },
                                totalPages: { type: "number", example: 2 },
                            },
                        },
                    },
                },
            },
        },
    },

    GET_AUDIT_ENTRY_SUCCESS: {
        status: 200,
        description: "Contract audit entry retrieved successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Contract audit entry retrieved successfully",
                },
                payload: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
                        },
                        action: {
                            type: "string",
                            enum: ContractAuditActionValues,
                            example: "UPDATED",
                        },
                        description: {
                            type: "string",
                            example: "Updated salary and bonus terms",
                        },
                        previousValues: {
                            type: "object",
                            example: {
                                salary: 50000,
                                bonuses: 5000,
                            },
                        },
                        newValues: {
                            type: "object",
                            example: {
                                salary: 55000,
                                bonuses: 7000,
                            },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-06-15T10:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-06-15T10:00:00.000Z",
                        },
                        contract: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6",
                                },
                            },
                        },
                        user: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "c1d2e3f4-g5h6-7i8j-9k0l-m1n2o3p4q5r6",
                                },
                                firstName: { type: "string", example: "Admin" },
                                lastName: { type: "string", example: "User" },
                            },
                        },
                    },
                },
            },
        },
    },

    CREATE_AUDIT_ENTRY_SUCCESS: {
        status: 201,
        description: "Contract audit entry created successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 201 },
                message: {
                    type: "string",
                    example: "Contract audit entry created successfully",
                },
                payload: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
                        },
                        action: {
                            type: "string",
                            enum: ContractAuditActionValues,
                            example: "RENEWED",
                        },
                        description: {
                            type: "string",
                            example:
                                "Contract renewed for another year with increased terms",
                        },
                        previousValues: {
                            type: "object",
                            example: {
                                endDate: "2024-01-01T00:00:00.000Z",
                                salary: 55000,
                                bonuses: 7000,
                            },
                        },
                        newValues: {
                            type: "object",
                            example: {
                                startDate: "2024-01-01T00:00:00.000Z",
                                endDate: "2025-01-01T00:00:00.000Z",
                                salary: 60000,
                                bonuses: 8000,
                            },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-12-15T10:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2023-12-15T10:00:00.000Z",
                        },
                        contract: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6",
                                },
                            },
                        },
                        user: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "c1d2e3f4-g5h6-7i8j-9k0l-m1n2o3p4q5r6",
                                },
                                firstName: { type: "string", example: "Admin" },
                                lastName: { type: "string", example: "User" },
                            },
                        },
                    },
                },
            },
        },
    },

    COMPARE_VERSIONS_SUCCESS: {
        status: 200,
        description: "Contract versions compared successfully",
        schema: {
            type: "object",
            properties: {
                status: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "Contract versions compared successfully",
                },
                payload: {
                    type: "object",
                    properties: {
                        version1: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
                                },
                                action: {
                                    type: "string",
                                    example: "CREATED",
                                },
                                timestamp: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2023-05-15T10:00:00.000Z",
                                },
                                user: {
                                    type: "string",
                                    example: "Admin User",
                                },
                                values: {
                                    type: "object",
                                    example: {
                                        startDate: "2023-01-01T00:00:00.000Z",
                                        endDate: "2024-01-01T00:00:00.000Z",
                                        salary: 50000,
                                        bonuses: 5000,
                                        contractType: "FULL_TIME",
                                    },
                                },
                            },
                        },
                        version2: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "d1e2f3g4-h5i6-7j8k-9l0m-n1o2p3q4r5s6",
                                },
                                action: {
                                    type: "string",
                                    example: "UPDATED",
                                },
                                timestamp: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2023-06-15T10:00:00.000Z",
                                },
                                user: {
                                    type: "string",
                                    example: "Admin User",
                                },
                                values: {
                                    type: "object",
                                    example: {
                                        startDate: "2023-01-01T00:00:00.000Z",
                                        endDate: "2024-01-01T00:00:00.000Z",
                                        salary: 55000,
                                        bonuses: 7000,
                                        contractType: "FULL_TIME",
                                    },
                                },
                            },
                        },
                        differences: {
                            type: "object",
                            properties: {
                                salary: {
                                    type: "object",
                                    properties: {
                                        from: {
                                            type: "number",
                                            example: 50000,
                                        },
                                        to: { type: "number", example: 55000 },
                                    },
                                },
                                bonuses: {
                                    type: "object",
                                    properties: {
                                        from: { type: "number", example: 5000 },
                                        to: { type: "number", example: 7000 },
                                    },
                                },
                            },
                        },
                    },
                },
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
                    example: "Contract audit with ID abc123 not found",
                },
                error: { type: "string", example: "Not Found" },
            },
        },
    },
};

export function ApiGetAuditHistory() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Get audit history for a contract" })(
            target,
            key,
            descriptor
        );
        ApiParam({
            name: "contractId",
            description: "Contract ID",
            type: "string",
        })(target, key, descriptor);
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
        ApiResponse(SWAGGER_CONTRACT_AUDIT.GET_AUDIT_HISTORY_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_CONTRACT_AUDIT.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}

export function ApiGetAuditEntryById() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Get a contract audit entry by ID" })(
            target,
            key,
            descriptor
        );
        ApiParam({
            name: "auditId",
            description: "Audit Entry ID",
            type: "string",
        })(target, key, descriptor);
        ApiResponse(SWAGGER_CONTRACT_AUDIT.GET_AUDIT_ENTRY_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_CONTRACT_AUDIT.NOT_FOUND_RESPONSE)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_CONTRACT_AUDIT.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}

export function ApiCreateAuditEntry() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Create an audit entry for a contract" })(
            target,
            key,
            descriptor
        );
        ApiParam({
            name: "contractId",
            description: "Contract ID",
            type: "string",
        })(target, key, descriptor);
        ApiResponse(SWAGGER_CONTRACT_AUDIT.CREATE_AUDIT_ENTRY_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_CONTRACT_AUDIT.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}

export function ApiCompareContractVersions() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        ApiOperation({ summary: "Compare contract versions" })(
            target,
            key,
            descriptor
        );
        ApiParam({
            name: "contractId",
            description: "Contract ID",
            type: "string",
        })(target, key, descriptor);
        ApiQuery({
            name: "auditId1",
            description: "First Audit ID to compare",
            type: "string",
            required: true,
        })(target, key, descriptor);
        ApiQuery({
            name: "auditId2",
            description: "Second Audit ID to compare",
            type: "string",
            required: false,
        })(target, key, descriptor);
        ApiResponse(SWAGGER_CONTRACT_AUDIT.COMPARE_VERSIONS_SUCCESS)(
            target,
            key,
            descriptor
        );
        ApiResponse(SWAGGER_CONTRACT_AUDIT.ERROR_RESPONSE)(
            target,
            key,
            descriptor
        );
        return descriptor;
    };
}
