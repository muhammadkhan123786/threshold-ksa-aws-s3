import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Athlete } from 'libs/types';
import api from 'services/clients/wretchClient';

interface GetTodayAthletesResponse {
    message: string;
    payload: Athlete[];
    status: number;
}

const getTodayAthletes = async (academyId: string): Promise<GetTodayAthletesResponse> => {
    if (!academyId) {
        throw new Error('Academy ID is required');
    }

    const response = await api
        .url(`/athletes/today?academyId=${academyId}`)
        .get()
        .json<GetTodayAthletesResponse>();
    return response;
};

export const useGetTodayAthletes = (
    academyId: string,
    options?: UseQueryOptions<GetTodayAthletesResponse, Error>,
): UseQueryResult<GetTodayAthletesResponse, Error> => {
    return useQuery<GetTodayAthletesResponse, Error>({
        queryKey: ['getTodayAthletes', academyId],
        queryFn: () => getTodayAthletes(academyId),
        ...options,
    });
};
