import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from 'services/clients/wretchClient';

export interface WeeklySession {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    weekTarget: number;
    weekDate: string;
    sessionDays: { date: string }[];
    sessions: any[];
}

interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

interface GetWeeklySessionsResponse {
    message: string;
    data: WeeklySession[];
    meta: Meta;
    status: number;
}

interface GetWeeklySessionsParams {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    searchQuery?: string;
    weekDate?: string;
    team_id: string;
}

const getWeeklySessions = async (
    params: GetWeeklySessionsParams,
): Promise<GetWeeklySessionsResponse> => {
    const {
        page = 1,
        limit = 10,
        sortField = 'createdAt',
        sortOrder = 'DESC',
        searchQuery,
        weekDate,
        team_id: teamId,
    } = params;

    const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortField,
        sortOrder,
        teamId,
        ...(searchQuery && { searchQuery }),
        ...(weekDate && { weekDate }),
    }).toString();

    const response = await api
        .url(`weekly-sessions?${query}`)
        .get()
        .json<GetWeeklySessionsResponse>();

    return response;
};

export const useGetWeeklySessions = (
    params: GetWeeklySessionsParams,
    options?: UseQueryOptions<GetWeeklySessionsResponse, Error>,
): UseQueryResult<GetWeeklySessionsResponse, Error> => {
    return useQuery<GetWeeklySessionsResponse, Error>({
        queryKey: ['getWeeklySessions', params],
        queryFn: () => getWeeklySessions(params),
        ...options,
    });
};
