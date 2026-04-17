import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface SubGoalRequest {
    title?: string; // Optional for update
    weekNumber?: number; // Optional for update
    sessionsNeeded?: number; // Optional for update
    volumeTargeted?: string; // Optional for update
}

interface SubGoalResponse {
    status: number;
    message: string;
}

const updateSubGoal = async (
    sportClubProfileId: string,
    teamId: string,
    goalId: string,
    subGoalId: string,
    data: SubGoalRequest,
): Promise<SubGoalResponse> => {
    return api
        .url(
            `sportClubProfile/${sportClubProfileId}/teams/${teamId}/goals/${goalId}/sub-goals/${subGoalId}`,
        )
        .patch(data)
        .json<SubGoalResponse>();
};

export const useUpdateSubGoal = (
    sportClubProfileId: string,
    teamId: string,
    goalId: string,
    subGoalId: string,
    options?: UseMutationOptions<SubGoalResponse, Error, SubGoalRequest>,
): UseMutationResult<SubGoalResponse, Error, SubGoalRequest> => {
    return useMutation<SubGoalResponse, Error, SubGoalRequest>({
        mutationFn: (data) => updateSubGoal(sportClubProfileId, teamId, goalId, subGoalId, data),
        ...options,
    });
};
