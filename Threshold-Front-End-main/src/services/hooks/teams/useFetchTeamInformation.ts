import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface TeamsInfoRequest {
    teamId: string;
}

interface TeamsInfo {
    id: string;
    name: string;
    quantity: number;
    size: string[];
}

export const fetchTeamsListInfo = async ({ teamId }: TeamsInfoRequest): Promise<TeamsInfo[]> => {
    const response = await api.url(`club-teams/id=${teamId}`).get().json<any>();
    return response.data;
};

export const useFetchTeamInformation = (
    teamId: string,
    options?: UseQueryOptions<TeamsInfo[], Error>,
): UseQueryResult<TeamsInfo[], Error> => {
    return useQuery<TeamsInfo[], Error>({
        queryKey: ['fetchTeamsListTable', teamId],
        queryFn: () => fetchTeamsListInfo({ teamId }),
        staleTime: 10000,
        ...options,
    });
};
