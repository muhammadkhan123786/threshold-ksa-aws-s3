import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface BankDetails {
    id: string;
    iban: string;
    bank: string;
    accountHolder: string;
}

interface ClothesDetails {
    id: string;
    tShirtSize: string;
    shoeSize: string;
    accountHolder: string;
    pantSize: string;
    driFitSize: string;
}

interface EmergencyDetails {
    id: string;
    name: string;
    relationship: string;
    phoneNumber: string;
    nationalNumber: string;
}

interface Teams {
    name: string;
}

export interface AthleteDetails {
    id: string;
    experience: string | null;
    schoolName: string | null;
    weight: number | null;
    height: number | null;
    joinDate: any;
    dateOfBirth: string;
    nin: string;
    ninExpirationDate: string;
    level: string | null;
    lastName: string;
    firstName: string;
    nationality: string;
    education: string;
    gender: string;
    athleteClothing: ClothesDetails | null;
    bankDetails: BankDetails | null;
    teams: Teams | null;
    emergencyContact: EmergencyDetails | null;
}

interface AthleteDetailsResponse {
    message: string;
    payload: AthleteDetails;
    status: number;
    extra: Record<string, any>;
}

const fetchAthleteDetailsById = async (athleteId: string): Promise<AthleteDetails> => {
    const response = await api
        .url(`athletes/${athleteId}/details`)
        .get()
        .json<AthleteDetailsResponse>();
    return response.payload;
};
export const useFetchAthleteDetailsById = (
    athleteId: string,
    options?: UseQueryOptions<AthleteDetails, Error>,
): UseQueryResult<AthleteDetails, Error> => {
    return useQuery<AthleteDetails, Error>({
        queryKey: ['athleteDetails', athleteId],
        queryFn: () => fetchAthleteDetailsById(athleteId),
        ...options,
    });
};
