import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ClubTeamsRequest {
    sportClubProfileId: string;
    teamId: string;
}

export const fetchClubTeamsId = async ({
    sportClubProfileId,
    teamId,
}: ClubTeamsRequest): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}`)
        .get()
        .json<any>();
    return response;
};

export const useFetchClubTeamsId = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchClubTeamsId', sportClubProfileId, teamId],
        queryFn: () => fetchClubTeamsId({ sportClubProfileId, teamId }),
        ...options,
    });
};
