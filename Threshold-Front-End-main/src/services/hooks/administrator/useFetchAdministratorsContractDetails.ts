import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface ContractDetailsRequest {
    sportClubProfileId: string;
    adminId: string;
}

export const fetchContractDetails = async ({
    sportClubProfileId,
    adminId,
}: ContractDetailsRequest): Promise<any> => {
    const response = await api
        .url(`/sportClubProfile/${sportClubProfileId}/club-admin/${adminId}/contract`)
        .get()
        .json<any>();
    return response;
};

export const useFetchAdministratorsContractDetails = (
    sportClubProfileId: string,
    adminId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['fetchContractDetails', sportClubProfileId, adminId],
        queryFn: () => fetchContractDetails({ sportClubProfileId, adminId }),
        ...options,
    });
};
