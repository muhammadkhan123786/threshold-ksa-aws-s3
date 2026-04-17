import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ClubTeamsSubGoalsRequest {
    sportClubProfileId: string;
    teamId: string;
}

export const fetchClubTeamsSubGoals = async ({
    sportClubProfileId,
    teamId,
}: ClubTeamsSubGoalsRequest): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/sub-goals`)
        .get()
        .json<any>();
    return response;
};

export const useFetchClubTeamsSubGoals = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchClubTeamsSubGoals', sportClubProfileId, teamId],
        queryFn: () => fetchClubTeamsSubGoals({ sportClubProfileId, teamId }),
        ...options,
    });
};
