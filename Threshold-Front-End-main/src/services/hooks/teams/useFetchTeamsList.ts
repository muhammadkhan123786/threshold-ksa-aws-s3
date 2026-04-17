import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface TeamsTableRequest {
    sportId: string;
    page?: number;
    limit?: number;
}

export const fetchTeamsListTable = async ({
    sportId,
    page,
    limit,
}: TeamsTableRequest): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/teams?page=${page}&limit=${limit}`)
        .get()
        .json<any>();
    return response;
};

export const useFetchTeamsTable = (
    sportId: string,
    page: number = 1,
    limit: number = 10,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchTeamsListTable', sportId, page, limit],
        queryFn: () => fetchTeamsListTable({ sportId, page, limit }),
        ...options,
    });
};
