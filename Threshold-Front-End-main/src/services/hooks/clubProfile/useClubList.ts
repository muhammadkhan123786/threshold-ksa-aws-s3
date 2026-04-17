import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ClubSportListResponse {
    message: string;
    status: number;
    payload: {
        sport: any;
        id: string;
        name: string;
        registrationNumber: string;
        contactNumber: string;
        address: string;
        createdAt: string;
        updatedAt: string;
        avatarUrl?: string;
    }[];
}

const fetchClubList = async (academyId?: string): Promise<ClubSportListResponse> => {
    const response = await api
        .url(`/sport-club-profiles/${academyId}`)
        .get()
        .json<ClubSportListResponse>();
    return response;
};

export const useClubList = (
    academyId?: string,
    options?: UseQueryOptions<ClubSportListResponse, Error>,
): UseQueryResult<ClubSportListResponse, Error> => {
    return useQuery<ClubSportListResponse, Error>({
        queryKey: ['getClubListData', academyId],
        queryFn: () => fetchClubList(academyId),
        enabled: Boolean(academyId),
        ...options,
    });
};
