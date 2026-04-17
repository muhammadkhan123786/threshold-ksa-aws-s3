import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchDocumentsById = async (sportId: string, coachId: string): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-coaches/${coachId}/document`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchDocumentsById = (
    sportId: string,
    coachId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['coachDocuments', coachId],
        queryFn: () => fetchDocumentsById(sportId, coachId),
        ...options,
    });
};
