import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface SubGoalResponse {
    status: number;
    message: string;
}

const addSubGoal = async (
    sportClubProfileId: string,
    teamId: string,
    data: any,
): Promise<SubGoalResponse> => {
    return api
        .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/sub-goals`)
        .post(data)
        .json<SubGoalResponse>();
};

export const useAddSubGoals = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseMutationOptions<SubGoalResponse, Error, any>,
): UseMutationResult<SubGoalResponse, Error, any> => {
    return useMutation<SubGoalResponse, Error, any>({
        mutationFn: (data) => addSubGoal(sportClubProfileId, teamId, data),
        ...options,
    });
};
