import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditPlayerContactRequest {
    name: string;
    relation: any;
    phoneNumber: string;
    nationalNumber: string;
}

interface EditPlayerContact {
    message: string;
    status: number;
    payload: any;
}

const createPlayerContact = async (
    id: string,
    data: EditPlayerContactRequest,
): Promise<EditPlayerContact> => {
    return api.url(`players/${id}/emergency-contact`).post(data).json<EditPlayerContact>();
};

const updatePlayerContact = async (
    id: string,
    data: EditPlayerContactRequest,
): Promise<EditPlayerContact> => {
    return api.url(`players/${id}/emergency-contact`).patch(data).json<EditPlayerContact>();
};

export const useCreatePlayerContact = (
    id: string,
    options?: UseMutationOptions<EditPlayerContact, Error, EditPlayerContactRequest>,
): UseMutationResult<EditPlayerContact, Error, EditPlayerContactRequest> => {
    return useMutation<EditPlayerContact, Error, EditPlayerContactRequest>({
        mutationFn: (data) => createPlayerContact(id, data),
        ...options,
    });
};

export const useUpdatePlayerContact = (
    id: string,
    options?: UseMutationOptions<EditPlayerContact, Error, EditPlayerContactRequest>,
): UseMutationResult<EditPlayerContact, Error, EditPlayerContactRequest> => {
    return useMutation<EditPlayerContact, Error, EditPlayerContactRequest>({
        mutationFn: (data) => updatePlayerContact(id, data),
        ...options,
    });
};
