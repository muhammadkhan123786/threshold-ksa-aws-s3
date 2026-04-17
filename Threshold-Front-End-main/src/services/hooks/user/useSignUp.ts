import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface SignUpResponse {
    status: number;
    payload: {
        message: string;
        [key: string]: any;
    };
}

export interface SignUpRequest {
    academyName: string;
    registrationNumber: string;
    contactNumber: string;
    adminName: string;
    email: string;
    avatar?: File;
    password: string;
    organizationType: 'academy' | 'club';
}

const signUp = async (request: SignUpRequest): Promise<SignUpResponse> => {
    const { avatar, ...rest } = request;

    const formData = new FormData();

    if (avatar) formData.append('avatar', avatar);

    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as string);
            }
        }
    });

    const response = await api.url('auth/company-register').post(formData).json<SignUpResponse>();
    return response;
};

export const useSignUp = (
    options?: UseMutationOptions<SignUpResponse, Error, SignUpRequest, unknown>,
): UseMutationResult<SignUpResponse, Error, SignUpRequest, unknown> => {
    return useMutation<SignUpResponse, Error, SignUpRequest, unknown>({
        mutationFn: signUp,
        ...options,
    });
};
