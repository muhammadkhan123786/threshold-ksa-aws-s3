import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddAthleteBiometricsRequest {
    date: Date;
    bmi: string;
    bmiPercentile: string;
    height: string;
    weight: string;
    status: string;
}

interface AddFitnessBatteryResponse {
    message: string;
    status: number;
    payload: any;
}

export const addAthleteBiometrics = async (
    data: AddAthleteBiometricsRequest,
): Promise<AddFitnessBatteryResponse> => {
    const response = await api
        .url(`athleteBiometrics`)
        .post(data)
        .json<AddFitnessBatteryResponse>();
    return response;
};

export const useAthleteBiometrics = (
    options?: UseMutationOptions<AddFitnessBatteryResponse, Error, AddAthleteBiometricsRequest>,
): UseMutationResult<AddFitnessBatteryResponse, Error, AddAthleteBiometricsRequest> => {
    return useMutation<AddFitnessBatteryResponse, Error, AddAthleteBiometricsRequest>({
        mutationFn: (data: AddAthleteBiometricsRequest) => addAthleteBiometrics(data),
        ...options,
    });
};
