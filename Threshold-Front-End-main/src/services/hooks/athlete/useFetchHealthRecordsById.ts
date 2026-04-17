import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface HealthRecord {
    id: string;
    type: string;
    description: string;
    startDate: string;
    endDate: string;
    medicalRecommendation: string;
    dateOfUpdating: string;
}

interface HealthRecordsResponse {
    message: string;
    records: HealthRecord[];
}

const fetchHealthRecordsById = async (athleteId: string): Promise<HealthRecordsResponse> => {
    const response = await api
        .url(`/athletes/${athleteId}/health/records`)
        .get()
        .json<HealthRecordsResponse>();
    return response;
};

export const useFetchHealthRecordsById = (
    athleteId: string,
    options?: UseQueryOptions<HealthRecordsResponse, Error>,
): UseQueryResult<HealthRecordsResponse, Error> => {
    return useQuery<HealthRecordsResponse, Error>({
        queryKey: ['healthRecords', athleteId],
        queryFn: () => fetchHealthRecordsById(athleteId),
        ...options,
    });
};
