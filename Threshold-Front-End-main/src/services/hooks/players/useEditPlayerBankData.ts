import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface EditPlayerBankDataRequest {
    iban: string;
    bank: string;
    accountHolder: string;
}

interface EditPlayerBankDataResponse {
    status: number;
    message: string;
}

const createPlayerBankData = async (
    id: string | undefined,
    data: EditPlayerBankDataRequest,
): Promise<EditPlayerBankDataResponse> => {
    return api.url(`players/${id}/bank-data`).post(data).json<EditPlayerBankDataResponse>();
};

const updatePlayerBankData = async (
    id: string | undefined,
    data: EditPlayerBankDataRequest,
): Promise<EditPlayerBankDataResponse> => {
    return api.url(`players/${id}/bank-data`).patch(data).json<EditPlayerBankDataResponse>();
};

export const useCreatePlayerBankData = (
    id: string | undefined,
    options?: UseMutationOptions<EditPlayerBankDataResponse, Error, EditPlayerBankDataRequest>,
): UseMutationResult<EditPlayerBankDataResponse, Error, EditPlayerBankDataRequest> => {
    return useMutation<EditPlayerBankDataResponse, Error, EditPlayerBankDataRequest>({
        mutationFn: (data) => createPlayerBankData(id, data),
        ...options,
    });
};

export const useUpdatePlayerBankData = (
    id: string | undefined,
    options?: UseMutationOptions<EditPlayerBankDataResponse, Error, EditPlayerBankDataRequest>,
): UseMutationResult<EditPlayerBankDataResponse, Error, EditPlayerBankDataRequest> => {
    return useMutation<EditPlayerBankDataResponse, Error, EditPlayerBankDataRequest>({
        mutationFn: (data) => updatePlayerBankData(id, data),
        ...options,
    });
};
