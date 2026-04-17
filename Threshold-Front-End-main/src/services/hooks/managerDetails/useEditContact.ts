import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditManagerContactRequest {
    nationalId: string;
    nationalIdExpiration: string;
    phone: string;
    emergencyPhone: string;
    relationship: any;
}

interface EditManagerContact {
    message: string;
    status: number;
    payload: any;
}

const updateContact = async (
    academyId: string,
    id: string,
    data: EditManagerContactRequest,
): Promise<EditManagerContact> => {
    const response = await api
        .url(`club/${academyId}/manager/${id}/contact`)
        .patch(data)
        .json<EditManagerContact>();
    return response;
};

export const useUpdateContact = (
    academyId: string,
    id: string,
    options?: UseMutationOptions<EditManagerContact, Error, EditManagerContactRequest>,
): UseMutationResult<EditManagerContact, Error, EditManagerContactRequest> => {
    return useMutation<EditManagerContact, Error, EditManagerContactRequest>({
        mutationFn: (data) => updateContact(academyId, id, data),
        ...options,
    });
};
