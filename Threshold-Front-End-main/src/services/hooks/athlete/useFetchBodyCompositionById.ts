interface BodyCompositionRecord {
    date: string; // ISO 8601 date string
    bmi: string;
    weight: string;
    height: string;
}

type BodyCompositionResponse = BodyCompositionRecord[];
import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

const fetchBodyCompositionById = async (
    athleteId: string,
    startDate?: string, // ISO 8601 date string
    endDate?: string, // ISO 8601 date string
): Promise<BodyCompositionResponse> => {
    const response = await api
        .url(`/athleteBiometrics/${athleteId}/body-composition`)
        .query({
            startDate,
            endDate,
        })
        .get()
        .json<BodyCompositionResponse>();
    return response;
};

export const useFetchBodyCompositionById = (
    athleteId: string,
    startDate?: Date,
    endDate?: Date,
    options?: UseQueryOptions<BodyCompositionResponse, Error>,
): UseQueryResult<BodyCompositionResponse, Error> => {
    return useQuery<BodyCompositionResponse, Error>({
        queryKey: ['bodyComposition', athleteId, startDate, endDate],
        queryFn: () =>
            fetchBodyCompositionById(
                athleteId,
                startDate ? startDate.toISOString() : undefined,
                endDate ? endDate.toISOString() : undefined,
            ),
        ...options,
    });
};
