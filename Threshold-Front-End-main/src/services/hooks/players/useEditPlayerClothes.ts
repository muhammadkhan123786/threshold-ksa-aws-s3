import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditPlayerClothingDataRequest {
    tShirtSize: string;
    pantSize: string;
    shoeSize: string;
    driFitSize: string;
}

interface EditPlayerClothingData {
    message: string;
    status: number;
    payload: any;
}

const createPlayerClothingData = async (
    id: string,
    data: EditPlayerClothingDataRequest,
): Promise<EditPlayerClothingData> => {
    return api.url(`players/${id}/clothing-data`).post(data).json<EditPlayerClothingData>();
};

const updatePlayerClothingData = async (
    id: string,
    data: EditPlayerClothingDataRequest,
): Promise<EditPlayerClothingData> => {
    return api.url(`players/${id}/clothing-data`).patch(data).json<EditPlayerClothingData>();
};

export const useCreatePlayerClothingData = (
    id: string,
    options?: UseMutationOptions<EditPlayerClothingData, Error, EditPlayerClothingDataRequest>,
): UseMutationResult<EditPlayerClothingData, Error, EditPlayerClothingDataRequest> => {
    return useMutation<EditPlayerClothingData, Error, EditPlayerClothingDataRequest>({
        mutationFn: (data) => createPlayerClothingData(id, data),
        ...options,
    });
};

export const useUpdatePlayerClothingData = (
    id: string,
    options?: UseMutationOptions<EditPlayerClothingData, Error, EditPlayerClothingDataRequest>,
): UseMutationResult<EditPlayerClothingData, Error, EditPlayerClothingDataRequest> => {
    return useMutation<EditPlayerClothingData, Error, EditPlayerClothingDataRequest>({
        mutationFn: (data) => updatePlayerClothingData(id, data),
        ...options,
    });
};
