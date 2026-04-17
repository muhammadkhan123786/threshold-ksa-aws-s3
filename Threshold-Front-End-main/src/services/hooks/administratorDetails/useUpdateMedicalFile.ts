import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface MedicalFileResponse {
    status: number;
    message: string;
}

interface AddMedicalFileRequest {
    medicalFile: File;
}

const updateMedicalInfo = async (
    id: string | undefined,
    data: FormData,
): Promise<MedicalFileResponse> => {
    return api
        .url(`athletes/${id}/health/medical-info`)

        .patch(data)
        .json<MedicalFileResponse>();
};

const createMedicalFile = async (
    id: string | undefined,
    data: FormData,
): Promise<MedicalFileResponse> => {
    return api.url(`coaches/${id}/bank-data`).post(data).json<MedicalFileResponse>();
};

export const useCreateMedicalFile = (
    id: string | undefined,
    options?: UseMutationOptions<MedicalFileResponse, Error, AddMedicalFileRequest>,
): UseMutationResult<MedicalFileResponse, Error, AddMedicalFileRequest> => {
    return useMutation<MedicalFileResponse, Error, AddMedicalFileRequest>({
        mutationFn: (data) => {
            const formData = new FormData();
            formData.append('medicalFile', data.medicalFile);
            return createMedicalFile(id, formData);
        },
        ...options,
    });
};

export const useUpdateMedicalFile = (
    id: string | undefined,
    options?: UseMutationOptions<MedicalFileResponse, Error, FormData>,
): UseMutationResult<MedicalFileResponse, Error, FormData> => {
    return useMutation<MedicalFileResponse, Error, FormData>({
        mutationFn: (data) => updateMedicalInfo(id, data),
        ...options,
    });
};
