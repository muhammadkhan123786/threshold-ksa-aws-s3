import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface SubGoalResponse {
    message: string;
    status: number;
    payload: any;
}

// Function to add a sub-goal
const addSubGoal = async (
    sportClubProfileId: string,
    teamId: string,
    data: any,
): Promise<SubGoalResponse> => {
    try {
        const response = await api
            .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/sub-goals`)
            .post(data)
            .json<SubGoalResponse>();
        return response;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to create a sub-goal');
    }
};

// Function to update a sub-goal
const updateSubGoal = async (
    sportClubProfileId: string,
    subGoalId: string,
    data: any,
): Promise<SubGoalResponse> => {
    try {
        const response = await api
            .url(`sportClubProfile/${sportClubProfileId}/teams/sub-goals/${subGoalId}`)
            .patch(data)
            .json<SubGoalResponse>();
        return response;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to update the sub-goal');
    }
};

// Hook for adding a sub-goal
export const useAddSubGoal = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseMutationOptions<SubGoalResponse, Error, any>,
): UseMutationResult<SubGoalResponse, Error, any> => {
    return useMutation<SubGoalResponse, Error, any>({
        mutationFn: (data: any) => addSubGoal(sportClubProfileId, teamId, data),
        ...options,
    });
};

// Hook for updating a sub-goal
export const useUpdateSubGoal = (
    sportClubProfileId: string,
    subGoalId: string,
    options?: UseMutationOptions<SubGoalResponse, Error, any>,
): UseMutationResult<SubGoalResponse, Error, any> => {
    return useMutation<SubGoalResponse, Error, any>({
        mutationFn: (data: any) => updateSubGoal(sportClubProfileId, subGoalId, data),
        ...options,
    });
};
