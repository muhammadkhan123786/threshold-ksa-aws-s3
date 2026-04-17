import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface Session {
    type: string;
    from: string;
    to: string;
    date: Date | undefined;
}

interface CreateSessionResponse {
    message: string;
    payload: {
        id: string;
        type: string;
        from: string;
        to: string;
        date: string;
        createdAt: string;
        updatedAt: string;
    };
    status: number;
}

const createSessionUnderWeeklySession = async (
    weeklySessionId: string,
    sessionDetails: Session,
): Promise<CreateSessionResponse> => {
    const response = await api
        .url(`weekly-sessions/${weeklySessionId}/sessions`)
        .post(sessionDetails)
        .json<CreateSessionResponse>();
    return response;
};

export const useCreateSessionUnderWeeklySession = (
    options?: UseMutationOptions<
        CreateSessionResponse,
        Error,
        { weeklySessionId: string; sessionDetails: Session }
    >,
): UseMutationResult<
    CreateSessionResponse,
    Error,
    { weeklySessionId: string; sessionDetails: Session }
> => {
    return useMutation<
        CreateSessionResponse,
        Error,
        { weeklySessionId: string; sessionDetails: Session }
    >({
        mutationFn: ({ weeklySessionId, sessionDetails }) =>
            createSessionUnderWeeklySession(weeklySessionId, sessionDetails),
        ...options,
    });
};
