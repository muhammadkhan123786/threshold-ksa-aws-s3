interface FitnessDataRecord {
    date: string; // ISO 8601 date string
    value: number;
    testType: string;
    id: number;
}

interface AllFitnessDataRecord {
    date: string;
    pacer?: string;
    sit?: string;
    trunk?: string;
    push?: string;
    curl?: string;
    id: number;
}
interface FitnessDataResponse {
    athleteData: FitnessDataRecord[] | AllFitnessDataRecord[];
    teamAverageData: FitnessDataRecord[] | AllFitnessDataRecord[];
}

import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface FetchFitnessDataParams {
    athleteId: string;
    testType: 'push' | 'curl' | 'trunk' | 'sit' | 'pacer' | 'all';
    startDate: Date;
    endDate: Date;
    interval: string;
}

const fetchFitnessDataById = async (
    athleteId: string,
    testType: string,
    interval: string,
    startDate?: Date,
    endDate?: Date,
): Promise<FitnessDataResponse> => {
    // Prepare query parameters
    const queryParams: { [key: string]: string } = {
        testType,
        interval,
    };

    if (startDate) {
        queryParams.startDate = startDate.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }

    if (endDate) {
        queryParams.endDate = endDate.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    }

    const response = await api
        .url(`/athleteBatteries/${athleteId}/fitness-data`)
        .query(queryParams)
        .get()
        .json<FitnessDataResponse>();

    return response;
};
export const useFetchFitnessDataById = (
    athleteId: string,
    testType: string,
    interval: string,
    startDate?: Date,
    endDate?: Date,
    options?: UseQueryOptions<FitnessDataResponse, Error>,
): UseQueryResult<FitnessDataResponse, Error> => {
    // Convert Date objects to strings, or use undefined if not defined
    return useQuery<FitnessDataResponse, Error>({
        queryKey: ['fitnessData', athleteId, testType, startDate, endDate, interval],
        queryFn: () =>
            fetchFitnessDataById(
                athleteId,
                testType,
                interval,
                startDate ? startDate : undefined,
                endDate ? endDate : undefined,
            ),
        ...options,
    });
};
