import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchDocumentsById = async (academyId: string, managerId: string): Promise<any> => {
    const response = await api
        .url(`club/${academyId}/manager/${managerId}/document`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchDocumentsById = (
    academyId: string,
    managerId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['managerDocuments', academyId, managerId],
        queryFn: () => fetchDocumentsById(academyId, managerId),
        ...options,
    });
};
