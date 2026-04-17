import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

export const fetchSizeClothes = async (sportId: string): Promise<any> => {
    const response = await api.url(`/stock/categories?sportId=${sportId}`).get().json<any>();
    return response.data;
};

export const useFetchSizeClothes = (
    sportId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchSizeClothes', sportId],
        queryFn: () => fetchSizeClothes(sportId),
        ...options,
    });
};
