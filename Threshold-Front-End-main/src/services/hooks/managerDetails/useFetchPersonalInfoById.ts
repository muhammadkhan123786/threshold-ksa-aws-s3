import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchPersonalInfoById = async (academyId: string, managerId: string): Promise<any> => {
    const response = await api
        .url(`club/${academyId}/manager/${managerId}/personal-information`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchPersonalInfoById = (
    academyId: string,
    managerId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['managerPersonalInformation', academyId, managerId],
        queryFn: () => fetchPersonalInfoById(academyId, managerId),
        ...options,
    });
};
