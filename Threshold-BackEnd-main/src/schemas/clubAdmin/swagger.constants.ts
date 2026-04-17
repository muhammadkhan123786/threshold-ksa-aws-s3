import {
    ApiParamOptions,
    ApiResponseOptions,
    ApiBodyOptions,
    ApiQueryOptions,
} from "@nestjs/swagger";
import { ClubAdminRole } from "src/enums/admin-type.enum";
import { Gender, Nationality, Relationship } from "src/enums/athletes.enum";
import { ContractDuration } from "src/enums/contractDuration.enum";

export const SWAGGER_TAGS = {
    CLUB_ADMINS: "Club Admins",
};

export const SWAGGER_OPERATIONS = {
    GET_CLUB_ADMINS: {
        summary: "Retrieve a list of club admins with optional search",
    },
    GET_CLUB_ADMIN_BY_ID: {
        summary: "Retrieve a single club admin by ID",
    },
    CREATE_CLUB_ADMIN: {
        summary: "Create a new club admin",
    },
    UPDATE_CLUB_ADMIN: {
        summary: "Update an existing club admin",
    },
    DELETE_CLUB_ADMIN: {
        summary: "Delete an existing club admin",
    },
    UPDATE_PERSONAL_INFORMATION: {
        summary: "Update personal information for a specific club admin",
    },
    GET_PERSONAL_INFORMATION: {
        summary: "Retrieve personal information for a specific club admin",
    },
    GET_CONTACT_DETAILS: {
        summary: "Retrieve contact details for a admin",
    },
    UPDATE_CONTACT_DETAILS: {
        summary: "Update contact details for a admin",
    },
    GET_BANK_DETAILS: {
        summary: "Retrieve bank details of a admin",
    },
    UPDATE_BANK_DETAILS: {
        summary: "Update bank details of a admin",
    },
    GET_MEDICAL_INFORMATION: {
        summary: "Fetch medical information for a admin",
    },
    UPDATE_MEDICAL_INFORMATION: {
        summary: "Update medical information for a admin",
    },
    GET_MEDICAL_FILES: {
        summary: "Retrieve all medical files for a specific admin",
    },
    ADD_MEDICAL_FILE: {
        summary: "Add a new medical file for a specific admin",
    },
    UPDATE_MEDICAL_FILE: {
        summary: "Update an existing medical file for a specific admin",
    },
    GET_COACH_DETAILS: {
        summary: "Retrieve all details for a specific admin",
    },
};
export const SWAGGER_PARAMS = {
    ID_PARAM: {
        name: "id",
        required: true,
        description: "UUID of the club admin",
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,

    SPORT_CLUB_PROFILE_ID_PARAM: {
        name: "sportClubProfileId",
        required: true,
        description: "UUID of the sport club profile",
        example: "8bec55ee-9934-4d2b-acbb-c54ce0af0506",
    } as ApiParamOptions,

    SEARCH_QUERY: {
        name: "search",
        required: false,
        description: "Partial name to filter club admins by first or last name",
        example: "John",
    } as ApiQueryOptions,

    PAGE_QUERY: {
        name: "page",
        required: false,
        description: "Page number for pagination",
        example: 1,
        type: Number,
    } as ApiQueryOptions,

    LIMIT_QUERY: {
        name: "limit",
        required: false,
        description: "Number of items per page",
        example: 10,
        type: Number,
    } as ApiQueryOptions,

    SORT_FIELD_QUERY: {
        name: "sortField",
        required: false,
        description: "Field to sort by",
        example: "firstName",
        type: String,
    } as ApiQueryOptions,

    SORT_ORDER_QUERY: {
        name: "sortOrder",
        required: false,
        description: "Order of sorting: ASC or DESC",
        example: "ASC",
        enum: ["ASC", "DESC"],
    } as ApiQueryOptions,
};

export const SWAGGER_RESPONSES = {
    SUCCESS_RESPONSE: {
        status: 200,
        description: "Successfully fetched admin details.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "admin details fetched successfully.",
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "123e4567-e89b-12d3-a456-426614174000",
                        },
                        name: { type: "string", example: "C. Ahmed Sabry" },
                        age: { type: "number", example: 45 },
                        experience: { type: "number", example: 10 },
                        nationality: {
                            type: "string",
                            example: "Saudi Arabia",
                            required: [],
                        },
                        languages: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Arabic & English",
                            },
                        },
                        profile: {
                            type: "object",
                            properties: {
                                avatarUrl: {
                                    type: "string",
                                    example: "https://example.com/avatar.png",
                                },
                                sport: { type: "string", example: "Football" },
                                type: { type: "string", example: "Head" },
                            },
                        },
                        teams: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        example: "team-id-123",
                                    },
                                    name: {
                                        type: "string",
                                        example: "El Hilal",
                                    },
                                    role: { type: "string", example: "Head" },
                                },
                            },
                        },
                        contractDetails: {
                            $ref: "#/components/schemas/ContractDetails",
                        },
                        bankDetails: {
                            $ref: "#/components/schemas/AthleteBankDetails",
                        },
                        medicalInformation: {
                            $ref: "#/components/schemas/MedicalInformation",
                        },
                        medicalFiles: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/MedicalFiles",
                            },
                        },
                        medicalHistory: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/MedicalHistory",
                            },
                        },
                        documents: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                        example: "document-id-12345",
                                    },
                                    name: {
                                        type: "string",
                                        example: "National ID",
                                    },
                                    url: {
                                        type: "string",
                                        example:
                                            "https://example.com/document.pdf",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    GET_MEDICAL_FILES_SUCCESS: {
        status: 200,
        description: "Medical files retrieved successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Medical files fetched successfully",
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "file-id" },
                            fileName: {
                                type: "string",
                                example: "Medical_Report.pdf",
                            },
                            fileUrl: {
                                type: "string",
                                example: "https://s3.amazonaws.com/file.pdf",
                            },
                            description: {
                                type: "string",
                                example: "Medical report for surgery",
                            },
                            createdAt: {
                                type: "string",
                                format: "date-time",
                                example: "2025-01-18T10:00:00Z",
                            },
                        },
                    },
                },
            },
        },
    },
    ADD_MEDICAL_FILE_SUCCESS: {
        status: 201,
        description: "Medical file added successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Medical file added successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "file-id" },
                        fileName: {
                            type: "string",
                            example: "Medical_Report.pdf",
                        },
                        fileUrl: {
                            type: "string",
                            example: "https://s3.amazonaws.com/file.pdf",
                        },
                        description: {
                            type: "string",
                            example: "Medical report for surgery",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-18T10:00:00Z",
                        },
                    },
                },
            },
        },
    },
    UPDATE_MEDICAL_FILE_SUCCESS: {
        status: 200,
        description: "Medical file updated successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Medical file updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "file-id" },
                        fileName: {
                            type: "string",
                            example: "Updated_Report.pdf",
                        },
                        fileUrl: {
                            type: "string",
                            example:
                                "https://s3.amazonaws.com/updated-file.pdf",
                        },
                        description: {
                            type: "string",
                            example: "Updated medical report for surgery",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-18T11:00:00Z",
                        },
                    },
                },
            },
        },
    },
    GET_MEDICAL_INFORMATION_SUCCESS: {
        status: 200,
        description: "Medical information fetched successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Medical information fetched successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        allergyDetails: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Pollen", "Dust"],
                        },
                        chronicConditions: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Diabetes", "Hypertension"],
                        },
                        healthFactors: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Wheelchair Access", "Special Diet"],
                        },
                        lastUpdated: {
                            type: "string",
                            format: "date",
                            example: "2025-01-01",
                        },
                    },
                },
            },
        },
    },
    UPDATE_MEDICAL_INFORMATION_SUCCESS: {
        status: 200,
        description: "Medical information updated successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Medical information updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        allergyDetails: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Pollen", "Dust"],
                        },
                        chronicConditions: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Diabetes", "Hypertension"],
                        },
                        healthFactors: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Wheelchair Access", "Special Diet"],
                        },
                        lastUpdated: {
                            type: "string",
                            format: "date",
                            example: "2025-01-01",
                        },
                    },
                },
            },
        },
    },
    GET_BANK_DETAILS_SUCCESS: {
        status: 200,
        description: "Bank details retrieved successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Bank details fetched successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        accountHolderName: {
                            type: "string",
                            example: "John Doe",
                        },
                        bankName: {
                            type: "string",
                            example: "Bank of XYZ",
                        },
                        accountNumber: {
                            type: "string",
                            example: "1234567890123456",
                        },
                        ifscCode: {
                            type: "string",
                            example: "XYZ0001234",
                        },
                        branchName: {
                            type: "string",
                            example: "Main Branch",
                        },
                    },
                },
            },
        },
    },

    UPDATE_BANK_DETAILS_SUCCESS: {
        status: 200,
        description: "Bank details updated successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Bank details updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        accountHolderName: {
                            type: "string",
                            example: "John Doe",
                        },
                        bankName: {
                            type: "string",
                            example: "Bank of XYZ",
                        },
                        accountNumber: {
                            type: "string",
                            example: "1234567890123456",
                        },
                        ifscCode: {
                            type: "string",
                            example: "XYZ0001234",
                        },
                        branchName: {
                            type: "string",
                            example: "Main Branch",
                        },
                    },
                },
            },
        },
    },
    GET_CONTACT_DETAILS_SUCCESS: {
        status: 200,
        description: "Contact details retrieved successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Contact details fetched successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        clubAdmin: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "65983ffb-9cb4-4fc7-8f6d-3f4ab9f0cee8",
                                },
                                firstName: {
                                    type: "string",
                                    example: "John",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Doe",
                                },
                                phone: {
                                    type: "string",
                                    example: "05679875456",
                                },
                                emergencyPhone: {
                                    type: "string",
                                    example: "05679875456",
                                },
                                nationalId: {
                                    type: "string",
                                    example: "12345678901234",
                                },
                                nationalIdExpiration: {
                                    type: "string",
                                    format: "date",
                                    example: "2028-01-01",
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    UPDATE_CONTACT_DETAILS_SUCCESS: {
        status: 200,
        description: "Contact details updated successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Contact details updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        clubAdmin: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "65983ffb-9cb4-4fc7-8f6d-3f4ab9f0cee8",
                                },
                                firstName: {
                                    type: "string",
                                    example: "John",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Doe",
                                },
                                phone: {
                                    type: "string",
                                    example: "05679875456",
                                },
                                emergencyPhone: {
                                    type: "string",
                                    example: "05679875456",
                                },
                                nationalId: {
                                    type: "string",
                                    example: "12345678901234",
                                },
                                nationalIdExpiration: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2028-01-01T00:00:00.000Z",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    UPDATE_PERSONAL_INFORMATION: {
        description:
            "Data required to update personal information of a club admin.",
        required: true,
        schema: {
            type: "object",
            properties: {
                firstName: {
                    type: "string",
                    example: "John",
                    description: "First name of the club admin",
                },
                lastName: {
                    type: "string",
                    example: "Doe",
                    description: "Last name of the club admin",
                },
                gender: {
                    type: "string",
                    example: "Male",
                    description: "Gender of the club admin",
                },
                birthday: {
                    type: "string",
                    format: "date",
                    example: "1990-01-01",
                    description: "Birthday of the club admin",
                },
                height: {
                    type: "number",
                    example: 180,
                    description: "Height in cm",
                },
                weight: {
                    type: "number",
                    example: 75,
                    description: "Weight in kg",
                },
                nationality: {
                    type: "string",
                    example: "Saudi Arabia",
                    description: "Nationality of the club admin",
                },
                levelEducation: {
                    type: "string",
                    example: "Bachelor's Degree",
                    description: "Level of education",
                },
                schoolName: {
                    type: "string",
                    example: "Al Hilal High School",
                    description: "Name of the school",
                },
                joinDate: {
                    type: "string",
                    format: "date",
                    example: "2020-01-01",
                    description: "Joining date of the club admin",
                },
                experience: {
                    type: "number",
                    example: 5,
                    description: "Years of coaching experience",
                },
                playingFor: {
                    type: "string",
                    example: "National Team",
                    description:
                        "The team or organization the admin is playing for",
                },
            },
        },
    } as ApiBodyOptions,
    GET_PERSONAL_INFORMATION_SUCCESS: {
        status: 200,
        description: "Personal information retrieved successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Personal information fetched successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example:
                                "Personal information fetched successfully",
                        },
                        payload: {
                            type: "object",
                            properties: {
                                firstName: { type: "string", example: "John" },
                                lastName: { type: "string", example: "Doe" },
                                gender: { type: "string", example: "male" },
                                birthday: {
                                    type: "string",
                                    format: "date-time",
                                    example: "1990-01-01T00:00:00.000Z",
                                },
                                height: { type: "string", example: "180.00" },
                                weight: { type: "string", example: "75.00" },
                                nationality: { type: "string", example: "sa" },
                                levelEducation: {
                                    type: "string",
                                    example: "Bachelor's Degree",
                                },
                                schoolName: {
                                    type: "string",
                                    example: "Harvard University",
                                },
                                joinDate: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2023-01-01T00:00:00.000Z",
                                },
                                experience: { type: "number", example: 5 },
                                playingFor: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string",
                                            example:
                                                "d44ee46c-1349-43c9-8f8d-c1994aa0f5bf",
                                        },
                                        updatedAt: {
                                            type: "string",
                                            format: "date-time",
                                            example: "2025-01-18T10:54:06.558Z",
                                        },
                                        createdAt: {
                                            type: "string",
                                            format: "date-time",
                                            example: "2025-01-18T10:54:06.558Z",
                                        },
                                        creationDate: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        name: {
                                            type: "string",
                                            example: "Tigers",
                                        },
                                    },
                                },
                            },
                        },
                        status: { type: "number", example: 200 },
                        extra: {
                            type: "object",
                            example: {},
                        },
                    },
                },
            },
        },
    } as ApiResponseOptions,
    UPDATE_PERSONAL_INFORMATION_SUCCESS: {
        status: 200,
        description: "Personal information updated successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Personal information updated successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        payload: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example:
                                        "65983ffb-9cb4-4fc7-8f6d-3f4ab9f0cee8",
                                },
                                updatedAt: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2025-01-18T10:58:46.657Z",
                                },
                                createdAt: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2025-01-18T10:53:03.696Z",
                                },
                                deletedAt: {
                                    type: "string",
                                    nullable: true,
                                    example: null,
                                },
                                avatarUrl: {
                                    type: "string",
                                    nullable: true,
                                    example: null,
                                },
                                avatar: {
                                    type: "string",
                                    format: "binary",
                                    example: "",
                                },
                                experience: {
                                    type: "number",
                                    example: 5,
                                },
                                birthday: {
                                    type: "string",
                                    format: "date-time",
                                    example: "1990-01-01T00:00:00.000Z",
                                },
                                phone: {
                                    type: "string",
                                    example: "0512345678",
                                },
                                emergencyPhone: {
                                    type: "string",
                                    example: "0598765432",
                                },
                                nationality: {
                                    type: "string",
                                    example: "sa",
                                },
                                relationship: {
                                    type: "string",
                                    example: "father",
                                },
                                type: {
                                    type: "string",
                                    example: "club-admin-assistant",
                                },
                                levelEducation: {
                                    type: "string",
                                    example: "Bachelor's Degree",
                                },
                                schoolName: {
                                    type: "string",
                                    example: "Harvard University",
                                },
                                gender: {
                                    type: "string",
                                    example: "male",
                                },
                                joinDate: {
                                    type: "string",
                                    format: "date-time",
                                    example: "2023-01-01T00:00:00.000Z",
                                },
                                sport: {
                                    type: "string",
                                    example: "DEFAULT",
                                },

                                branch: {
                                    type: "string",
                                    nullable: true,
                                    example: null,
                                },
                                playingFor: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string",
                                            example:
                                                "d44ee46c-1349-43c9-8f8d-c1994aa0f5bf",
                                        },
                                        updatedAt: {
                                            type: "string",
                                            format: "date-time",
                                            example: "2025-01-18T10:54:06.558Z",
                                        },
                                        createdAt: {
                                            type: "string",
                                            format: "date-time",
                                            example: "2025-01-18T10:54:06.558Z",
                                        },
                                        avatarUrl: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        avatarPath: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        background: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        creationDate: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        sport: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        category: {
                                            type: "string",
                                            example: "Intermediate",
                                        },
                                        logo: {
                                            type: "string",
                                            nullable: true,
                                            example: null,
                                        },
                                        name: {
                                            type: "string",
                                            example: "Tigers",
                                        },
                                    },
                                },
                            },
                        },
                        status: {
                            type: "number",
                            example: 200,
                        },
                        extra: {
                            type: "object",
                            example: {},
                        },
                    },
                },
            },
        },
    } as ApiResponseOptions,
    GET_CLUB_ADMINS_SUCCESS: {
        status: 200,
        description: "Club admins retrieved successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Club admins fetched successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/ClubAdmin",
                            },
                        },
                        meta: {
                            type: "object",
                            properties: {
                                totalItems: {
                                    type: "integer",
                                    example: 50,
                                },
                                itemCount: {
                                    type: "integer",
                                    example: 10,
                                },
                                itemsPerPage: {
                                    type: "integer",
                                    example: 10,
                                },
                                totalPages: {
                                    type: "integer",
                                    example: 5,
                                },
                                currentPage: {
                                    type: "integer",
                                    example: 1,
                                },
                            },
                        },
                    },
                },
            },
        },
    } as ApiResponseOptions,

    GET_CLUB_ADMIN_BY_ID_SUCCESS: {
        status: 200,
        description: "Club admin retrieved successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Club admin fetched successfully",
                },
                data: {
                    $ref: "#/components/schemas/ClubAdmin",
                },
            },
        },
    } as ApiResponseOptions,

    CREATE_CLUB_ADMIN_SUCCESS: {
        status: 201,
        description: "Club admin created successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "User and ClubAdmin created successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        user: {
                            $ref: "#/components/schemas/User",
                        },
                        clubAdmin: {
                            $ref: "#/components/schemas/ClubAdmin",
                        },
                    },
                },
            },
        },
    } as ApiResponseOptions,

    UPDATE_CLUB_ADMIN_SUCCESS: {
        status: 200,
        description: "Club admin updated successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "ClubAdmin updated successfully",
                },
                data: {
                    $ref: "#/components/schemas/ClubAdmin",
                },
            },
        },
    } as ApiResponseOptions,

    DELETE_CLUB_ADMIN_SUCCESS: {
        status: 200,
        description: "Club admin deleted successfully.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Club admin deleted successfully",
                },
                data: {
                    type: "null",
                },
            },
        },
    } as ApiResponseOptions,

    NOT_FOUND_RESPONSE: {
        status: 404,
        description: "Resource not found.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Club admin with ID '...' not found",
                },
                error: {
                    type: "string",
                    example: "Not Found",
                },
            },
        },
    } as ApiResponseOptions,

    VALIDATION_ERROR_RESPONSE: {
        status: 400,
        description: "Validation error.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Validation failed",
                },
                error: {
                    type: "object",
                    additionalProperties: true,
                },
            },
        },
    } as ApiResponseOptions,

    ERROR_RESPONSE: {
        status: 500,
        description: "Internal server error.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "An unexpected error occurred",
                },
                error: {
                    type: "string",
                    example: "Internal Server Error",
                },
            },
        },
    } as ApiResponseOptions,
};

