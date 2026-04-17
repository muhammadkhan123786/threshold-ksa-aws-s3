import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface FetchStockClothesParams {
    sportId: string;
    page: number;
    limit: number;
}

export const fetchStockClothes = async ({
    sportId,
    page,
    limit,
}: FetchStockClothesParams): Promise<any> => {
    const response = await api
        .url(`stock?sportId=${sportId}&page=${page}&limit=${limit}`)
        .get()
        .json<any>();

    return response;
};

export const useFetchStockClothes = (
    sportId: string,
    page: number = 1,
    limit: number = 50,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any[], Error>({
        queryKey: ['fetchStockClothes', sportId, page, limit],
        queryFn: () => fetchStockClothes({ sportId, page, limit }),
        ...options,
    });
};
