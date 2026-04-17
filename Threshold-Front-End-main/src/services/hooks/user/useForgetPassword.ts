import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ForgetPasswordResponse {
    message: string;
}

interface ApiRequest {
    email: string;
}

const forgetPassword = async (request: ApiRequest): Promise<ForgetPasswordResponse> => {
    const response = await api
        .url('/auth/forget_password')
        .post({ email: request.email })
        .json<ForgetPasswordResponse>();
    return response;
};

export const useForgetPassword = (
    options?: UseMutationOptions<ForgetPasswordResponse, Error, ApiRequest, unknown>,
): UseMutationResult<ForgetPasswordResponse, Error, ApiRequest, unknown> => {
    return useMutation<ForgetPasswordResponse, Error, ApiRequest, unknown>({
        mutationFn: forgetPassword,
        ...options,
    });
};
