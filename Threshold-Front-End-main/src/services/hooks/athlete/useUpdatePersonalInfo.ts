import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface PersonalInfoRequest {
    firstName: string;
    lastName: string;
    joinDate: string; // ISO 8601 date string
    level: string;
    experience: string;
    education: string;
    schoolName: string;
    dateOfBirth: string; // ISO 8601 date string
    gender: 'male' | 'female';
    nationality: string;
    nin: string;
}

interface PersonalInfoResponse {
    status: number;
    message: string;
}

const updatePersonalInfo = async (
    id: string | undefined,
    data: PersonalInfoRequest,
): Promise<PersonalInfoResponse> => {
    return api.url(`athletes/${id}/personal-info`).patch(data).json<PersonalInfoResponse>();
};

export const useUpdatePersonalInfo = (
    id: string | undefined,
    options?: UseMutationOptions<PersonalInfoResponse, Error, PersonalInfoRequest>,
): UseMutationResult<PersonalInfoResponse, Error, PersonalInfoRequest> => {
    return useMutation<PersonalInfoResponse, Error, PersonalInfoRequest>({
        mutationFn: (data) => updatePersonalInfo(id, data),
        ...options,
    });
};
