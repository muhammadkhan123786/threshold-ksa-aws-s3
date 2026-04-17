import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ResetPasswordRequest {
    token: string;
    password: string;
}

interface ResetPasswordResponse {
    message: string;
}

const resetPassword = async (request: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api
        .url('/auth/reset_password')
        .post(request)
        .json<ResetPasswordResponse>();
    return response;
};

export const useResetPassword = (
    options?: UseMutationOptions<ResetPasswordResponse, Error, ResetPasswordRequest, unknown>,
): UseMutationResult<ResetPasswordResponse, Error, ResetPasswordRequest, unknown> => {
    return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest, unknown>({
        mutationFn: resetPassword,
        ...options,
    });
};
