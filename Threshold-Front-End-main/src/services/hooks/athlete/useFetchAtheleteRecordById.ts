import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Branch } from 'libs/types/branch';

interface AthleteRecord {
    id: string;
    category: string;
    subcategory: string;
    personalRecord: number;
    bestRecord: number;
    lastRecord: number;
    createdAt: Date;
    updatedAt: Date;
}

interface AthletesRecords {
    records: AthleteRecord[];
}

const fetchAthelteRecordhById = async (branchId: string): Promise<AthletesRecords> => {
    const response = await api.url(`/athletes/${branchId}/records`).get().json<AthletesRecords>();
    return response;
};

export const useFetchAthelteRecordById = (
    branchId: string,
    options?: UseQueryOptions<AthletesRecords, Error>,
): UseQueryResult<AthletesRecords, Error> => {
    return useQuery<AthletesRecords, Error>({
        queryKey: ['athelteRecords', branchId],
        queryFn: () => fetchAthelteRecordhById(branchId),
        ...options,
    });
};
