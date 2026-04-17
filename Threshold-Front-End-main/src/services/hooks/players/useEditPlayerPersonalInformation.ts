import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

// Updated request interface to handle the new personal information fields
interface EditPlayerPersonalInformationRequest {
    firstName: string;
    lastName: string;
    joinDate: Date;
    level: string;
    experience: string;
    education: string;
    schoolName: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    nin: string;
    ninExpirationDate: Date;
    weight: number;
    height: number;
    avatar: any;
}

interface EditPlayerPersonalInformation {
    message: string;
    status: number;
    payload: any;
}

// Updated API call to handle the new data structure
export const editPlayerPersonalInformation = async (
    id: string,
    data: EditPlayerPersonalInformationRequest,
): Promise<EditPlayerPersonalInformation> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else {
                formData.append(key, value as string);
            }
        }
    });

    const response = await api
        .url(`players/${id}/personal-info`)
        .patch(formData)
        .json<EditPlayerPersonalInformation>();

    return response;
};

// Hook to use the mutation for editing the personal information
export const useEditPlayerPersonalInformation = (
    id: string,
    options?: UseMutationOptions<
        EditPlayerPersonalInformation,
        Error,
        EditPlayerPersonalInformationRequest
    >,
): UseMutationResult<
    EditPlayerPersonalInformation,
    Error,
    EditPlayerPersonalInformationRequest
> => {
    return useMutation<EditPlayerPersonalInformation, Error, EditPlayerPersonalInformationRequest>({
        mutationFn: (data: EditPlayerPersonalInformationRequest) =>
            editPlayerPersonalInformation(id, data),
        ...options,
    });
};
