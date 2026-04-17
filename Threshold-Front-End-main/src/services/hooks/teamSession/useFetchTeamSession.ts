import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface TeamSessionRequest {
    teamId: string;
}

export const fetchTeamSession = async ({ teamId }: TeamSessionRequest): Promise<any[]> => {
    const response = await api.url(`weekly-sessions?teamId=${teamId}`).get().json<any>();
    return response;
};

export const useFetchTeamSession = (
    teamId: string,
    options?: UseQueryOptions<any[], Error>,
): UseQueryResult<any[], Error> => {
    return useQuery<any[], Error>({
        queryKey: ['fetchTeamSession', teamId],
        queryFn: () => fetchTeamSession({ teamId }),
        staleTime: 10000,
        ...options,
    });
};
