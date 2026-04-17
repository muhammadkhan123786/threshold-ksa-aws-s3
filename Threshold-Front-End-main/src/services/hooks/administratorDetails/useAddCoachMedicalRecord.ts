import api from 'services/clients/wretchClient';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    UseQueryResult,
    UseQueryOptions,
    useQuery,
} from '@tanstack/react-query';

interface CoachMedicalRecordResponse {
    status: number;
    message: string;
}

interface CoachMedicalRecordData {
    type: string;
    description: string;
    startDate: string;
    endDate: string;
    medicalRecommendation: string;
}

interface HealthRecord {
    id: string;
    type: string;
    description: string;
    startDate: string;
    endDate: string;
    medicalRecommendation: string;
    dateOfUpdating: string;
}

interface MedicalRecordsResponse {
    message: string;
    records: HealthRecord[];
}

// Function for POST request
const addCoachMedicalRecord = async (
    id: string | undefined,
    data: CoachMedicalRecordData,
): Promise<CoachMedicalRecordResponse> => {
    return api.url(`athletes/${id}/health/records`).post(data).json<CoachMedicalRecordResponse>();
};

// Function for PATCH request
const updateCoachMedicalRecord = async (
    id: string | undefined,
    recordid: string | undefined,
    data: CoachMedicalRecordData,
): Promise<CoachMedicalRecordResponse> => {
    return api
        .url(`athletes/${id}/health/records/${recordid}`)
        .patch(data)
        .json<CoachMedicalRecordResponse>();
};

// Hook for PATCH request
export const useUpdateCoachMedicalRecord = (
    id: string | undefined,
    recordid: string | undefined,
    options?: UseMutationOptions<CoachMedicalRecordResponse, Error, CoachMedicalRecordData>,
): UseMutationResult<CoachMedicalRecordResponse, Error, CoachMedicalRecordData> => {
    return useMutation<CoachMedicalRecordResponse, Error, CoachMedicalRecordData>({
        mutationFn: (data) => updateCoachMedicalRecord(id, recordid, data),
        ...options,
    });
};

// Hook for POST request
export const useAddCoachMedicalRecord = (
    id: string | undefined,
    options?: UseMutationOptions<CoachMedicalRecordResponse, Error, CoachMedicalRecordData>,
): UseMutationResult<CoachMedicalRecordResponse, Error, CoachMedicalRecordData> => {
    return useMutation<CoachMedicalRecordResponse, Error, CoachMedicalRecordData>({
        mutationFn: (data) => addCoachMedicalRecord(id, data),
        ...options,
    });
};

const fetchMedicalRecordsById = async (athleteId: string): Promise<MedicalRecordsResponse> => {
    const response = await api
        .url(`athletes/${athleteId}/health/records`)
        .get()
        .json<MedicalRecordsResponse>();
    return response;
};

export const useFetchMedicalRecordsById = (
    athleteId: string,
    options?: UseQueryOptions<MedicalRecordsResponse, Error>,
): UseQueryResult<MedicalRecordsResponse, Error> => {
    return useQuery<MedicalRecordsResponse, Error>({
        queryKey: ['MedicalRecords', athleteId],
        queryFn: () => fetchMedicalRecordsById(athleteId),
        ...options,
    });
};
