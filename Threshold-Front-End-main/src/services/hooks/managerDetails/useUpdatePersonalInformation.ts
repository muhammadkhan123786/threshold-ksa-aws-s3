import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

// Updated request interface for coach personal information
interface EditPersonalInformationRequest {
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
    nationality: string;
    country: string;
    experience: number;
    educationalLevel: string;
    schoolName: string;
    joinDate: string;
    managementType: string;
    sportType: string;
    contractDuration: string;
    languages: any;
    avatar?: File | null;
}

interface EditCoachPersonalInformation {
    message: string;
    status: number;
    payload: any;
}

// API call for editing coach personal information
export const editPersonalInformation = async (
    academyId: string,
    id: string,
    data: EditPersonalInformationRequest,
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
        .url(`club/${academyId}/manager/${id}/personal-information`)
        .patch(formData)
        .json<EditCoachPersonalInformation>();
    return response;
};

// Hook for using the mutation for editing coach personal information
export const useUpdatePersonalInformation = (
    academyId: string,
    id: string,
    options?: UseMutationOptions<
        EditCoachPersonalInformation,
        Error,
        EditPersonalInformationRequest
    >,
): UseMutationResult<EditCoachPersonalInformation, Error, EditPersonalInformationRequest> => {
    return useMutation<EditCoachPersonalInformation, Error, EditPersonalInformationRequest>({
        mutationFn: (data: EditPersonalInformationRequest) =>
            editPersonalInformation(academyId, id, data),
        ...options,
    });
};
