import { ApiBodyOptions, ApiResponseOptions } from "@nestjs/swagger";

export const SWAGGER_CONTRACT_CREATE: ApiBodyOptions = {
    description:
        'Create a new contract. Provide contract details and upload the PDF file in the "contractFile" field.',
    required: true,
    schema: {
        type: "object",
        properties: {
            type: {
                type: "string",
                enum: [
                    "Permanent",
                    "Temporary",
                    "Full-Time",
                    "Part-Time",
                    "Seasonal",
                    "Apprenticeship",
                    "Flexible",
                    "Consultancy",
                ],
                example: "Permanent",
                description: "Type of contract",
            },
            joinDate: {
                type: "string",
                format: "date-time",
                example: "2024-03-20T00:00:00Z",
                description: "Contract start date",
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
                description: "Duration of the contract",
            },
            contractFile: {
                type: "string",
                format: "binary",
                description: "Upload the contract file (PDF format only)",
            },
            status: {
                type: "string",
                enum: ["Active", "Expired", "Terminated"],
                example: "Active",
                description: "Current status of the contract",
            },
        },
        required: ["type", "joinDate", "contractDuration", "status"],
    },
};

export const SWAGGER_CONTRACT_UPDATE: ApiBodyOptions = {
    description:
        'Update an existing contract. Provide updated details with an optional new PDF file in the "contractFile" field.',
    required: true,
    schema: {
        type: "object",
        properties: {
            type: {
                type: "string",
                enum: [
                    "Permanent",
                    "Temporary",
                    "Full-Time",
                    "Part-Time",
                    "Seasonal",
                    "Apprenticeship",
                    "Flexible",
                    "Consultancy",
                ],
                example: "Permanent",
                description: "Type of contract",
            },
            joinDate: {
                type: "string",
                format: "date-time",
                example: "2025-02-13T00:00:00Z",
                description: "Contract start date",
            },
            expirationDate: {
                type: "string",
                format: "date-time",
                example: "2025-02-13T00:00:00Z",
                description: "Contract expiration date",
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
                example: "3_months",
                description: "Duration of the contract",
            },
            contractFile: {
                type: "string",
                format: "binary",
                description: "Upload the contract file (PDF format only)",
            },
            status: {
                type: "string",
                enum: ["Active", "Expired", "Terminated"],
                example: "Active",
                description: "Updated status of the contract",
            },
        },
        required: ["type", "joinDate", "contractDuration", "status"],
    },
};

export const SWAGGER_CONTRACT_GET: ApiResponseOptions = {
    description: "Contract retrieved successfully",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    message: {
                        type: "string",
                        example: "Contract retrieved successfully",
                    },
                    data: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "uuid-1234" },
                            type: {
                                type: "string",
                                enum: [
                                    "Permanent",
                                    "Temporary",
                                    "Full-Time",
                                    "Part-Time",
                                    "Seasonal",
                                    "Apprenticeship",
                                    "Flexible",
                                    "Consultancy",
                                ],
                                example: "Permanent",
                            },
                            joinDate: {
                                type: "string",
                                format: "date-time",
                                example: "2024-03-20T00:00:00Z",
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
                            contractUrl: {
                                type: "string",
                                example:
                                    "https://s3.amazonaws.com/bucket/contract.pdf",
                            },
                            status: {
                                type: "string",
                                enum: ["Active", "Expired", "Terminated"],
                                example: "Active",
                            },
                        },
                    },
                },
            },
        },
    },
};
