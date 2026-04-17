import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';
import { GiConsoleController } from 'react-icons/gi';

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
}

interface Teams {
    name: string;
}

interface Subscription {
    id: string;
    status: string;
    subscriptionDate: string;
}

export interface CoachDetails {
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
    coachClothing: ClothesDetails | null;
    bankDetails: BankDetails | null;
    teams: Teams | null;
    contactNumber: string | null;
    subscription: Subscription | null;
}

interface CoachDetailsResponse {
    message: string;
    data: CoachDetails;
    status: number;
    extra: Record<string, any>;
}

const fetchCoachDetailsById = async (sportId: string, coachId: string): Promise<CoachDetails> => {
    const response = await api
        .url(`sportClubProfile/${sportId}/club-coaches/${coachId}/details`)
        .get()
        .json<CoachDetailsResponse>();
    const coachDetails = response.data;
    return coachDetails;
};

export const useFetchCoachDetailsById = (
    sportId: string,
    coachId: string,
    options?: UseQueryOptions<CoachDetails, Error>,
): UseQueryResult<CoachDetails, Error> => {
    return useQuery<CoachDetails, Error>({
        queryKey: ['coachDetailsData', coachId],
        queryFn: () => fetchCoachDetailsById(sportId, coachId),
        ...options,
    });
};
