import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
const fetchDocumentsById = async (playerId: string): Promise<any> => {
    const response = await api.url(`players/${playerId}/documents`).get().json<any>();
    return response;
};

export const useFetchPlayerDocumentsById = (
    playerId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['useFetchPlayerDocumentsById', playerId],
        queryFn: () => fetchDocumentsById(playerId),
        ...options,
    });
};
