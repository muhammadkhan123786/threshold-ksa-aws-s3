import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { AdminManager } from 'libs/types';

interface AdminManagersResponse {
    message: string;
    payload: AdminManager[];
    status: number;
}

export const fetchAdminManagers = async (): Promise<AdminManagersResponse> => {
    const response = await api.url('admin-managers').get().json<AdminManagersResponse>();
    return response;
};

export const useFetchAdminManagers = (
    options?: UseQueryOptions<{ message: string; payload: AdminManager[]; status: number }, Error>,
): UseQueryResult<{ message: string; payload: AdminManager[]; status: number }, Error> => {
    return useQuery({
        queryKey: ['adminManagers'],
        queryFn: fetchAdminManagers,
        ...options,
    });
};
