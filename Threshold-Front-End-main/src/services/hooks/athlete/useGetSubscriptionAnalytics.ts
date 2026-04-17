import api from 'services/clients/wretchClient';

interface SubscriptionAnalyticsResponse {
    message: string;
    payload: {
        active: number;
        inactive: number;
        pending: number;
        expired: number;
        total: number;
    };
    status: number;
    extra?: Record<string, any>;
}

const getSubscriptionAnalytics = async (): Promise<SubscriptionAnalyticsResponse> => {
    const response = await api
        .url(`athletes/subscriptions/analytics`)
        .get()
        .json<SubscriptionAnalyticsResponse>();

    return response;
};
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export const useGetSubscriptionAnalytics = (
    options?: UseQueryOptions<SubscriptionAnalyticsResponse, Error>,
): UseQueryResult<SubscriptionAnalyticsResponse, Error> => {
    return useQuery<SubscriptionAnalyticsResponse, Error>({
        queryKey: ['getSubscriptionAnalytics'],
        queryFn: getSubscriptionAnalytics,
        ...options,
    });
};
