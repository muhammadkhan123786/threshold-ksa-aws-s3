import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ClubInfoResponse {
    message: string;
    status: number;
    payload: {
        id: string;
        name: string;
        registrationNumber: string;
        contactNumber: string;
        address: string;
        createdAt: string;
        updatedAt: string;
        avatarUrl?: string;
    };
}

const fetchClubInfo = async (clubId: string): Promise<ClubInfoResponse> => {
    const response = await api.url(`club/${clubId}`).get().json<ClubInfoResponse>();
    return response;
};

export const useClubInfo = (
    clubId: string,
    options?: UseQueryOptions<ClubInfoResponse, Error>,
): UseQueryResult<ClubInfoResponse, Error> => {
    return useQuery<ClubInfoResponse, Error>({
        queryKey: ['getClubInfo'],
        queryFn: () => fetchClubInfo(clubId),
        enabled: Boolean(clubId),
        ...options,
    });
};
