import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from 'services/clients/wretchClient';

export interface ExamSession {
    id: string;
    title: string;
    type: string;
    date: string;
    from: string;
    to: string;
    teamId: string;
    status: string;
}

interface ExamSessionsResponse {
    message: string;
    examSessions: ExamSession[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}

interface FetchExamSessionsParams {
    teamId: string;
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    searchQuery?: string;
    startDate?: string;
    endDate?: string;
}

const fetchExamSessions = async ({
    teamId,
    page = 1,
    limit = 10,
    sortField = 'createdAt',
    sortOrder = 'DESC',
    searchQuery,
    startDate,
    endDate,
}: FetchExamSessionsParams): Promise<ExamSessionsResponse> => {
    const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortField,
        sortOrder,
        teamId,
        ...(searchQuery && { searchQuery }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    });

    const response = await api
        .url(`exam-sessions?${query.toString()}`)
        .get()
        .json<ExamSessionsResponse>();

    return response;
};

export const useFetchExamSessions = (
    params: FetchExamSessionsParams,
    options?: UseQueryOptions<ExamSessionsResponse, Error>,
): UseQueryResult<ExamSessionsResponse, Error> => {
    return useQuery<ExamSessionsResponse, Error>({
        queryKey: ['examSessions', params],
        queryFn: () => fetchExamSessions(params),
        ...options,
    });
};
