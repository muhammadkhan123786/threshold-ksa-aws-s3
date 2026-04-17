import { applyDecorators } from "@nestjs/common";
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { CreateSessionDto } from "src/dto/sessions/create-session.dto";
import { PlayingSessionStatus } from "src/enums/athletes.enum";

export function ApiPaginatedExamSessions() {
    return applyDecorators(
        ApiTags("Exam Sessions"),
        ApiOperation({
            summary: "Retrieve paginated exam sessions with filtering options",
        }),
        ApiQuery({
            name: "page",
            required: false,
            description: "Page number",
            example: 1,
        }),
        ApiQuery({
            name: "limit",
            required: false,
            description: "Number of items per page",
            example: 10,
        }),
        ApiQuery({
            name: "sortField",
            required: false,
            description: "Field to sort by",
            example: "createdAt",
        }),
        ApiQuery({
            name: "sortOrder",
            required: false,
            description: "Order to sort by",
            enum: ["ASC", "DESC"],
            example: "DESC",
        }),
        ApiQuery({
            name: "status",
            required: false,
            description: "Filter by session status",
            enum: PlayingSessionStatus,
        }),
        ApiQuery({
            name: "teamId",
            required: false,
            description: "Filter by team ID",
            example: "team123",
        }),
        ApiQuery({
            name: "searchQuery",
            required: false,
            description: "Search by session description or title",
            example: "Exam",
        }),
        ApiQuery({
            name: "startDate",
            required: false,
            description: "Filter by session start date (YYYY-MM-DD)",
            example: "2024-09-01",
        }),
        ApiQuery({
            name: "endDate",
            required: false,
            description: "Filter by session end date (YYYY-MM-DD)",
            example: "2024-09-30",
        }),
        ApiResponse({
            status: 200,
            description: "Exam sessions retrieved successfully",
            schema: {
                example: {
                    message: "Exam sessions retrieved successfully",
                    data: [
                        {
                            id: "abc123",
                            status: "NOT_STARTED",
                            from: "2024-09-22T10:00:00Z",
                            to: "2024-09-22T12:00:00Z",
                            date: "2024-09-22",
                            teamId: "team123",
                            avgScale: 4.5,
                        },
                    ],
                    meta: {
                        totalItems: 100,
                        itemCount: 10,
                        itemsPerPage: 10,
                        totalPages: 10,
                        currentPage: 1,
                    },
                    links: {
                        first: "/exam-sessions?page=1&limit=10",
                        previous: "/exam-sessions?page=1&limit=10",
                        next: "/exam-sessions?page=2&limit=10",
                        last: "/exam-sessions?page=10&limit=10",
                    },
                },
            },
        }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );
}

export function ApiUpdateExamSession() {
    return applyDecorators(
        ApiOperation({ summary: "Update an existing exam session" }),
        ApiTags("Exam Sessions"),
        ApiBody({
            description: "The details of the exam session to update",
            type: CreateSessionDto, // Assuming UpdateSessionDto has similar fields to CreateSessionDto
            examples: {
                example1: {
                    summary: "Basic example",
                    value: {
                        title: "Midterm Exam Session",
                        type: "MIDTERM",
                        date: "2024-09-22",
                        from: "10:00",
                        to: "12:00",
                        academyId: "academy123",
                        teamId: "team123",
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Exam session updated successfully",
            schema: {
                example: {
                    message: "Exam session updated successfully",
                    data: {
                        id: "abc123",
                        status: "COMPLETED",
                        from: "2024-09-22T10:00:00Z",
                        to: "2024-09-22T12:00:00Z",
                        date: "2024-09-22",
                        teamId: "team123",
                    },
                },
            },
        }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );
}

export function ApiDeleteExamSession() {
    return applyDecorators(
        ApiOperation({ summary: "Soft delete an exam session" }),
        ApiTags("Exam Sessions"),
        ApiResponse({
            status: 200,
            description: "Exam session deleted successfully",
            schema: {
                example: {
                    message: "Exam session deleted successfully",
                    data: null,
                },
            },
        }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );
}

export function ApiCreateExamSession() {
    return applyDecorators(
        ApiTags("Exam Sessions"),
        ApiOperation({ summary: "Create a new exam session" }),
        ApiBody({
            description: "The details of the exam session to create",
            type: CreateSessionDto,
            examples: {
                example1: {
                    summary: "Basic example",
                    value: {
                        title: "Final Exam Session",
                        type: "FINAL",
                        date: "2024-09-22",
                        from: "10:00",
                        to: "12:00",
                        academyId: "academy123",
                        teamId: "team123",
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Exam session created successfully",
            schema: {
                example: {
                    message: "Exam session created successfully",
                    data: {
                        id: "abc123",
                        title: "Final Exam Session",
                        type: "FINAL",
                        date: "2024-09-22",
                        from: "10:00",
                        to: "12:00",
                        academyId: "academy123",
                        teamId: "team123",
                    },
                },
            },
        }),
        ApiResponse({ status: 400, description: "Invalid input data" }),
        ApiResponse({ status: 500, description: "Internal server error" })
    );
}
