import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { Consideration, Education, Gender, Nationality, Relationship } from 'libs/enums';

export interface AddPlayersTeamIdRequest {
    relationship: any;
    avatar?: File;
    joinDate: any;
    contactNumber: any;
    emergencyPhone: any;
    nationality: any;
    education: any;
    gender: any;
    nin: any; // National ID number
    ninExpirationDate?: any;
    dateOfBirth: any;
    lastName: any;
    firstName: any;
    allergyDetails?: any;
    chronicConditions?: any;
    healthFactors?: any;
    category: any;
    position: any;
    clublevel: any;
    periodOfSubscription: any;
    weight: any;
    dateOfUpdating: any;
}

interface AddPlayersResponse {
    message: string;
    status: number;
    payload: any;
}

export const addPlayersTeamId = async (
    teamId: string,
    data: AddPlayersTeamIdRequest,
): Promise<AddPlayersResponse> => {
    const formData = new FormData();
    if (data.avatar) formData.append('avatar', data.avatar);
    if (data.joinDate) formData.append('joinDate', data.joinDate.toISOString());
    formData.append('contactNumber', data.contactNumber);
    formData.append('dateOfUpdating', data.dateOfUpdating);
    formData.append('emergencyPhone', data.emergencyPhone);
    formData.append('nationality', data.nationality);
    formData.append('education', data.education);
    formData.append('relationship', data.relationship);
    formData.append('gender', data.gender);
    formData.append('nin', data.nin);
    formData.append('periodOfSubscription', data.periodOfSubscription);
    formData.append('category', data.category);
    formData.append('position', data.position);
    formData.append('clublevel', data.clublevel);
    formData.append('weight', data.weight);
    formData.append('dateOfBirth', data.dateOfBirth);
    if (data.ninExpirationDate)
        formData.append('ninExpirationDate', data.ninExpirationDate.toISOString());
    formData.append('lastName', data.lastName);
    formData.append('firstName', data.firstName);

    if (data.allergyDetails) formData.append('allergyDetails', data.allergyDetails);
    if (data.chronicConditions) formData.append('chronicConditions', data.chronicConditions);
    if (data.healthFactors) formData.append('healthFactors', data.healthFactors);

    try {
        const response = await api
            .url(`players/${teamId}/player`)
            .post(formData)
            .json<AddPlayersResponse>();
        return response;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to add player');
    }
};

export const useAddPlayersTeamId = (
    teamId: string,
    options?: UseMutationOptions<AddPlayersResponse, Error, AddPlayersTeamIdRequest>,
): UseMutationResult<AddPlayersResponse, Error, AddPlayersTeamIdRequest> => {
    return useMutation<AddPlayersResponse, Error, AddPlayersTeamIdRequest>({
        mutationFn: (data: AddPlayersTeamIdRequest) => addPlayersTeamId(teamId, data),
        ...options,
    });
};
