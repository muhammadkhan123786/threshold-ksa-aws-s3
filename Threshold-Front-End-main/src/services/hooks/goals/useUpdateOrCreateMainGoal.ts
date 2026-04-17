import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddYearGoalResponse {
    message: string;
    status: number;
    payload: any;
}

// Function to add a year goal
const addYearGoal = async (
    sportClubProfileId: string,
    teamId: string,
    data: any,
): Promise<AddYearGoalResponse> => {
    try {
        const response = await api
            .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/main-goal`)
            .post(data)
            .json<AddYearGoalResponse>();
        return response;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to create a Year-goal');
    }
};

// Function to update a year goal
const updateYearGoal = async (
    sportClubProfileId: string,
    teamId: string,
    data: any,
): Promise<AddYearGoalResponse> => {
    try {
        const response = await api
            .url(`sportClubProfile/${sportClubProfileId}/teams/${teamId}/main-goal`)
            .patch(data)
            .json<AddYearGoalResponse>();
        return response;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to update a Year-goal');
    }
};

// Hook for adding a year goal
export const useAddYearGoal = (
    sportClubProfileId: string,
    teamId: string,
    options?: UseMutationOptions<AddYearGoalResponse, Error, any>,
): UseMutationResult<AddYearGoalResponse, Error, any> => {
    return useMutation<AddYearGoalResponse, Error, any>({
        mutationFn: (data: any) => addYearGoal(sportClubProfileId, teamId, data),
        ...options,
    });
};

// Hook for updating a year goal
export const useUpdateYearGoal = (
    sportClubProfileId: string,
    goalId: string,
    options?: UseMutationOptions<AddYearGoalResponse, Error, any>,
): UseMutationResult<AddYearGoalResponse, Error, any> => {
    return useMutation<AddYearGoalResponse, Error, any>({
        mutationFn: (data: any) => updateYearGoal(sportClubProfileId, goalId, data),
        ...options,
    });
};
