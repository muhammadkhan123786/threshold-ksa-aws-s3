import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface GoalRequest {
    title: string;
    description: string;
    year: number;
    startDate: string;
    endDate: string;
}

interface GoalResponse {
    status: number;
    message: string;
}

const addGoal = async (
    sportClubProfileId: string,
    teamId: string,
    data: GoalRequest,
): Promise<GoalResponse> => {
    return api
        .url(`sportClubProfile/${sportClubProfileId}/teams/teams/${teamId}/goals`)
        .post(data)
        .json<GoalResponse>();
};

export const useAddMainGoals = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseMutationOptions<GoalResponse, Error, GoalRequest>,
): UseMutationResult<GoalResponse, Error, GoalRequest> => {
    return useMutation<GoalResponse, Error, GoalRequest>({
        mutationFn: (data) => addGoal(sportClubProfileId, teamId, data),
        ...options,
    });
};
