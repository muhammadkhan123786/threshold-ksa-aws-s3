import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface EditCoachBankDataRequest {
    iban: string;
    bank: string;
    accountHolder: string;
}

interface EditCoachBankDataResponse {
    status: number;
    message: string;
}

const updateCoachBankData = async (
    sportId: string,
    coachId: string,
    data: EditCoachBankDataRequest,
): Promise<EditCoachBankDataResponse> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-coaches/${coachId}/bank`)
        .patch(data)
        .json<EditCoachBankDataResponse>();
    return response;
};

export const useUpdateCoachBankData = (
    sportId: string,
    coachId: string,
    options?: UseMutationOptions<EditCoachBankDataResponse, Error, EditCoachBankDataRequest>,
): UseMutationResult<EditCoachBankDataResponse, Error, EditCoachBankDataRequest> => {
    return useMutation<EditCoachBankDataResponse, Error, EditCoachBankDataRequest>({
        mutationFn: (data) => updateCoachBankData(sportId, coachId, data),
        ...options,
    });
};
