import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchContactInfoById = async (sportId: string, coachId: string): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-coaches/${coachId}/contact`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchContactInfoById = (
    sportId: string,
    coachId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['coachContactInformation', sportId, coachId],
        queryFn: () => fetchContactInfoById(sportId, coachId),
        ...options,
    });
};
