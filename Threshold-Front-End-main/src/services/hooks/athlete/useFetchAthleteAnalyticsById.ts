import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface SessionData {
    totalSessions: number;
    averageSessions: number;
}

interface Session {
    date: string;
    scale: number | null;
    comment: string;
    load: number | null;
}

interface TrainingLoad {
    month: string;
    load: number | null;
    averageScale: number;
    week: string;
    sessions: Session[];
}

interface AnalyticsBreakdown {
    present: number;
    absent: number;
    injury: number;
    playingWithNationalTeam: number;
    reasonSessions: number;
}

interface AthleteAnalytics {
    sessions: SessionData;
    practicingPercentage: number;
    presencePercentage: number;
    level: string;
    trainingLoad: TrainingLoad[];
    analyticsBreakdown: AnalyticsBreakdown;
}

interface ApiResponse {
    message: string;
    payload: AthleteAnalytics;
    status: number;
    extra: Record<string, unknown>;
}

const fetchAthleteAnalyticsById = async (
    athleteId: string,
    trainingStartDate?: string,
    trainingEndDate?: string,
): Promise<AthleteAnalytics> => {
    const response = await api
        .url(
            `athletes/${athleteId}/analytics?trainingStartDate=${
                trainingStartDate ? trainingStartDate : new Date(new Date().getFullYear(), 0, 2)
            }&trainingEndDate=${trainingEndDate ? trainingEndDate : new Date()}`,
        )
        .get()
        .json<ApiResponse>();
    return response.payload;
};

export const useFetchAthleteAnalyticsById = (
    athleteId: string,
    trainingStartDate?: string,
    trainingEndDate?: string,
    options?: UseQueryOptions<AthleteAnalytics, Error>,
): UseQueryResult<AthleteAnalytics, Error> => {
    return useQuery<AthleteAnalytics, Error>({
        queryKey: ['athleteAnalytics', athleteId, trainingStartDate, trainingEndDate],
        queryFn: () =>
            fetchAthleteAnalyticsById(
                athleteId,
                trainingStartDate && trainingStartDate,
                trainingEndDate && trainingEndDate,
            ),
        ...options,
    });
};
