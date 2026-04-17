import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ClothesTableRequest {
    sportId: string;
    page?: number;
    limit?: number;
}

export const fetchStockClothesStatus = async (
    sportId: string,
    page = 1,
    limit = 10,
): Promise<ClothesTableRequest> => {
    if (!sportId) throw new Error('Sport ID is required');
    const response = await api
        .url(`stock/clothing-status?page=${page}&limit=${limit}&sportId=${sportId}`)
        .get()
        .json<any>();
    return response;
};

export const useFetchStockClothesStatus = (
    sportId: string,
    page: number = 1,
    limit: number = 10,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchStockClothesStatus', sportId, page, limit],
        queryFn: () => fetchStockClothesStatus(sportId),
        enabled: !!sportId,
        ...options,
    });
};
