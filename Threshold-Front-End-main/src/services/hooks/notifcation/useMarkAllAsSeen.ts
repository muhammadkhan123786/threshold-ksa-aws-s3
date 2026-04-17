import { UseMutationOptions, UseMutationResult, useMutation } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const markAllAsSeen = async (topic: string): Promise<void> => {
    await api.url('/notifications/mark-all-as-seen').post({ topic }).res();
};

export const useMarkAllAsSeen = (
    options?: UseMutationOptions<void, Error, string, unknown>,
): UseMutationResult<void, Error, string, unknown> => {
    return useMutation<void, Error, string, unknown>({
        mutationFn: (topic) => markAllAsSeen(topic),
        ...options,
    });
};
