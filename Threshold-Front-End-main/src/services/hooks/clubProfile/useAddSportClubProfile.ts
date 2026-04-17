import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

export interface AddSportClubProfilePayload {
    academyId: string;
    sportName: string;
    sportProfileManagerId: string;
    technicalDirectorId: string;
}

interface AddSportClubProfileResponse {
    message: string;
    status: number;
    payload: {
        id: string;
        sportName: string;
        createdAt: string;
        updatedAt: string;
    };
}

const addSportClubProfile = async (
    data: AddSportClubProfilePayload,
): Promise<AddSportClubProfileResponse> => {
    return await api.url('sport-club-profiles').post(data).json<AddSportClubProfileResponse>();
};

export const useAddSportClubProfile = (
    options?: UseMutationOptions<AddSportClubProfileResponse, Error, AddSportClubProfilePayload>,
): UseMutationResult<AddSportClubProfileResponse, Error, AddSportClubProfilePayload> => {
    return useMutation<AddSportClubProfileResponse, Error, AddSportClubProfilePayload>({
        mutationFn: (data) => addSportClubProfile(data),
        ...options,
    });
};
