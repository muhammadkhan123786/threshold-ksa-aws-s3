import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

export const fetchStockSummarized = async (sportId: string): Promise<any> => {
    if (!sportId) throw new Error('Sport ID is required');
    const response = await api.url(`/stock/summarized?sportId=${sportId}`).get().json<any>();
    return response;
};

export const useFetchStockSummarized = (
    sportId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchClothesSummarized', sportId],
        queryFn: () => fetchStockSummarized(sportId),
        enabled: !!sportId,
        ...options,
    });
};
