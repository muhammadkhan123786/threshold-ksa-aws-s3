import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddStockClothesRequest {
    sportId: string;
    categoryId: string;
    measurementUnit: string;
    sizeOptions: {
        size: string;
        quantity: number;
    }[];
}

interface AddStockClothesResponse {
    message: string;
    status: number;
    payload: any;
}

export const addStockClothes = async (
    data: AddStockClothesRequest,
): Promise<AddStockClothesResponse> => {
    const response = await api.url(`/stock`).post(data).json<AddStockClothesResponse>();
    return response;
};

export const useAddStockClothes = (
    options?: UseMutationOptions<AddStockClothesResponse, Error, AddStockClothesRequest>,
): UseMutationResult<AddStockClothesResponse, Error, AddStockClothesRequest> => {
    return useMutation<AddStockClothesResponse, Error, AddStockClothesRequest>({
        mutationFn: addStockClothes,
        ...options,
    });
};
