import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface BodyCompositionResponse {
    message: string;
    status: number;
    payload: any;
}

const fetchBodyComposition = async ({
    playerId,
    page = 0,
    capacity = 50,
    sortBy = 'createdAt',
}: {
    playerId?: string;
    page?: number;
    capacity?: number;
    sortBy?: string;
}): Promise<any> => {
    const response = await api
        .url(
            `athleteBiometrics?sortBy=${sortBy}&${
                playerId ? `athlete[id]=${playerId}&` : ''
            }page=${page}&capacity=${capacity}`,
        )
        .get()
        .json<BodyCompositionResponse>();

    return response.payload; // Return just the payload data
};

// Custom hook to fetch body composition using useQuery
export const useFetchBodyComposition = (
    playerId: string | undefined,
    page: number = 0,
    capacity: number = 50,
    sortBy: string = 'createdAt',
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['bodyComposition', playerId, page, capacity, sortBy],
        queryFn: () => fetchBodyComposition({ playerId, page, capacity, sortBy }),
        ...options,
    });
};
