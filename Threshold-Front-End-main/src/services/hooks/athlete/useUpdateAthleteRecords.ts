import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface AthleteRecordUpdateResponse {
    status: number;
    message: string;
}

interface AthleteRecordUpdateData {
    category: string;
    subcategory?: string;
    personalRecord?: number;
    bestRecord?: number;
    lastRecord?: number;
}

const addAthleteRecords = async (
    id: string | undefined,
    data: AthleteRecordUpdateData,
): Promise<AthleteRecordUpdateResponse> => {
    return api.url(`/athletes/${id}/records`).post(data).json<AthleteRecordUpdateResponse>();
};

const updateAthleteRecords = async (
    id: string | undefined,
    recordid: string | undefined,
    data: AthleteRecordUpdateData,
): Promise<AthleteRecordUpdateResponse> => {
    return api
        .url(`/athletes/${id}/records/${recordid}`)
        .patch(data)
        .json<AthleteRecordUpdateResponse>();
};

export const useUpdateAthleteRecords = (
    id: string | undefined,
    recordid: string | undefined,
    options?: UseMutationOptions<AthleteRecordUpdateResponse, Error, AthleteRecordUpdateData>,
): UseMutationResult<AthleteRecordUpdateResponse, Error, AthleteRecordUpdateData> => {
    return useMutation<AthleteRecordUpdateResponse, Error, AthleteRecordUpdateData>({
        mutationFn: (data) => updateAthleteRecords(id, recordid, data),
        ...options,
    });
};

export const useAddAthleteRecords = (
    id: string | undefined,
    options?: UseMutationOptions<AthleteRecordUpdateResponse, Error, AthleteRecordUpdateData>,
): UseMutationResult<AthleteRecordUpdateResponse, Error, AthleteRecordUpdateData> => {
    return useMutation<AthleteRecordUpdateResponse, Error, AthleteRecordUpdateData>({
        mutationFn: (data) => addAthleteRecords(id, data),
        ...options,
    });
};
