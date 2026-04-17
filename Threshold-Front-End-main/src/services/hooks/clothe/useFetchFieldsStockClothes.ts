import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

export const fetchFieldsStockClothes = async (athleteId: string): Promise<any> => {
    if (!athleteId) throw new Error('Athlete ID is required');
    const response = await api.url(`/stock/fields?athleteId=${athleteId}`).get().json<any>();
    return response;
};

// Hook to fetch stock fields with optional query options
export const useFetchFieldsStockClothes = (
    athleteId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchFieldsStockClothes', athleteId],
        queryFn: () => fetchFieldsStockClothes(athleteId),
        enabled: !!athleteId,
        ...options,
    });
};
