import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface PatchStockSizeRequest {
    id: string;
    data: {
        size?: string;
        quantity?: number;
        measurementUnit?: string;
        [key: string]: any;
    };
}

interface interfaceUpdateStockClothes {
    message: string;
    status: number;
    payload: any;
}

export const updateStockClothes = async ({
    id,
    data,
}: PatchStockSizeRequest): Promise<interfaceUpdateStockClothes> => {
    const response = await api.url(`/stock/${id}`).patch(data).json<interfaceUpdateStockClothes>();
    return response;
};

export const useUpdateStockClothes = (
    options?: UseMutationOptions<interfaceUpdateStockClothes, Error, PatchStockSizeRequest>,
): UseMutationResult<interfaceUpdateStockClothes, Error, PatchStockSizeRequest> => {
    return useMutation<interfaceUpdateStockClothes, Error, PatchStockSizeRequest>({
        mutationFn: updateStockClothes,
        ...options,
    });
};
