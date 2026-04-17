import { HttpException, HttpStatus } from "@nestjs/common";

function foundRes<DataType>(message: string, data: DataType, length?: number) {
    return {
        message,
        payload: data,
        status: 200,
        extra: {
            length,
        },
    };
}

function notFoundRes(message: string) {
    return {
        message,
        payload: null,
        status: 404,
    };
}

function newInstanceRes<DataType>(message: string, data: DataType) {
    return {
        message,
        payload: data,
        status: 201,
    };
}

function forbiddenRes(message: string) {
    return {
        message,
        payload: null,
        status: 401,
    };
}

function deletedRes<DataType>(message: string, data: DataType) {
    return {
        message,
        payload: data,
        status: 200,
    };
}

function errorRes(error: any) {
    return { message: "Error occurred", payload: error, status: 500 };
}

function exceptionRes(
    error: any,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
) {
    const message =
        typeof error === "string" ? error : error?.message || "Error occurred";
    const payload =
        typeof error === "object" && error?.stack ? error.stack : error;

    throw new HttpException(
        {
            message,
            payload,
            status,
        },
        status
    );
}

export {
    foundRes,
    notFoundRes,
    newInstanceRes,
    forbiddenRes,
    deletedRes,
    errorRes,
    exceptionRes,
};
