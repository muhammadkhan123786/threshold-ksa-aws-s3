import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface Session {
    id: string;
    updatedAt: string; // ISO 8601 date string
    createdAt: string; // ISO 8601 date string
    status: string;
    from: string; // Time string (e.g., "12:22 PM")
    to: string; // Time string (e.g., "11:11 AM")
    type: string;
    date: string; // ISO 8601 date string
}

interface SessionRecord {
    id: string;
    updatedAt: string; // ISO 8601 date string
    createdAt: string; // ISO 8601 date string
    status: string;
    comment: string;
    scale: number;
    session: Session;
}

interface SessionRecordsResponse {
    message: string;
    records: SessionRecord[];
}

const fetchSessionRecordsById = async (athleteId: string): Promise<SessionRecordsResponse> => {
    const response = await api
        .url(`/sessions/athletes/${athleteId}/records`)
        .get()
        .json<SessionRecordsResponse>();
    return response;
};

export const useFetchSessionRecordsById = (
    athleteId: string,
    options?: UseQueryOptions<SessionRecordsResponse, Error>,
): UseQueryResult<SessionRecordsResponse, Error> => {
    return useQuery<SessionRecordsResponse, Error>({
        queryKey: ['sessionRecords', athleteId],
        queryFn: () => fetchSessionRecordsById(athleteId),
        ...options,
    });
};
