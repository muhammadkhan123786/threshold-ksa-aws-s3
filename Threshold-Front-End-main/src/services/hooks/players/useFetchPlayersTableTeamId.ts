import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface PlayersTableTeamIdRequest {
    sportClubProfileId: string;
    teamId: string;
}

export const fetchPlayersTableTeamId = async ({
    sportClubProfileId,
    teamId,
}: PlayersTableTeamIdRequest): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/players`)
        .get()
        .json<any>();
    return response;
};

export const useFetchPlayersTableTeamId = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchPlayersTableDataTeamId', sportClubProfileId, teamId],
        queryFn: () => fetchPlayersTableTeamId({ sportClubProfileId, teamId }),
        ...options,
    });
};
