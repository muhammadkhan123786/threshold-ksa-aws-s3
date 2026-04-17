import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { Relationship, Education, Gender, Nationality } from 'libs/enums';

export interface AddAdministratorsRequest {
    relationship: any;
    avatar?: File | null;
    joinDate: any;
    birthday: any;
    phone: string;
    type: any;
    emergencyPhone: string;
    nationality: any;
    gender: any;
    lastName: string;
    firstName: string;
    experience: string;
    email: string;
    username: string;
    password: string;
    branch?: string;
}

interface AddAdministratorsResponse {
    message: string;
    status: number;
    payload: any;
}

export const addAdministrators = async (
    sportId: string,
    data: AddAdministratorsRequest,
): Promise<AddAdministratorsResponse> => {
    const formData = new FormData();

    // Append all fields to FormData
    if (data.avatar) formData.append('avatar', data.avatar);
    formData.append('joinDate', data.joinDate);
    formData.append('birthday', data.birthday);
    formData.append('phone', data.phone);
    formData.append('type', data.type);
    formData.append('emergencyPhone', data.emergencyPhone);
    formData.append('relationship', data.relationship);
    formData.append('nationality', data.nationality);
    formData.append('gender', data.gender);
    formData.append('lastName', data.lastName);
    formData.append('firstName', data.firstName);
    formData.append('experience', data.experience);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('password', data.password);
    if (data.branch) formData.append('branch', data.branch);

    const response = await api
        .url(`/sportClubProfile/${sportId}/club-admin`)
        .post(formData)
        .json<AddAdministratorsResponse>();

    return response;
};

export const useAddAdministrators = (
    sportId: string,
    options?: UseMutationOptions<AddAdministratorsResponse, Error, AddAdministratorsRequest>,
): UseMutationResult<AddAdministratorsResponse, Error, AddAdministratorsRequest> => {
    return useMutation<AddAdministratorsResponse, Error, AddAdministratorsRequest>({
        mutationFn: (data: AddAdministratorsRequest) => addAdministrators(sportId, data),
        ...options,
    });
};
