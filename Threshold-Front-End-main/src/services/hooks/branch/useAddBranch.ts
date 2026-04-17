import api from '../../clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface AddBranchRequest {
    name: string;
    description?: string;
}

interface AddBranchResponse {
    status: number;
    message: string;
    branchId?: string;
}

const addBranch = async (request: AddBranchRequest): Promise<AddBranchResponse> => {
    const response = await api.url('branches/create').post(request).json<AddBranchResponse>();
    return response;
};

export const useAddBranch = (
    options?: UseMutationOptions<AddBranchResponse, Error, AddBranchRequest, unknown>,
): UseMutationResult<AddBranchResponse, Error, AddBranchRequest, unknown> => {
    return useMutation<AddBranchResponse, Error, AddBranchRequest, unknown>({
        mutationFn: addBranch,
        ...options,
    });
};
