import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Branch } from 'libs/types/branch';

interface AthleteSession {
    presentSessions: number;
    absentSessions: number;
    injurySessions: number;
}

interface AthletesSessions {
    summary: AthleteSession;
}

const fetchAthelteSessionsyId = async (branchId: string): Promise<AthletesSessions> => {
    const response = await api
        .url(`sessions/athletes/${branchId}/summary`)
        .get()
        .json<AthletesSessions>();
    return response;
};

export const useFetchAtheleteSessions = (
    branchId: string,
    options?: UseQueryOptions<AthletesSessions, Error>,
): UseQueryResult<AthletesSessions, Error> => {
    return useQuery<AthletesSessions, Error>({
        queryKey: ['AathelteSessions', branchId],
        queryFn: () => fetchAthelteSessionsyId(branchId),
        ...options,
    });
};
