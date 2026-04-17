import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface Document {
    id: string;
    type: string;
    url: string;
    lastUpdated: Date;
    signedUrl: string;
}

interface AthleteDocumentsResponse {
    payload: Document[];
}

const fetchAthleteDocumentsById = async (athleteId: string): Promise<AthleteDocumentsResponse> => {
    const response = await api
        .url(`athletes/${athleteId}/documents`)
        .get()
        .json<AthleteDocumentsResponse>();
    return response;
};

export const useFetchAthleteDocumentsById = (
    athleteId: string,
    options?: UseQueryOptions<AthleteDocumentsResponse, Error>,
): UseQueryResult<AthleteDocumentsResponse, Error> => {
    return useQuery<AthleteDocumentsResponse, Error>({
        queryKey: ['athleteDocuments', athleteId],
        queryFn: () => fetchAthleteDocumentsById(athleteId),
        enabled: Boolean(athleteId),
        ...options,
    });
};
