import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface BankDataRequest {
    iban: string;
    bank: string;
    accountHolder: string;
}

interface BankDataResponse {
    status: number;
    message: string;
}

const createBankData = async (
    id: string | undefined,
    data: BankDataRequest,
): Promise<BankDataResponse> => {
    return api.url(`/athletes/${id}/bank-data`).post(data).json<BankDataResponse>();
};

const updateBankData = async (
    id: string | undefined,
    data: BankDataRequest,
): Promise<BankDataResponse> => {
    return api.url(`/athletes/${id}/bank-data`).patch(data).json<BankDataResponse>();
};

export const useCreateBankData = (
    id: string | undefined,
    options?: UseMutationOptions<BankDataResponse, Error, BankDataRequest>,
): UseMutationResult<BankDataResponse, Error, BankDataRequest> => {
    return useMutation<BankDataResponse, Error, BankDataRequest>({
        mutationFn: (data) => createBankData(id, data),
        ...options,
    });
};

export const useUpdateBankData = (
    id: string | undefined,
    options?: UseMutationOptions<BankDataResponse, Error, BankDataRequest>,
): UseMutationResult<BankDataResponse, Error, BankDataRequest> => {
    return useMutation<BankDataResponse, Error, BankDataRequest>({
        mutationFn: (data) => updateBankData(id, data),
        ...options,
    });
};
