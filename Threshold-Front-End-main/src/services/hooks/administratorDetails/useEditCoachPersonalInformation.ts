import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

// Updated request interface for coach personal information
export interface EditCoachPersonalInformationRequest {
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
    nationality: string;
    country: string;
    experience: number;
    levelEducation: string;
    schoolName: string;
    joinDate: string;
    playingFor: string;
    roleType: string;
    languages: any;
    avatar?: File | null;
}

interface EditCoachPersonalInformation {
    message: string;
    status: number;
    payload: any;
}

// API call for editing coach personal information
export const editCoachPersonalInformation = async (
    sportId: string,
    coachId: string,
    data: EditCoachPersonalInformationRequest,
): Promise<EditCoachPersonalInformation> => {
    const { avatar, ...rest } = data;
    const formData = new FormData();

    if (avatar) formData.append('avatar', avatar);

    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value.toString());
            }
        }
    });

    const response = await api
        .url(`/sportClubProfile/${sportId}/club-admin/${coachId}/personal-information`)
        .patch(formData)
        .json<EditCoachPersonalInformation>();

    return response;
};

// Hook for using the mutation for editing coach personal information
export const useEditPersonalInformation = (
    sportId: string,
    coachId: string,
    options?: UseMutationOptions<
        EditCoachPersonalInformation,
        Error,
        EditCoachPersonalInformationRequest
    >,
): UseMutationResult<EditCoachPersonalInformation, Error, EditCoachPersonalInformationRequest> => {
    return useMutation<EditCoachPersonalInformation, Error, EditCoachPersonalInformationRequest>({
        mutationFn: (data: EditCoachPersonalInformationRequest) =>
            editCoachPersonalInformation(sportId, coachId, data),
        ...options,
    });
};
