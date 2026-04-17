import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface PlayersTableRequest {
    sportId: string;
    page?: number;
    limit?: number;
    search?: string;
}

export const fetchPlayersTable = async ({
    sportId,
    page = 1,
    limit = 10,
    search = '',
}: PlayersTableRequest): Promise<any> => {
    const response = await api
        .url(`/players?sportId=${sportId}&page=${page}&limit=${limit}&search=${search}`)
        .get()
        .json<any>();

    return response.data;
};

export const useFetchPlayersTable = (
    sportId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchPlayersTable', sportId, page, limit, search],
        queryFn: () => fetchPlayersTable({ sportId, page, limit, search }),
        staleTime: 10000,
        ...options,
    });
};
