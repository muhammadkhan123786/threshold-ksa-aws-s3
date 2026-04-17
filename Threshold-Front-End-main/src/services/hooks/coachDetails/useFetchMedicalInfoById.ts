import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

const fetchMedicalInfoById = async (sportId: string, coachId: string): Promise<any> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-coaches/${coachId}/medical`)
        .get()
        .json<any>();
    return response.data;
};

export const useFetchMedicalInfoById = (
    sportId: string,
    coachId: string,
    options?: UseQueryOptions<any, Error>,
): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
        queryKey: ['medicalInformation', coachId],
        queryFn: () => fetchMedicalInfoById(sportId, coachId),
        ...options,
    });
};
