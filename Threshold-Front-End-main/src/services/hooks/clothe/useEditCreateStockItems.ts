import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface StockDataItem {
    categoryId: string;
    size: string;
    quantity: number;
}

interface AddStockClothesRequest {
    athleteId: string;
    stockData: StockDataItem[];
}

interface AddStockClothesResponse {
    message: string;
    updatedStocks: StockDataItem[];
}

export const editCreateStockItems = async (
    data: AddStockClothesRequest,
): Promise<AddStockClothesResponse> => {
    const response = await api
        .url('/stock/update-or-create')
        .post(data)
        .json<AddStockClothesResponse>();
    return response;
};

export const useEditCreateStockItems = (
    options?: UseMutationOptions<AddStockClothesResponse, Error, AddStockClothesRequest>,
): UseMutationResult<AddStockClothesResponse, Error, AddStockClothesRequest> => {
    return useMutation<AddStockClothesResponse, Error, AddStockClothesRequest>({
        mutationFn: editCreateStockItems,
        ...options,
    });
};
