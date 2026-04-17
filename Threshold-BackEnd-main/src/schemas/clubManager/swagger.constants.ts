import { applyDecorators } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
    ApiConsumes,
    ApiBody,
} from "@nestjs/swagger";

export const SwaggerManagerTags = () => ApiTags("Managers");

export const SwaggerCreateManager = () =>
    applyDecorators(
        ApiOperation({
            summary: "Create a new manager",
            description:
                "Allows creating a new manager with personal, professional, and contract-related information, including support for avatar uploads.",
        }),
        ApiConsumes("multipart/form-data"),
        ApiBody({
            description: "Payload for creating a new manager",
            schema: {
                type: "object",
                properties: {
                    firstName: { type: "string", example: "John" },
                    lastName: { type: "string", example: "Doe" },
                    nationality: {
                        type: "string",
                        example: "Saudi Arabia",
                        required: [],
                    },
                    gender: {
                        type: "string",
                        enum: ["male", "female"],
                        example: "male",
                    },
                    birthday: {
                        type: "string",
                        format: "date",
                        example: "1990-01-01",
                    },
                    phone: { type: "string", example: "+966500000000" },
                    emergencyPhone: {
                        type: "string",
                        example: "+966500000001",
                    },
                    relationship: { type: "string", example: "Brother" },
                    educationalLevel: { 
                        type: "string", 
                        example: "Bachelor's Degree",
                        description: "The level of education achieved"
                    },
                    experience: { type: "number", example: 5 },
                    nationalId: { type: "string", example: "ID123456789" },
                    nationalIdExpiration: {
                        type: "string",
                        format: "date",
                        example: "2030-01-01",
                    },
                    position: {
                        type: "string",
                        enum: [
                            "club-executive-manager",
                            "club-technical-director",
                            "club-sport-profile-manager",
                        ],
                        example: "club-executive-manager",
                    },
                    joinDate: {
                        type: "string",
                        format: "date",
                        example: "2024-05-01",
                    },
                    contractDuration: {
                        type: "string",
                        enum: [
                            "3_months",
                            "6_months",
                            "1_year",
                            "2_years",
                            "Unlimited",
                        ],
                        example: "1_year",
                    },
                    contractType: {
                        type: "string",
                        enum: [
                            "Permanent",
                            "Temporary",
                            "FULL_TIME",
                            "Part-Time",
                            "Seasonal",
                            "Apprenticeship",
                            "Flexible",
                            "Consultancy",
                        ],
                        example: "FULL_TIME",
                    },
                    contractJoinDate: {
                        type: "string",
                        format: "date",
                        example: "2024-05-01",
                    },
                    avatar: { type: "string", format: "binary" },
                    contractFile: { type: "string", format: "binary" },

                    username: { type: "string", example: "johndoe" },
                    email: { type: "string", example: "johndoe@example.com" },
                    password: { type: "string", example: "Password@123" },
                    country: { type: "string", example: "USA" },
                    schoolName: {
                        type: "string",
                        example: "Harvard University",
                    },
                    languages: {
                        type: "array",
                        items: { type: "string" },
                        example: ["English", "Arabic", "العربية", "الإنجليزية"],
                        description: "Languages spoken by the manager (اللغات التي يتحدثها المدير)"
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Manager created successfully",
            schema: {
                example: {
                    success: true,
                    message: "Manager created successfully",
                    data: {
                        id: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
                        firstName: "John",
                        lastName: "Doe",
                        nationality: "sa",
                        gender: "male",
                        birthday: "1990-01-01",
                        phone: "+966500000000",
                        emergencyPhone: "+966500000001",
                        relationship: "Brother",
                        educationalLevel: "Bachelor's Degree",
                        experience: 5,
                        nationalId: "ID123456789",
                        nationalIdExpiration: "2030-01-01",
                        branch: {
                            id: "6a5f0a51-a12b-4e27-8b5c-33dcc82f69db",
                            name: "Main Branch",
                        },
                        position: "club-executive-manager",
                        joinDate: "2024-05-01",
                        contract: {
                            type: "FULL_TIME",
                            duration: "2 years",
                            startDate: "2024-05-01",
                            endDate: "2026-05-01",
                            benefits: "Health Insurance, Accommodation, Bonus",
                            renewalTerms:
                                "Renewable every 2 years based on performance",
                        },
                        avatar: "https://s3.amazonaws.com/yourbucket/avatar.png",
                        username: "johndoe",
                        email: "johndoe@example.com",
                        languages: ["English", "Arabic"],
                    },
                },
            },
        }),
        ApiResponse({ status: 400, description: "Validation errors" }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );

export const SwaggerUpdateManager = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update a manager's details",
            description: "Updates manager details, such as avatar or position.",
        }),
        ApiParam({
            name: "managerId",
            description: "ID of the manager to update",
            example: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
        }),
        ApiConsumes("multipart/form-data"),
        ApiBody({
            description: "Manager update payload",
            schema: {
                type: "object",
                properties: {
                    firstName: { type: "string", example: "Jane" },
                    lastName: { type: "string", example: "Smith" },
                    position: {
                        type: "string",
                        enum: [
                            "club-executive-manager",
                            "club-technical-director",
                            "club-sport-profile-manager",
                        ],
                        example: "club-technical-director",
                    },
                    avatar: { type: "string", format: "binary" },
                    country: { type: "string", example: "USA" },
                    schoolName: {
                        type: "string",
                        example: "Harvard University",
                    },
                    educationalLevel: { 
                        type: "string", 
                        example: "Bachelor's Degree",
                        description: "The level of education achieved"
                    },
                    languages: {
                        type: "array",
                        items: { type: "string" },
                        example: ["English", "Arabic", "العربية", "الإنجليزية"],
                        description: "Languages spoken by the manager (اللغات التي يتحدثها المدير)"
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Manager updated successfully",
            schema: {
                example: {
                    success: true,
                    message: "Manager updated successfully",
                    data: {
                        id: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
                        firstName: "Jane",
                        lastName: "Smith",
                        position: "club-technical-director",
                        avatar: "https://example.com/avatar-updated.jpg",
                        educationalLevel: "Bachelor's Degree",
                        languages: ["English", "Arabic"],
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Manager not found" }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );

export const SwaggerDeleteManager = () =>
    applyDecorators(
        ApiOperation({
            summary: "Delete a manager",
            description: "Deletes a manager by ID",
        }),
        ApiParam({
            name: "managerId",
            description: "ID of the manager to delete",
            example: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
        }),
        ApiResponse({
            status: 200,
            description: "Manager deleted successfully",
            schema: {
                example: {
                    success: true,
                    message: "Manager deleted successfully",
                },
            },
        }),
        ApiResponse({ status: 404, description: "Manager not found" }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );
export const SwaggerGetManagers = () =>
    applyDecorators(
        ApiOperation({
            summary: "Retrieve a list of managers",
            description:
                "Fetches managers by club ID, optionally filtering by branch ID and supports pagination.",
        }),
        ApiParam({
            name: "clubId",
            type: String,
            required: true,
            description: "ID of the club (required as a path parameter)",
            example: "f2d1a67b-d1ef-4d1a-8c7a-92bb1c1e401d",
        }),
        ApiQuery({
            name: "branchId",
            type: String,
            required: false,
            description: "ID of the branch (optional query parameter)",
            example: "a3b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        }),
        ApiQuery({
            name: "page",
            type: Number,
            required: false,
            description: "Page number for pagination (default is 1)",
            example: 1,
        }),
        ApiQuery({
            name: "limit",
            type: Number,
            required: false,
            description:
                "Number of items per page for pagination (default is 10)",
            example: 10,
        }),
        ApiResponse({
            status: 200,
            description: "Managers retrieved successfully",
            schema: {
                example: {
                    success: true,
                    message: "Managers retrieved successfully",
                    data: [
                        {
                            id: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
                            firstName: "Jane",
                            lastName: "Doe",
                            clubId: "1a7dc0e8-90a9-4cf0-bd1b-7dc6c0fe736a",
                            position: "club-executive-manager",
                        },
                    ],
                    total: 12,
                    page: 1,
                    limit: 10,
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Validation error or missing required fields",
            schema: {
                example: {
                    success: false,
                    message: "Club ID is required",
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error",
            schema: {
                example: {
                    success: false,
                    message: "An error occurred while retrieving managers",
                    error: "Internal server error stack trace",
                },
            },
        })
    );
export const SwaggerGetManagerById = () =>
    applyDecorators(
        ApiOperation({
            summary: "Retrieve manager details by ID",
            description: "Fetches details of a specific manager by ID",
        }),
        ApiParam({
            name: "managerId",
            type: String,
            description: "Unique manager identifier",
            example: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
        }),
        ApiResponse({
            status: 200,
            description: "Manager details retrieved",
            schema: {
                example: {
                    success: true,
                    message: "Manager retrieved successfully",
                    data: {
                        id: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
                        firstName: "Jane",
                        lastName: "Doe",
                        clubId: "1a7dc0e8-90a9-4cf0-bd1b-7dc6c0fe736a",
                        position: "club-executive-manager",
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Manager not found" }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );

export const SwaggerGetPersonalInformation = () =>
    applyDecorators(
        ApiOperation({
            summary: "Retrieve personal information for a manager",
            description:
                "Fetches personal information of a specific manager by ID",
        }),
        ApiParam({
            name: "managerId",
            type: String,
            description: "Unique manager identifier",
            example: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
        }),
        ApiResponse({
            status: 200,
            description: "Personal information retrieved successfully",
            schema: {
                example: {
                    success: true,
                    message: "Personal information fetched successfully",
                    data: {
                        id: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
                        firstName: "Jane",
                        lastName: "Doe",
                        // other fields...
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Manager not found" }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );

export const SwaggerUpdatePersonalInformation = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update personal information for a manager",
            description:
                "Updates personal information of a specific manager by ID",
        }),
        ApiParam({
            name: "managerId",
            type: String,
            description: "Unique manager identifier",
            example: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
        }),
        ApiConsumes("multipart/form-data"),
        ApiBody({
            description: "Manager personal information update payload",
            schema: {
                type: "object",
                properties: {
                    firstName: { type: "string", example: "Jane" },
                    lastName: { type: "string", example: "Smith" },
                    // other fields...
                    avatar: { type: "string", format: "binary" },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Personal information updated successfully",
            schema: {
                example: {
                    success: true,
                    message: "Personal information updated successfully",
                    data: {
                        id: "c36b94e5-66cf-4bfd-9249-b085966f3f49",
                        firstName: "Jane",
                        lastName: "Smith",
                        // other fields...
                    },
                },
            },
        }),
        ApiResponse({ status: 404, description: "Manager not found" }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );

// Repeat similar decorators for contact details, medical history, documents, medical files, and bank details.
