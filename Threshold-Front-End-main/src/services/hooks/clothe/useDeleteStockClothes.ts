import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const deleteStockClothes = async (id: string): Promise<void> => {
    await api.url(`/delete/${id}`).delete().res();
};

export const useDeleteStockClothes = (
    options?: UseMutationOptions<void, Error, string>,
): UseMutationResult<void, Error, string> => {
    return useMutation<void, Error, string>({
        mutationFn: deleteStockClothes,
        ...options,
    });
};
