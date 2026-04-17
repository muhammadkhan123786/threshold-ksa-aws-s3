import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditCoachContactRequest {
    nationalId: string;
    nationalIdExpiration: string;
    phone: string;
    emergencyPhone: string;
    relationship: any;
}

interface EditCoachContact {
    message: string;
    status: number;
    payload: any;
}

const updateCoachContact = async (
    sportId: string,
    coachId: string,
    data: EditCoachContactRequest,
): Promise<EditCoachContact> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-admin/${coachId}/contact`)
        .patch(data)
        .json<EditCoachContact>();
    return response;
};

export const useUpdateContact = (
    sportId: string,
    coachId: string,
    options?: UseMutationOptions<EditCoachContact, Error, EditCoachContactRequest>,
): UseMutationResult<EditCoachContact, Error, EditCoachContactRequest> => {
    return useMutation<EditCoachContact, Error, EditCoachContactRequest>({
        mutationFn: (data) => updateCoachContact(sportId, coachId, data),
        ...options,
    });
};
