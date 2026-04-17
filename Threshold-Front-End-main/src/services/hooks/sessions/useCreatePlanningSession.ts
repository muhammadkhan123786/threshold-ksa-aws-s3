import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { PlanningSession } from './useFetchSessionAndPlanningSessions';

interface CreatePlanningSessionResponse {
    message: string;
    payload: PlanningSession;
    status: number;
}

interface CreatePlanningSessionDto {
    title: string;
    description?: string;
    theme?: string;
    space?: string;
    trainingLoad?: string;
    timeLoad?: string;
    drillImage?: string;
    createdBy?: string;
}

const createPlanningSession = async (
    sessionId: string,
    createPlanningSessionDto: CreatePlanningSessionDto,
): Promise<CreatePlanningSessionResponse> => {
    const response = await api
        .url(`sessions/${sessionId}/planning-sessions`)
        .post(createPlanningSessionDto)
        .json<CreatePlanningSessionResponse>();
    return response;
};

export const useCreatePlanningSession = (
    options?: UseMutationOptions<
        CreatePlanningSessionResponse,
        Error,
        { sessionId: string; createPlanningSessionDto: CreatePlanningSessionDto }
    >,
): UseMutationResult<
    CreatePlanningSessionResponse,
    Error,
    { sessionId: string; createPlanningSessionDto: CreatePlanningSessionDto }
> => {
    return useMutation<
        CreatePlanningSessionResponse,
        Error,
        { sessionId: string; createPlanningSessionDto: CreatePlanningSessionDto }
    >({
        mutationFn: ({ sessionId, createPlanningSessionDto }) =>
            createPlanningSession(sessionId, createPlanningSessionDto),
        ...options,
    });
};
