import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddFitnessBatteryRequest {
    pacer: string;
    sit: string;
    trunk: string;
    push: string;
    curl: string;
    date: string;
    athlete: string;
}

interface AddFitnessBatteryResponse {
    message: string;
    status: number;
    payload: any;
}

// API function to send the request to add the fitness battery
export const addFitnessBattery = async (
    data: AddFitnessBatteryRequest,
): Promise<AddFitnessBatteryResponse> => {
    const response = await api.url(`athleteBatteries`).post(data).json<AddFitnessBatteryResponse>();
    return response;
};

// Custom hook to use the mutation
export const useAddFitnessBattery = (
    options?: UseMutationOptions<AddFitnessBatteryResponse, Error, AddFitnessBatteryRequest>,
): UseMutationResult<AddFitnessBatteryResponse, Error, AddFitnessBatteryRequest> => {
    return useMutation<AddFitnessBatteryResponse, Error, AddFitnessBatteryRequest>({
        mutationFn: (data: AddFitnessBatteryRequest) => addFitnessBattery(data),
        ...options,
    });
};
