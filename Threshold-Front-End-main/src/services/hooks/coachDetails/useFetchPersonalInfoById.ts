import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchPersonalInfoById = async (sportId: string, coachId: string): Promise<any> => {
    const response = await api
        .url(`/sportClubProfile/${sportId}/club-coaches/${coachId}/personal-information`)
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
        queryKey: ['coachPersonalInformation', sportId, coachId],
        queryFn: () => fetchPersonalInfoById(sportId, coachId),
        ...options,
    });
};
