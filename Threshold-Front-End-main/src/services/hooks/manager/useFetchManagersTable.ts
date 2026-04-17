import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ManagersTableRequest {
    clubId: string;
    page: number;
    limit: number;
}

export const fetchManagersTable = async ({
    clubId,
    page = 1,
    limit = 10,
}: ManagersTableRequest): Promise<any> => {
    const response = await api
        .url(`club/${clubId}/manager?page=${page}&limit=${limit}&sortOrder=ASC`)
        .get()
        .json<any>();

    return response;
};

export const useFetchManagersTable = (
    clubId: string,
    page: number = 1,
    limit: number = 10,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchManagersTable', clubId, page, limit],
        queryFn: () => fetchManagersTable({ clubId, page, limit }),
        staleTime: 10000,
        ...options,
    });
};
