import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface MedicalInfoResponse {
    status: number;
    message: string;
}

const updateMedicalInfo = async (
    id: string | undefined,
    data: FormData, // We're using FormData to handle file uploads
): Promise<MedicalInfoResponse> => {
    return api
        .url(`athletes/${id}/health/medical-info`)

        .patch(data)
        .json<MedicalInfoResponse>();
};

export const useUpdateMedicalInfo = (
    id: string | undefined,
    options?: UseMutationOptions<MedicalInfoResponse, Error, FormData>,
): UseMutationResult<MedicalInfoResponse, Error, FormData> => {
    return useMutation<MedicalInfoResponse, Error, FormData>({
        mutationFn: (data) => updateMedicalInfo(id, data),
        ...options,
    });
};
