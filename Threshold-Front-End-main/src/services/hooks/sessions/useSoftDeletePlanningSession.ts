import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const softDeletePlanningSession = async (sessionId: string): Promise<void> => {
    await api.url(`sessions/${sessionId}/planning-sessions/soft-delete`).delete().res();
};

const useSoftDeletePlanningSession = (
    options?: UseMutationOptions<void, Error, string>,
): UseMutationResult<void, Error, string> => {
    return useMutation<void, Error, string>({
        mutationFn: softDeletePlanningSession,
        ...options,
    });
};

export default useSoftDeletePlanningSession;
