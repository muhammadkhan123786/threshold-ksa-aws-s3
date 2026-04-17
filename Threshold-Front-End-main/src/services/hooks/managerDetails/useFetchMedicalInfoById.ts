import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchMedicalInfoById = async (academyId: string, managerId: string): Promise<any> => {
    const response = await api
        .url(`club/${academyId}/manager/${managerId}/medical`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchMedicalInfoById = (
    academyId: string,
    managerId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['managerMedicalInformation', academyId, managerId],
        queryFn: () => fetchMedicalInfoById(academyId, managerId),
        ...options,
    });
};
