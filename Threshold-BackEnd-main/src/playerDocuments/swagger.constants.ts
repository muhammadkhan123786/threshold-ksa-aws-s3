import {
    ApiBodyOptions,
    ApiOperationOptions,
    ApiParamOptions,
    ApiResponseOptions,
} from "@nestjs/swagger";
import { DocumentType } from "src/enums/document-type.enum";

export const PLAYER_DOCUMENTS_TAG = "Players Documents";

export const SWAGGER_PLAYER_DOCUMENTS = {
    UPLOAD_OPERATION: {
        summary: "Upload an athlete's document",
        description:
            "Upload a document for a specific athlete. The document is uploaded to S3 and its metadata saved in the DB.",
    } as ApiOperationOptions,

    UPLOAD_ATHLETE_ID_PARAM: {
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,

    UPLOAD_DOCUMENT_TYPE_PARAM: {
        name: "type",
        description: "The type of document being uploaded",
        enum: DocumentType,
    } as ApiParamOptions,

    UPLOAD_BODY: {
        description: "The file to be uploaded",
        required: true,
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    } as ApiBodyOptions,

    UPLOAD_SUCCESS_RESPONSE: {
        status: 201,
        description: "Document uploaded successfully",
        schema: {
            example: {
                message: "Document uploaded successfully",
                payload: {
                    id: "123e4567-e89b-12d3-a456-426614174001",
                    type: "passport",
                    url: "https://s3/bucketname/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                    lastUpdated: "2024-01-01T00:00:00.000Z",
                },
                status: 201,
            },
        },
    } as ApiResponseOptions,

    UPLOAD_ERROR_RESPONSE: {
        status: 500,
        description: "Failed to upload document",
        schema: {
            example: {
                message: "Error occurred: Failed to upload document",
                payload: null,
                status: 500,
            },
        },
    } as ApiResponseOptions,

    DELETE_OPERATION: {
        summary: "Delete an athlete's document",
        description:
            "Delete a specific document for an athlete (S3 cleanup + DB record removal).",
    } as ApiOperationOptions,

    DELETE_ATHLETE_ID_PARAM: {
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,

    DELETE_DOCUMENT_ID_PARAM: {
        name: "documentId",
        description: "The ID of the document to be deleted",
        example: "123e4567-e89b-12d3-a456-426614174001",
    } as ApiParamOptions,

    DELETE_SUCCESS_RESPONSE: {
        status: 200,
        description: "Document deleted successfully",
        schema: {
            example: {
                message: "Document deleted successfully",
                payload: {
                    id: "123e4567-e89b-12d3-a456-426614174001",
                    url: "https://s3.buckename/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                    type: "passport",
                    lastUpdated: "2024-01-01T00:00:00.000Z",
                },
                status: 200,
            },
        },
    } as ApiResponseOptions,

    DELETE_NOT_FOUND_RESPONSE: {
        status: 404,
        description: "Document not found",
        schema: {
            example: {
                message: "Error occurred: Document not found",
                payload: null,
                status: 404,
            },
        },
    } as ApiResponseOptions,

    DELETE_ERROR_RESPONSE: {
        status: 500,
        description: "Failed to delete document",
        schema: {
            example: {
                message: "Error occurred: Failed to delete document",
                payload: null,
                status: 500,
            },
        },
    } as ApiResponseOptions,

    GET_OPERATION: {
        summary: "Retrieve all documents for an athlete",
        description:
            "Get a list of all documents associated with a specific athlete.",
    } as ApiOperationOptions,

    GET_ATHLETE_ID_PARAM: {
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,

    GET_SUCCESS_RESPONSE: {
        status: 200,
        description: "Successfully retrieved athlete's documents",
        schema: {
            example: {
                message: "Documents retrieved successfully",
                payload: [
                    {
                        id: "123e4567-e89b-12d3-a456-426614174001",
                        type: "passport",
                        url: "https://s3/bucketname/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                        lastUpdated: "2024-01-01T00:00:00.000Z",
                    },
                    {
                        id: "123e4567-e89b-12d3-a456-426614174002",
                        type: "id_card",
                        url: "https://s3/bucketname/athletes/athleteId/documents/id_card/id_card-2024-01-01T00:00:00.000Z.pdf",
                        lastUpdated: "2024-01-01T00:00:00.000Z",
                    },
                ],
                status: 200,
            },
        },
    } as ApiResponseOptions,

    PATCH_OPERATION: {
        summary: "Update an athlete's document",
        description:
            "Update the details of a specific document associated with an athlete.",
    } as ApiOperationOptions,

    PATCH_ATHLETE_ID_PARAM: {
        name: "id",
        description: "The ID of the athlete",
        example: "123e4567-e89b-12d3-a456-426614174000",
    } as ApiParamOptions,

    PATCH_DOCUMENT_ID_PARAM: {
        name: "documentId",
        description: "The ID of the document to be updated",
        example: "123e4567-e89b-12d3-a456-426614174001",
    } as ApiParamOptions,

    PATCH_BODY: {
        description: "The updated document file",
        required: false,
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
                type: {
                    type: "string",
                    enum: Object.values(DocumentType),
                    example: DocumentType.PASSPORT,
                    description: "The type of document being updated",
                },
            },
        },
    } as ApiBodyOptions,

    PATCH_SUCCESS_RESPONSE: {
        status: 200,
        description: "Document updated successfully",
        schema: {
            example: {
                message: "Document updated successfully",
                payload: {
                    id: "123e4567-e89b-12d3-a456-426614174001",
                    type: "passport",
                    url: "https://s3/bucketname/athletes/athleteId/documents/passport/passport-2024-01-01T00:00:00.000Z.pdf",
                    lastUpdated: "2024-01-01T00:00:00.000Z",
                },
                status: 200,
            },
        },
    } as ApiResponseOptions,

    PATCH_NOT_FOUND_RESPONSE: {
        status: 404,
        description: "Document not found",
        schema: {
            example: {
                message: "Error occurred: Document not found",
                payload: null,
                status: 404,
            },
        },
    } as ApiResponseOptions,

    PATCH_ERROR_RESPONSE: {
        status: 500,
        description: "Failed to update document",
        schema: {
            example: {
                message: "Error occurred: Failed to update document",
                payload: null,
                status: 500,
            },
        },
    } as ApiResponseOptions,
};
