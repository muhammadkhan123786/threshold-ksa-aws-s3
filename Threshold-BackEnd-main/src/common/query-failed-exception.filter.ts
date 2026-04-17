import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { Response } from "express";

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.BAD_REQUEST;

        const errorResponse = {
            statusCode: status,
            message: exception.message,
            error: "Bad Request",
        };

        console.error(`[QueryFailedExceptionFilter] ${exception.message}`);

        response.status(status).json(errorResponse);
    }
}
