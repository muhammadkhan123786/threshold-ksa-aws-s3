import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { AdminManager } from 'libs/types';

export interface CreateAdminManagerPayload {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    avatar?: string;
    nationality?: string;
    contactNumber: string;
    academy: string;
    gender?: string;
    nin?: string;
    branch_id: string;
}

interface CreateAdminManagerResponse {
    message: string;
    payload: AdminManager;
    status: number;
}

export const createAdminManager = async (
    payload: CreateAdminManagerPayload,
): Promise<CreateAdminManagerResponse> => {
    const response = await api
        .url('users/admin-manager')
        .post(payload)
        .json<CreateAdminManagerResponse>();
    return response;
};

export const useCreateAdminManager = (
    options?: UseMutationOptions<
        { message: string; payload: AdminManager; status: number },
        Error,
        CreateAdminManagerPayload
    >,
): UseMutationResult<
    { message: string; payload: AdminManager; status: number },
    Error,
    CreateAdminManagerPayload
> => {
    return useMutation({
        mutationFn: createAdminManager,
        ...options,
    });
};
