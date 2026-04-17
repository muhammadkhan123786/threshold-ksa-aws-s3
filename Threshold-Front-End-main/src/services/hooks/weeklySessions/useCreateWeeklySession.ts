import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface WeeklySession {
    title: string;
    description?: string;
    weekTarget: number;
    weekDate: string;
    sessionDays: { date: string }[];
}

interface CreateWeeklySessionResponse {
    message: string;
    payload: {
        id: string;
        title: string;
        description: string;
        weekTarget: number;
        weekDate: string;
        sessionDays: { date: string }[];
        academy: { id: string };
        team: { id: string };
        createdAt: string;
        updatedAt: string;
    };
    status: number;
}

const createWeeklySession = async (
    teamId: string,
    weeklySession: WeeklySession,
): Promise<CreateWeeklySessionResponse> => {
    const response = await api
        .url(`/weekly-sessions?team_id=${teamId}`)
        .post(weeklySession)
        .json<CreateWeeklySessionResponse>();
    return response;
};

export const useCreateWeeklySession = (
    options?: UseMutationOptions<
        CreateWeeklySessionResponse,
        Error,
        { teamId: string; weeklySession: WeeklySession }
    >,
): UseMutationResult<
    CreateWeeklySessionResponse,
    Error,
    { teamId: string; weeklySession: WeeklySession }
> => {
    return useMutation<
        CreateWeeklySessionResponse,
        Error,
        { teamId: string; weeklySession: WeeklySession }
    >({
        mutationFn: ({ teamId, weeklySession }) => createWeeklySession(teamId, weeklySession),
        ...options,
    });
};
