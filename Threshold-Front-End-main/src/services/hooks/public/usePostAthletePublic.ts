import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface CreateAthleteRequest {
    academyId: string;
    deviceIdentifier: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    contactNumber: string;
    dateOfBirth: string;
    joinDate: string;
    nin: string;
    ninExpirationDate: string;
    dateOfUpdating: string;
    allergies: { label: string; value: string };
    chronic: { label: string; value: string }[];
    injury: { label: string; value: string };
    consideration: { label: string; value: string };
    relationship: { label: string; value: string };
    nationality: { label: string; value: string };
    education: { label: string; value: string };
    gender: { label: string; value: string };
    periodOfSubscription: { label: string; value: string };
    paymentMethod: { label: string; value: string };
    cashValue: number;
    remainingValue: number;
}

interface CreateAthleteResponse {
    message: string;
}

const athletePublic = async (request: CreateAthleteRequest): Promise<CreateAthleteResponse> => {
    const { academyId, deviceIdentifier, ...rest } = request;

    const response = await api
        .url(`public/${academyId}/${deviceIdentifier}`)
        .post(request)
        .json<CreateAthleteResponse>();
    return response;
};

export const usePostAthletePublic = (
    options?: UseMutationOptions<CreateAthleteResponse, Error, CreateAthleteRequest, unknown>,
): UseMutationResult<CreateAthleteResponse, Error, CreateAthleteRequest, unknown> => {
    return useMutation<CreateAthleteResponse, Error, CreateAthleteRequest, unknown>({
        mutationFn: athletePublic,
        ...options,
    });
};
