import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddStockSizeRequest {
    categoryId: string;
    size: string;
    requiredQuantity: number;
}

interface AddStockSizeResponse {
    message: string;
    status: number;
    payload: any;
}

export const addStockSize = async (data: AddStockSizeRequest): Promise<AddStockSizeResponse> => {
    const response = await api.url('stock/sizes').post(data).json<AddStockSizeResponse>();
    return response;
};

export const useAddStockSizeClothe = (
    options?: UseMutationOptions<AddStockSizeResponse, Error, AddStockSizeRequest>,
): UseMutationResult<AddStockSizeResponse, Error, AddStockSizeRequest> => {
    return useMutation<AddStockSizeResponse, Error, AddStockSizeRequest>({
        mutationFn: addStockSize,
        ...options,
    });
};
