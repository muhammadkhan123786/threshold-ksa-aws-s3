import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface EmergencyContactRequest {
    name: string;
    relation: string;
    phoneNumber: string;
    nationalNumber: string;
}

interface EmergencyContactResponse {
    status: number;
    message: string;
}

const createEmergencyContact = async (
    id: string | undefined,
    data: EmergencyContactRequest,
): Promise<EmergencyContactResponse> => {
    return api.url(`/athletes/${id}/emergency-contact`).post(data).json<EmergencyContactResponse>();
};

const updateEmergencyContact = async (
    id: string | undefined,
    data: EmergencyContactRequest,
): Promise<EmergencyContactResponse> => {
    return api.url(`/athletes/${id}/emergency-contact`).patch(data).json<EmergencyContactResponse>();
};

export const useCreateEmergencyContact = (
    id: string | undefined,
    options?: UseMutationOptions<EmergencyContactResponse, Error, EmergencyContactRequest>,
): UseMutationResult<EmergencyContactResponse, Error, EmergencyContactRequest> => {
    return useMutation<EmergencyContactResponse, Error, EmergencyContactRequest>({
        mutationFn: (data) => createEmergencyContact(id, data),
        ...options,
    });
};

export const useUpdateEmergencyContact = (
    id: string | undefined,
    options?: UseMutationOptions<EmergencyContactResponse, Error, EmergencyContactRequest>,
): UseMutationResult<EmergencyContactResponse, Error, EmergencyContactRequest> => {
    return useMutation<EmergencyContactResponse, Error, EmergencyContactRequest>({
        mutationFn: (data) => updateEmergencyContact(id, data),
        ...options,
    });
};
