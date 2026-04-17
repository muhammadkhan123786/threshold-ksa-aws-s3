import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

export const fetchClubTeamsMainGoals = async ({
    sportClubProfileId,
    teamId,
}: any): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/main-goal`)
        .get()
        .json<any>();
    return response;
};

export const useFetchClubTeamsMainGoals = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchClubTeamsMainGoals', sportClubProfileId, teamId],
        queryFn: () => fetchClubTeamsMainGoals({ sportClubProfileId, teamId }),
        ...options,
    });
};
