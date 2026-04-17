import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { SessionPlayingType } from 'libs/types';

interface GetSessionByIdResponse {
    message: string;
    payload: SessionPlayingType;
    status: number;
}

const getSessionById = async (id: string): Promise<GetSessionByIdResponse> => {
    const response = await api.url(`sessions/${id}`).get().json<GetSessionByIdResponse>();
    return response;
};

export const useGetSessionById = (
    id: string,
    options?: UseQueryOptions<GetSessionByIdResponse, Error, SessionPlayingType>,
): UseQueryResult<SessionPlayingType, Error> => {
    return useQuery<GetSessionByIdResponse, Error, SessionPlayingType>({
        queryKey: ['team-sessions', id],
        queryFn: () => getSessionById(id),
        select: (data: GetSessionByIdResponse) => data.payload,
        ...options,
    });
};
