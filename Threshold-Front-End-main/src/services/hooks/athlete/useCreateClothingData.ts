import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
interface ClothingDataRequest {
    tShirtSize?: string;
    pantSize?: string;
    shoeSize?: string;
    driFitSize?: string;
}

interface ClothingDataResponse {
    status: number;
    message: string;
}

const createClothingData = async (
    id: string | undefined,
    data: ClothingDataRequest,
): Promise<ClothingDataResponse> => {
    return api.url(`/athletes/${id}/clothing-data`).post(data).json<ClothingDataResponse>();
};

const updateClothingData = async (
    id: string | undefined,
    data: ClothingDataRequest,
): Promise<ClothingDataResponse> => {
    return api.url(`/athletes/${id}/clothing-data`).patch(data).json<ClothingDataResponse>();
};

export const useCreateClothingData = (
    id: string | undefined,
    options?: UseMutationOptions<ClothingDataResponse, Error, ClothingDataRequest>,
): UseMutationResult<ClothingDataResponse, Error, ClothingDataRequest> => {
    return useMutation<ClothingDataResponse, Error, ClothingDataRequest>({
        mutationFn: (data) => createClothingData(id, data),
        ...options,
    });
};

export const useUpdateClothingData = (
    id: string | undefined,
    options?: UseMutationOptions<ClothingDataResponse, Error, ClothingDataRequest>,
): UseMutationResult<ClothingDataResponse, Error, ClothingDataRequest> => {
    return useMutation<ClothingDataResponse, Error, ClothingDataRequest>({
        mutationFn: (data) => updateClothingData(id, data),
        ...options,
    });
};
