import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchContactInfoById = async (academyId: string, managerId: string): Promise<any> => {
    const response = await api
        .url(`club/${academyId}/manager/${managerId}/contact`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchContactInfoById = (
    academyId: string,
    managerId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['managerContactInformation', academyId, managerId],
        queryFn: () => fetchContactInfoById(academyId, managerId),
        ...options,
    });
};
