import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AthleteBiometricsResponse {
    message: string;
    status: number;
    payload: any;
}

const fetchAthleteBiometrics = async ({
    athleteId,
    page = 0,
    capacity = 5,
    sortBy = 'createdAt',
}: {
    athleteId?: string;
    page?: number;
    capacity?: number;
    sortBy?: string;
}): Promise<AthleteBiometricsResponse> => {
    const response = await api
        .url(`/athleteBiometrics?sortBy=${sortBy}&${athleteId}page=${page}&capacity=${capacity}`)
        .get()
        .json<AthleteBiometricsResponse>();
    return response;
};

// Custom hook to fetch athlete biometrics using useQuery
export const useFetchAthleteBiometrics = (
    athleteId: string | undefined,
    page: number = 0,
    capacity: number = 5,
    sortBy: string = 'createdAt',
    options?: UseQueryOptions<AthleteBiometricsResponse, Error>,
): UseQueryResult<AthleteBiometricsResponse, Error> => {
    return useQuery<AthleteBiometricsResponse, Error>({
        queryKey: ['athleteBiometrics', athleteId, page, capacity, sortBy],
        queryFn: () => fetchAthleteBiometrics({ athleteId, page, capacity, sortBy }),
        ...options,
    });
};
