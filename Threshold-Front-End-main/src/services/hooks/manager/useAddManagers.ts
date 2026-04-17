import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddManagersRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    nationality: string;
    gender: string;
    birthday: Date;
    phone: string;
    emergencyPhone: string;
    relationship: string;
    educationalLevel: string;
    experience: number;
    nationalId: string;
    nationalIdExpirationDate: Date;
    position: string;
    joinDate: Date | null;
    contractRenewalTerms: string;
    avatar: File | null;
}

interface AddManagersResponse {
    message: string;
    status: number;
    payload: any;
}

export const addManagers = async (
    clubId: string,
    data: AddManagersRequest,
): Promise<AddManagersResponse> => {
    const formData = new FormData();

    // Append fields to FormData
    if (data.avatar) formData.append('avatar', data.avatar);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('nationality', data.nationality);
    formData.append('gender', data.gender);

    // Convert Date fields to ISO 8601 format
    formData.append('birthday', data.birthday.toISOString());
    formData.append('phone', data.phone);
    formData.append('emergencyPhone', data.emergencyPhone);
    formData.append('relationship', data.relationship);
    formData.append('educationalLevel', data.educationalLevel);
    formData.append('experience', data.experience.toString());
    formData.append('nationalId', data.nationalId);
    formData.append('nationalIdExpirationDate', data.nationalIdExpirationDate.toISOString());
    formData.append('position', data.position);
    if (data.joinDate) formData.append('joinDate', data.joinDate.toISOString());
    formData.append('contractRenewalTerms', data.contractRenewalTerms);

    const response = await api
        .url(`/club/${clubId}/manager`)
        .post(formData)
        .json<AddManagersResponse>();
    return response;
};

export const useAddManagers = (
    clubId: string,
    options?: UseMutationOptions<AddManagersResponse, Error, AddManagersRequest>,
): UseMutationResult<AddManagersResponse, Error, AddManagersRequest> => {
    return useMutation<AddManagersResponse, Error, AddManagersRequest>({
        mutationFn: (data: AddManagersRequest) => addManagers(clubId, data),
        ...options,
    });
};
