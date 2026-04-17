import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ClubTeamsDetailsRequest {
    sportClubProfileId: string;
    teamId: string;
}

export const fetchClubTeamsIdDetails = async ({
    sportClubProfileId,
    teamId,
}: ClubTeamsDetailsRequest): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/details`)
        .get()
        .json<any>();
    return response;
};

export const useFetchClubTeamsIdDetails = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchClubTeamsIdDetails', sportClubProfileId, teamId],
        queryFn: () => fetchClubTeamsIdDetails({ sportClubProfileId, teamId }),
        ...options,
    });
};
