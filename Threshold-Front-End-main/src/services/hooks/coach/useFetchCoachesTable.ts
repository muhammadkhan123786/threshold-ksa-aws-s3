import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface CoachTableRequest {
    sportId: string;
    page?: number;
    limit?: number;
}

export const fetchCoachesTable = async ({
    sportId,
    page = 1,
    limit = 10,
}: CoachTableRequest): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-coaches?page=${page}&limit=${limit}&sortOrder=ASC`)
        .get()
        .json<any>();
    return response;
};

export const useFetchCoachesTable = (
    sportId: string,
    page: number = 1,
    limit: number = 10,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchCoachesTable', page, limit],
        queryFn: () => fetchCoachesTable({ sportId, page, limit }),
        staleTime: 0,
        ...options,
    });
};
