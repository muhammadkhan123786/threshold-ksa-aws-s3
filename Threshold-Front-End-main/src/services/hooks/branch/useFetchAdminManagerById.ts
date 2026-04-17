import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { AdminManager } from 'libs/types';

interface AdminManagerResponse {
    message: string;
    payload: AdminManager[];
    status: number;
}

export const fetchAdminManagerById = async (
    adminManagerId: string,
): Promise<AdminManagerResponse> => {
    const response = await api
        .url(`/users/admin-managers/${adminManagerId}`)
        .get()
        .json<AdminManagerResponse>();
    return response;
};

export const useFetchAdminManagerById = (
    adminManagerId: string,
    options?: UseQueryOptions<{ message: string; payload: AdminManager[]; status: number }, Error>,
): UseQueryResult<{ message: string; payload: AdminManager[]; status: number }, Error> => {
    return useQuery({
        queryKey: ['adminManager', adminManagerId],
        queryFn: () => fetchAdminManagerById(adminManagerId),
        ...options,
    });
};
