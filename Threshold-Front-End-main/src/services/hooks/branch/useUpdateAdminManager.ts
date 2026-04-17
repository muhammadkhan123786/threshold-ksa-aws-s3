import { UseMutationOptions, UseMutationResult, useMutation } from '@tanstack/react-query';
import { AdminManager } from 'libs/types';
import api from 'services/clients/wretchClient';

export interface UpdateAdminManagerPayload {
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    academy?: string;
}

interface UpdateAdminManagerResponse {
    message: string;
    payload: AdminManager;
    status: number;
}

export const updateAdminManager = async (
    id: string,
    payload: UpdateAdminManagerPayload,
): Promise<UpdateAdminManagerResponse> => {
    const response = await api
        .url(`admin-manager/${id}`)
        .put(payload)
        .json<UpdateAdminManagerResponse>();
    return response;
};

export const useUpdateAdminManager = (
    id: string,
    options?: UseMutationOptions<UpdateAdminManagerResponse, Error, UpdateAdminManagerPayload>,
): UseMutationResult<UpdateAdminManagerResponse, Error, UpdateAdminManagerPayload> => {
    return useMutation({
        mutationFn: (payload: UpdateAdminManagerPayload) => updateAdminManager(id, payload),
        ...options,
    });
};
