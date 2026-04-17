import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface CoachesTableRequest {
    sportId: string;
    page?: number;
    limit?: number;
    search?: string;
}

export const fetchCoachesTable = async ({
    sportId,
    page = 1,
    limit = 10,
    search = '',
}: CoachesTableRequest): Promise<any> => {
    const response = await api
        .url(
            `sportClubProfile/${sportId}/club-coaches?page=${page}&limit=${limit}&search=${search}`,
        )
        .get()
        .json<any>();
    return response;
};

export const useFetchCoachesTable = (
    sportId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchCoachesTable', sportId, page, limit, search],
        queryFn: () => fetchCoachesTable({ sportId, page, limit, search }),
        staleTime: 10000,
        ...options,
    });
};
