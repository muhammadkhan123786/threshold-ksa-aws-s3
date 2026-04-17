import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Branch } from 'libs/types/branch';

interface BranchesResponse {
    message: string;
    payload: Branch[];
    status: number;
}

const fetchBranches = async (): Promise<BranchesResponse> => {
    const response = await api.url('/branches').get().json<BranchesResponse>();
    return response;
};

export const useFetchBranches = (
    options?: UseQueryOptions<BranchesResponse, Error>,
): UseQueryResult<BranchesResponse, Error> => {
    return useQuery<BranchesResponse, Error>({
        queryKey: ['branches'],
        queryFn: () => {
            return fetchBranches();
        },
        ...options,
    });
};
