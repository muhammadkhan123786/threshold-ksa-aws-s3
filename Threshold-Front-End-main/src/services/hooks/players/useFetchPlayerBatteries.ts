import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface PlayerBatteriesResponse {
    message: string;
    status: number;
    payload: any;
}

const fetchPlayerBatteries = async ({
    athleteId,
    page = 0,
    capacity = 50,
    sortBy = 'createdAt',
}: {
    athleteId?: string;
    page?: number;
    capacity?: number;
    sortBy?: string;
}): Promise<any> => {
    const response = await api
        .url(
            `athleteBatteries?sortBy=${sortBy}&${
                athleteId ? `athlete[id]=${athleteId}&` : ''
            }page=${page}&capacity=${capacity}`,
        )
        .get()
        .json<PlayerBatteriesResponse>();

    return response.payload; // Return just the payload data
};

// Custom hook to fetch player batteries using useQuery
export const useFetchPlayerBatteries = (
    athleteId: string | undefined,
    page: number = 0,
    capacity: number = 50,
    sortBy: string = 'createdAt',
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['playerBatteries', athleteId, page, capacity, sortBy],
        queryFn: () => fetchPlayerBatteries({ athleteId, page, capacity, sortBy }),
        ...options,
    });
};
