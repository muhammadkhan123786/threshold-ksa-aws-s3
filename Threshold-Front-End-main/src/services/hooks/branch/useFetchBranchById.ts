import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Branch } from 'libs/types/branch';

interface BranchResponse {
    message: string;
    payload: Branch;
    status: number;
}

const fetchBranchById = async (branchId: string): Promise<BranchResponse> => {
    const response = await api.url(`/branches/${branchId}`).get().json<BranchResponse>();
    return response;
};

export const useFetchBranchById = (
    branchId: string,
    options?: UseQueryOptions<BranchResponse, Error>,
): UseQueryResult<BranchResponse, Error> => {
    return useQuery<BranchResponse, Error>({
        queryKey: ['branch', branchId],
        queryFn: () => fetchBranchById(branchId),
        ...options,
    });
};
