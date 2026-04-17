import api from '../../clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface SubscribeToTopicRequest {
    token: string;
    topic: string;
}

interface SubscribeToTopicResponse {
    status: number;
    message: string;
}

const subscribeToTopic = async (
    request: SubscribeToTopicRequest,
): Promise<SubscribeToTopicResponse> => {
    const response = await api
        .url('notifications/subscribe')
        .post(request)
        .json<SubscribeToTopicResponse>();
    return response;
};

export const useSubscribeToTopic = (
    options?: UseMutationOptions<SubscribeToTopicResponse, Error, SubscribeToTopicRequest, unknown>,
): UseMutationResult<SubscribeToTopicResponse, Error, SubscribeToTopicRequest, unknown> => {
    return useMutation<SubscribeToTopicResponse, Error, SubscribeToTopicRequest, unknown>({
        mutationFn: subscribeToTopic,
        ...options,
    });
};
