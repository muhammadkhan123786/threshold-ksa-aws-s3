import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface GoalRequest {
    title?: string;
    description?: string;
    year?: number;
    startDate?: string;
    endDate?: string;
}

interface GoalResponse {
    status: number;
    message: string;
}

const updateGoal = async (
    sportClubProfileId: string,
    teamId: string,
    goalId: string,
    data: GoalRequest,
): Promise<GoalResponse> => {
    return api
        .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/main-goals`)
        .patch(data)
        .json<GoalResponse>();
};
export const useUpdateMainGoals = (
    sportClubProfileId: string,
    teamId: string,
    goalId: string,
    options?: UseMutationOptions<GoalResponse, Error, GoalRequest>,
): UseMutationResult<GoalResponse, Error, GoalRequest> => {
    return useMutation<GoalResponse, Error, GoalRequest>({
        mutationFn: (data) => updateGoal(sportClubProfileId, teamId, goalId, data),
        ...options,
    });
};
