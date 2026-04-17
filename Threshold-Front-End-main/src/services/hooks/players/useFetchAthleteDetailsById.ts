import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchAthleteDetailsById = async (id: string): Promise<any> => {
    const response = await api.url(`players/${id}`).get().json<any>();
    return response.payload;
};

export const useFetchAthleteDetailsById = (
    id?: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['playersDetailsData', id],
        queryFn: () => fetchAthleteDetailsById(id as string),
        enabled: !!id,
        refetchOnWindowFocus: true,
        ...options,
    });
};
