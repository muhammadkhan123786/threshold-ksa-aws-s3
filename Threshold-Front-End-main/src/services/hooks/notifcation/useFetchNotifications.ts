import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectUserRole } from 'hooks/pageStructure/selectors';
import { UserRole } from 'libs/enums';

interface Notification {
    id: string;
    message: string;
    seen: boolean;
    timestamp: number;
    topic?: string;
    token?: string;
    title?: string;
    createdAt?: string;
}

interface NotificationsResponse {
    notifications: Notification[] | undefined;
}

const fetchNotifications = async (topic: string): Promise<NotificationsResponse> => {
    const response = await api
        .url('/notifications/all')
        .query({ topic })
        .get()
        .json<NotificationsResponse>();
    return response;
};

export const useFetchNotifications = (
    topic: string | null | undefined,
    options?: UseQueryOptions<NotificationsResponse, Error>,
): UseQueryResult<NotificationsResponse, Error> => {
    const userRole = useSelector(selectUserRole);

    return useQuery<NotificationsResponse, Error>({
        queryKey: ['notifications', topic],
        queryFn: () => {
            if (!topic || userRole !== UserRole.ACADEMY_ADMIN) {
                return Promise.resolve({ notifications: [] });
            }
            return fetchNotifications(topic);
        },
        refetchInterval: 10000,
        enabled: userRole === UserRole.ACADEMY_ADMIN && !!topic,
        ...options,
    });
};
