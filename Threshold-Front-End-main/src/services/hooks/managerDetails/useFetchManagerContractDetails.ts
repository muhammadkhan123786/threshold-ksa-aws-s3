import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ContractDetailsRequest {
    academyId: string;
    managerId: string;
}

export const fetchManagerContractDetails = async ({
    academyId,
    managerId,
}: ContractDetailsRequest): Promise<any> => {
    const response = await api
        .url(`club/${academyId}/manager/${managerId}/contract`)
        .get()
        .json<any>();
    return response;
};

export const useFetchManagerContractDetails = (
    academyId: string,
    managerId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetManagerContractDetails', academyId, managerId],
        queryFn: () => fetchManagerContractDetails({ academyId, managerId }),
        ...options,
    });
};
