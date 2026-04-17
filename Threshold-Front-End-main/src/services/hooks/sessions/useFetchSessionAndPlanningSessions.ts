import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import api from '../../clients/wretchClient';

export interface PlanningSession {
    id: string;
    title: string;
    description: string;
    theme: string;
    space: string;
    trainingLoad: string;
    timeLoad: string;
    drillImage: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

interface Session {
    id: string;
    status: string;
    from: string;
    to: string;
    type: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    planningSessions: PlanningSession[];
}

const fetchSessionAndPlanningSessions = async (sessionId: string | any): Promise<Session> => {
    const response = await api.url(`sessions/${sessionId}/planning-sessions`).get().json<Session>();
    return response;
};

const useFetchSessionAndPlanningSessions = (
    sessionId: string | null | undefined,
    options?: UseQueryOptions<Session, Error>,
): UseQueryResult<Session, Error> => {
    return useQuery<Session, Error>({
        queryKey: ['session', sessionId],
        queryFn: () => {
            return fetchSessionAndPlanningSessions(sessionId);
        },
        ...options,
    });
};

export default useFetchSessionAndPlanningSessions;
