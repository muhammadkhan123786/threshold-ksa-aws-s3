import api from 'services/clients/wretchClient';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    UseQueryResult,
    useQuery,
} from '@tanstack/react-query';

interface EditCoachBankDataRequest {
    iban: string;
    bank: string;
    accountHolder: string;
}

interface EditBankDataResponse {
    status: number;
    message: string;
}

interface BankDataResponse {
    iban: string;
    bank: string;
    accountHolder: string;
    data: any;
}

const updateBankData = async (
    academyId: string,
    id: string,
    data: EditCoachBankDataRequest,
): Promise<EditBankDataResponse> => {
    const response = await api
        .url(`club/${academyId}/manager/${id}/bank`)
        .patch(data)
        .json<EditBankDataResponse>();
    return response;
};

export const useUpdateBankData = (
    academyId: string,
    id: string,
    options?: UseMutationOptions<EditBankDataResponse, Error, EditCoachBankDataRequest>,
): UseMutationResult<EditBankDataResponse, Error, EditCoachBankDataRequest> => {
    return useMutation<EditBankDataResponse, Error, EditCoachBankDataRequest>({
        mutationFn: (data) => updateBankData(academyId, id, data),
        ...options,
    });
};

const getBankData = async (academyId: string, id: string): Promise<BankDataResponse> => {
    const response = await api
        .url(`club/${academyId}/manager/${id}/bank`)
        .get()
        .json<BankDataResponse>();
    return response;
};

export const useGetBankData = (
    academyId: string,
    id: string,
    options?: UseMutationOptions<BankDataResponse, Error>,
): UseQueryResult<BankDataResponse, Error> => {
    return useQuery<BankDataResponse, Error>({
        queryKey: ['bankData', academyId, id], // Unique key for caching
        queryFn: () => getBankData(academyId, id),
        ...options,
    });
};
