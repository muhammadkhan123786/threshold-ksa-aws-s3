interface ErrorResponse {
    message: string;
    payload?: {
        [key: string]: any;
    };
}

export const extractErrorMessage = (error: any): string => {
    let errorMessage = 'An unknown error occurred';

    if (typeof error.message === 'string') {
        try {
            const parsedError = JSON.parse(error.message) as ErrorResponse;

            errorMessage =
                parsedError?.payload?.response?.message ||
                parsedError?.payload?.payload ||
                parsedError?.payload ||
                parsedError.message ||
                errorMessage;
        } catch (e) {
            errorMessage = error;
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (error && typeof error === 'object') {
        errorMessage =
            (error as ErrorResponse).payload?.response?.message || error.message || errorMessage;
    }

    return errorMessage;
};
