import { Payload } from './../../../libs/types/app';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { PublicLink } from 'libs/types';

interface GetPublicAthleteLinkResponse {
    message: string;
    payload: PublicLink[];
    status: number;
}

const getPublicAthleteLink = async (): Promise<GetPublicAthleteLinkResponse> => {
    const response = await api.url('/links').get().json<GetPublicAthleteLinkResponse>();
    return response;
};

export const useGetPublicAthleteLink = (
    options?: UseQueryOptions<GetPublicAthleteLinkResponse, Error>,
): UseQueryResult<GetPublicAthleteLinkResponse, Error> => {
    return useQuery<GetPublicAthleteLinkResponse, Error>({
        queryKey: ['getPublicAthleteLink'],
        queryFn: () => getPublicAthleteLink(),
        ...options,
    });
};
