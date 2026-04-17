import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ContractDetailsRequest {
    sportClubProfileId: string;
    coachId: string;
}

export const fetchCoachContractDetails = async ({
    sportClubProfileId,
    coachId,
}: ContractDetailsRequest): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportClubProfileId}/club-coaches/${coachId}/contract`)
        .get()
        .json<any>();
    return response;
};

export const useFetchCoachContractDetails = (
    sportClubProfileId: string,
    coachId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchCoachContractDetails', sportClubProfileId, coachId],
        queryFn: () => fetchCoachContractDetails({ sportClubProfileId, coachId }),
        ...options,
    });
};
