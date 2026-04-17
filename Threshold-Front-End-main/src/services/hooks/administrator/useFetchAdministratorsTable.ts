import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AdministratorsTableRequest {
    sportId: string;
    page?: number;
    limit?: number;
    search?: string;
}

export const fetchAdministratorsTable = async ({
    sportId,
    page = 1,
    limit = 10,
    search = '',
}: AdministratorsTableRequest): Promise<any> => {
    const response = await api
        .url(
            `sportClubProfile/${sportId}/club-admin?page=${page}&limit=${limit}&search=${search}&sortOrder=ASC`,
        )
        .get()
        .json<any>();
    return response;
};

export const useFetchAdministratorsTable = (
    sportId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchAdministratorsTable', sportId, page, limit, search],
        queryFn: () => fetchAdministratorsTable({ sportId, page, limit, search }),
        ...options,
    });
};
