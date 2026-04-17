import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchPersonalInfoById = async (sportId: string, coachId: string): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-admin/${coachId}/personal-information`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchPersonalInfoById = (
    sportId: string,
    coachId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['personalInformation', coachId],
        queryFn: () => fetchPersonalInfoById(sportId, coachId),
        ...options,
    });
};
