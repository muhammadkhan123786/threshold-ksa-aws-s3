import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

export interface AddTeamsRequest {
    logo?: File;
    background?: File;
    branch?: string;
    name: string;
    coach: string;
    admin: string;
    subCoaches?: any;
    athletes: any;
    category?: string;
    gender?: string;
}

interface AddTeamsResponse {
    message: string;
    status: number;
    payload: any;
}

export const addTeams = async (
    sportClubProfileId: string,
    data: AddTeamsRequest,
): Promise<AddTeamsResponse> => {
    const formData = new FormData();

    if (data.logo) formData.append('logo', data.logo);
    if (data.background) formData.append('background', data.background);
    if (data.branch) formData.append('branch', data.branch);

    formData.append('name', data.name);
    formData.append('coach', data.coach);
    formData.append('admin', data.admin);
    formData.append('athletes', data.athletes);

    if (data.subCoaches) {
        formData.append('subCoaches', data.subCoaches);
    }
    if (data.category) {
        formData.append('category', data.category);
    }
    if (data.gender) {
        formData.append('gender', data.gender);
    }

    try {
        const response = await api
            .url(`sportClubProfile/${sportClubProfileId}/teams`)
            .post(formData)
            .json<AddTeamsResponse>();
        return response;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to create a team');
    }
};

export const updateTeam = async (
    sportClubProfileId: string,
    teamId: string,
    data: AddTeamsRequest,
): Promise<AddTeamsResponse> => {
    const formData = new FormData();

    if (data.logo) formData.append('logo', data.logo);
    if (data.background) formData.append('background', data.background);
    if (data.branch) formData.append('branch', data.branch);

    formData.append('name', data.name);
    formData.append('coach', data.coach);
    formData.append('admin', data.admin);
    formData.append('athletes', data.athletes);

    if (data.subCoaches) {
        formData.append('subCoaches', data.subCoaches);
    }
    if (data.category) {
        formData.append('category', data.category);
    }
    if (data.gender) {
        formData.append('gender', data.gender);
    }
    try {
        const response = await api
            .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}`)
            .patch(formData)
            .json<AddTeamsResponse>();
        return response;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to update the team');
    }
};

export const useAddTeams = (
    sportClubProfileId: string,
    options?: UseMutationOptions<AddTeamsResponse, Error, AddTeamsRequest>,
): UseMutationResult<AddTeamsResponse, Error, AddTeamsRequest> => {
    return useMutation<AddTeamsResponse, Error, AddTeamsRequest>({
        mutationFn: (data: AddTeamsRequest) => addTeams(sportClubProfileId, data),
        ...options,
    });
};

export const useUpdateTeam = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseMutationOptions<AddTeamsResponse, Error, AddTeamsRequest>,
): UseMutationResult<AddTeamsResponse, Error, AddTeamsRequest> => {
    return useMutation<AddTeamsResponse, Error, AddTeamsRequest>({
        mutationFn: (data: AddTeamsRequest) => updateTeam(sportClubProfileId, teamId, data),
        ...options,
    });
};
