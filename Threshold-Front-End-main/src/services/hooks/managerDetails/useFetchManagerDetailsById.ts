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
}

interface Teams {
    name: string;
}

interface Subscription {
    id: string;
    status: string;
    subscriptionDate: string;
}

export interface ManagerDetails {
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

interface ManagerDetailsResponse {
    message: string;
    payload: ManagerDetails;
    status: number;
    extra: Record<string, any>;
}

const fetchManagerDetailsById = async (
    academyId: string,
    managerId: string,
): Promise<ManagerDetails> => {
    const response = await api
        .url(`club/${academyId}/manager/${managerId}`)
        .get()
        .json<ManagerDetailsResponse>();
    const managerDetails = response.payload;
    return managerDetails;
};

export const useFetchManagerDetailsById = (
    academyId: string,
    managerId: string,
    options?: UseQueryOptions<ManagerDetails, Error>,
): UseQueryResult<ManagerDetails, Error> => {
    return useQuery<ManagerDetails, Error>({
        queryKey: ['managerDetailsData', managerId],
        queryFn: () => fetchManagerDetailsById(academyId, managerId),
        ...options,
    });
};
