import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ContractDetailsRequest {
    playerId: string;
}

export const fetchPlayerContractDetails = async ({
    playerId,
}: ContractDetailsRequest): Promise<any> => {
    const response = await api.url(`players/${playerId}/contract`).get().json<any>();
    return response;
};

export const useFetchPlayerContractDetails = (
    playerId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchPlayerContractDetails', playerId],
        queryFn: () => fetchPlayerContractDetails({ playerId }),
        ...options,
    });
};