export const SWAGGER_BODIES = {
    UPDATE_PERSONAL_INFORMATION: {
        description:
            "Data required to create a new personal information record along with an optional avatar file",
        required: true,
        schema: {
            type: "object",
            properties: {
                firstName: {
                    type: "string",
                    example: "John",
                    description: "First name of the person",
                },
                lastName: {
                    type: "string",
                    example: "Doe",
                    description: "Last name of the person",
                },
                gender: {
                    type: "string",
                    enum: Object.values(Gender),
                    example: Gender.MALE,
                    description: "Gender of the person",
                },
                birthday: {
                    type: "string",
                    format: "date",
                    example: "1990-01-01",
                    description: "Birthday of the person",
                },
                nationality: {
                    type: "string",
                    example: "Saudi Arabia",
                    description: "Nationality of the club admin",
                },
                experience: {
                    type: "integer",
                    example: 5,
                    description: "Total years of experience",
                },
                phone: {
                    type: "string",
                    example: "0551234567",
                    description:
                        "Phone number starting with '05' followed by 8 digits",
                },
                emergencyPhone: {
                    type: "string",
                    example: "0557654321",
                    description: "Emergency contact phone number",
                },
                levelEducation: {
                    type: "string",
                    example: "Bachelor's Degree",
                    description: "Level of education",
                },
                schoolName: {
                    type: "string",
                    example: "Harvard University",
                    description: "Name of the school attended",
                },
                joinDate: {
                    type: "string",
                    format: "date",
                    example: "2023-01-01",
                    description:
                        "Joining date of the person in the organization",
                },
                playingFor: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                    description: "UUID of the team the person is playing for",
                },
                roleType: {
                    type: "string",
                    enum: Object.values(ClubAdminRole),
                    example: ClubAdminRole.CLUB_ADMIN_ASSISTANT,
                    description:
                        "Role type of the person (e.g., Club Admin Assistant)",
                },
                languages: {
                    type: "array",
                    items: { type: "string" },
                    example: ["English", "Arabic"],
                    description: "Languages spoken by the person",
                },
                avatar: {
                    type: "string",
                    format: "binary",
                    description: "Avatar image file (optional)",
                },
            },
            required: [
                "firstName",
                "lastName",
                "gender",
                "birthday",
                "nationality",
                "experience",
                "phone",
                "joinDate",
                "roleType",
            ],
        },
    },
    CREATE_CLUB_ADMIN: {
        description:
            "Data required to create a new club admin along with an optional avatar file",
        required: true,
        schema: {
            type: "object",
            properties: {
                firstName: {
                    type: "string",
                    example: "John",
                    description: "First name of the club admin",
                },
                lastName: {
                    type: "string",
                    example: "Doe",
                    description: "Last name of the club admin",
                },
                experience: {
                    type: "integer",
                    example: 5,
                    description: "Years of experience",
                },
                birthday: {
                    type: "string",
                    format: "date",
                    example: "1990-01-01",
                    description: "Birthday of the club admin",
                },
                phone: {
                    type: "string",
                    example: "0512345678",
                    description:
                        "Phone number starting with '05' followed by 8 digits",
                },
                emergencyPhone: {
                    type: "string",
                    example: "0598765432",
                    description: "Emergency contact phone number",
                },
                nationality: {
                    type: "string",
                    enum: Object.values(Nationality),
                    example: Nationality.SA,
                    description: "Nationality of the club admin",
                },
                relationship: {
                    type: "string",
                    enum: Object.values(Relationship),
                    example: Relationship.FATHER,
                    description: "Relationship status of the club admin",
                },
                type: {
                    type: "string",
                    enum: Object.values(ClubAdminRole),
                    example: ClubAdminRole.CLUB_ADMIN_ASSISTANT,
                    description: "Type of the club admin (e.g., Assistant)",
                },
                gender: {
                    type: "string",
                    enum: Object.values(Gender),
                    example: Gender.MALE,
                    description: "Gender of the club admin",
                },
                joinDate: {
                    type: "string",
                    format: "date",
                    example: "2024-01-01",
                    description: "Joining date of the club admin",
                },
                email: {
                    type: "string",
                    format: "email",
                    example: "johndoe@example.com",
                    description: "Email address of the club admin",
                },
                username: {
                    type: "string",
                    example: "johndoe",
                    description: "Username for the club admin's account",
                },
                password: {
                    type: "string",
                    example: "StrongPassword123!",
                    description: "Password for the club admin's account",
                },
                branch: {
                    type: "string",
                    format: "uuid",
                    example: "223e4567-e89b-12d3-a456-426614174000",
                    description: "UUID of the associated Branch",
                },
                avatar: {
                    type: "string",
                    format: "binary",
                    description: "Avatar image file (optional)",
                },
                nationalId: {
                    type: "string",
                    example: "12345678901234",
                    description: "National ID of the club admin",
                },
                nationalIdExpiration: {
                    type: "string",
                    format: "date",
                    example: "2024-01-01",
                    description: "Expiration date of the national ID",
                },
            },
            required: [
                "firstName",
                "lastName",
                "experience",
                "phone",
                "nationality",
                "relationship",
                "type",
                "gender",
                "joinDate",
                "email",
                "username",
                "password",
            ],
        },
    } as ApiBodyOptions,

    UPDATE_CLUB_ADMIN: {
        description:
            "Data required to update a club admin along with an optional avatar file",
        required: true,
        schema: {
            type: "object",
            properties: {
                firstName: {
                    type: "string",
                    example: "John",
                    description: "First name of the club admin",
                },
                lastName: {
                    type: "string",
                    example: "Doe",
                    description: "Last name of the club admin",
                },
                experience: {
                    type: "integer",
                    example: 6,
                    description: "Years of experience",
                },
                birthday: {
                    type: "string",
                    format: "date",
                    example: "1990-01-01",
                    description: "Birthday of the club admin",
                },
                phone: {
                    type: "string",
                    example: "0512345678",
                    description:
                        "Phone number starting with '05' followed by 8 digits",
                },
                emergencyPhone: {
                    type: "string",
                    example: "0598765432",
                    description: "Emergency contact phone number",
                },
                nationality: {
                    type: "string",
                    enum: Object.values(Nationality),
                    example: Nationality.SA,
                    description: "Nationality of the club admin",
                },
                relationship: {
                    type: "string",
                    enum: Object.values(Relationship),
                    example: Relationship.FATHER,
                    description: "Relationship status of the club admin",
                },
                type: {
                    type: "string",
                    enum: Object.values(ClubAdminRole),
                    example: ClubAdminRole.CLUB_ADMIN_ASSISTANT,
                    description: "Type of the club admin (e.g., Assistant)",
                },
                gender: {
                    type: "string",
                    enum: Object.values(Gender),
                    example: Gender.MALE,
                    description: "Gender of the club admin",
                },
                joinDate: {
                    type: "string",
                    format: "date",
                    example: "2024-01-01",
                    description: "Joining date of the club admin",
                },
                email: {
                    type: "string",
                    format: "email",
                    example: "johndoe@example.com",
                    description: "Email address of the club admin",
                },
                username: {
                    type: "string",
                    example: "johndoe",
                    description: "Username for the club admin's account",
                },
                password: {
                    type: "string",
                    example: "NewStrongPassword123!",
                    description: "Password for the club admin's account",
                },
                academy: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                    description: "UUID of the associated Academy",
                },
                branch: {
                    type: "string",
                    format: "uuid",
                    example: "223e4567-e89b-12d3-a456-426614174000",
                    description: "UUID of the associated Branch",
                },
                sportProfile: {
                    type: "string",
                    format: "uuid",
                    example: "323e4567-e89b-12d3-a456-426614174000",
                    description: "UUID of the associated SportClubProfile",
                },
                avatar: {
                    type: "string",
                    format: "binary",
                    description: "Avatar image file (optional)",
                },
            },
        },
    } as ApiBodyOptions,
};
