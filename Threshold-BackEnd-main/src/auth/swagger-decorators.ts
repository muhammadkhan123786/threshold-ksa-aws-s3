import { applyDecorators } from "@nestjs/common";
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

export function CompanyRegisterSwagger() {
    return applyDecorators(
        ApiTags("Auth"),
        ApiOperation({
            summary: "Register a new company admin",
            description:
                "Registers a new company admin for either an academy or club. Includes optional avatar upload.",
        }),
        ApiConsumes("multipart/form-data"),
        ApiBody({
            description:
                "Company registration details with optional avatar upload.",
            schema: {
                type: "object",
                properties: {
                    username: {
                        type: "string",
                        description: "The username for the new company admin.",
                        example: "john_doe",
                    },
                    email: {
                        type: "string",
                        description: "A valid email address.",
                        example: "example@example.com",
                    },
                    password: {
                        type: "string",
                        description:
                            "A secure password containing at least 6 characters.",
                        example: "s5Rsa2?#sd1154",
                    },
                    contactNumber: {
                        type: "string",
                        description:
                            "A valid contact number starting with '05' followed by 8 digits.",
                        example: "0551234567",
                    },
                    registrationNumber: {
                        type: "string",
                        description:
                            "A unique 10-digit registration number for the academy.",
                        example: "1234567890",
                    },
                    name: {
                        type: "string",
                        description: "The official name of the academy.",
                        example: "Elite Sports Academy",
                    },
                    organizationType: {
                        type: "string",
                        enum: ["academy", "club"],
                        description:
                            "The organization type associated with the user.",
                        example: "academy",
                    },
                    address: {
                        type: "string",
                        description:
                            "The address associated with the user or academy.",
                        example: "99, ElZahara, Gada",
                    },
                    avatar: {
                        type: "string",
                        format: "binary",
                        description: "Optional avatar image",
                    },
                    phoneNumbers: {
                        type: "array",
                        items: {
                            type: "string",
                            description:
                                "Each phone number must start with '05' followed by 8 digits.",
                            example: "0598765432",
                        },
                        description:
                            "A list of additional phone numbers. Each must start with '05' followed by 8 digits.",
                        example: ["0598765432", "0587654321"],
                    },
                },
                required: [
                    "username",
                    "email",
                    "password",
                    "contactNumber",
                    "registrationNumber",
                    "name",
                    "organizationType",
                ],
            },
        }),
        ApiResponse({
            status: 201,
            description: "Company admin successfully created.",
            schema: {
                type: "object",
                example: {
                    message:
                        "Account created successfully. Please contact the administrator for approval and activation.",
                    payload: {
                        admin: {
                            message: "User created successfully.",
                            payload: {
                                username: "22john_doe32131232213",
                                email: "exampl2e@examp321321le.com",
                                role: "academy-admin",
                                academy: {
                                    id: "ad609913-fa52-4d39-8553-c0100689917c",
                                    avatarUrl: null,
                                    address: null,
                                    updatedAt: "2025-01-07T11:42:43.736Z",
                                    createdAt: "2025-01-07T11:42:43.736Z",
                                    contactNumber: "0551234567",
                                    registrationNumber: "1234567890",
                                    name: "Elite Sports Academy",
                                    isMultiBranch: false,
                                    type: "academy",
                                    phoneNumbers: ["0598765432", "0587654321"],
                                },
                                phoneNumber: null,
                                language: "english",
                                avatar: "",
                                notification: false,
                                id: "408ed893-8a1d-48f6-9976-1b77aa729904",
                                updatedAt: "2025-01-07T11:42:43.987Z",
                                createdAt: "2025-01-07T11:42:43.987Z",
                                isApproved: false,
                            },
                            status: 201,
                        },
                        academy: {
                            message: "Academy has been created successfully",
                            payload: {
                                avatarUrl: null,
                                contactNumber: "0551234567",
                                registrationNumber: "1234567890",
                                name: "Elite Sports Academy",
                                phoneNumbers: ["0598765432", "0587654321"],
                                address: null,
                                id: "ad609913-fa52-4d39-8553-c0100689917c",
                                updatedAt: "2025-01-07T11:42:43.736Z",
                                createdAt: "2025-01-07T11:42:43.736Z",
                                isMultiBranch: false,
                                type: "academy",
                            },
                            status: 201,
                        },
                    },
                    status: 200,
                    extra: {},
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Validation errors or bad request.",
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error.",
        })
    );
}
