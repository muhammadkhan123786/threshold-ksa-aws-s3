import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface AthleteHealthRecordResponse {
    status: number;
    message: string;
}

interface AthleteHealthRecordData {
    type: string;
    description: string;
    startDate: string;
    endDate: string;
    medicalRecommendation: string;
}

// Function for POST request
const addAthleteHealthRecord = async (
    id: string | undefined,
    data: AthleteHealthRecordData,
): Promise<AthleteHealthRecordResponse> => {
    return api.url(`athletes/${id}/health/records`).post(data).json<AthleteHealthRecordResponse>();
};

// Function for PATCH request
const updateAthleteHealthRecord = async (
    id: string | undefined,
    recordid: string | undefined,
    data: AthleteHealthRecordData,
): Promise<AthleteHealthRecordResponse> => {
    return api
        .url(`athletes/${id}/health/records/${recordid}`)
        .patch(data)
        .json<AthleteHealthRecordResponse>();
};

// Hook for PATCH request
export const useUpdateAthleteHealthRecord = (
    id: string | undefined,
    recordid: string | undefined,
    options?: UseMutationOptions<AthleteHealthRecordResponse, Error, AthleteHealthRecordData>,
): UseMutationResult<AthleteHealthRecordResponse, Error, AthleteHealthRecordData> => {
    return useMutation<AthleteHealthRecordResponse, Error, AthleteHealthRecordData>({
        mutationFn: (data) => updateAthleteHealthRecord(id, recordid, data),
        ...options,
    });
};

// Hook for POST request
export const useAddAthleteHealthRecord = (
    id: string | undefined,
    options?: UseMutationOptions<AthleteHealthRecordResponse, Error, AthleteHealthRecordData>,
): UseMutationResult<AthleteHealthRecordResponse, Error, AthleteHealthRecordData> => {
    return useMutation<AthleteHealthRecordResponse, Error, AthleteHealthRecordData>({
        mutationFn: (data) => addAthleteHealthRecord(id, data),
        ...options,
    });
};
