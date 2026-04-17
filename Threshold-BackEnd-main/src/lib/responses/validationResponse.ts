function validRes(message: string, data: any) {
    return { message, payload: data, status: 200 };
}

function invalidRes(message: string, data: string) {
    return { message, payload: data, status: 400 };
}

function validationError(message: string, errors: string[]) {
    return { message, payload: null, status: 500, errors };
}

export { validRes, invalidRes, validationError };
