import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

// Define the interface for the request data
interface SportProfileRequest {
    status: string;
    sport: string;
    eventType: string;
    hand: string;
    foot: string;
    position: string;
    sprint: string[];
    middleDistance: string[];
    longDistance: string[];
    hurdles: string[];
    relay: string[];
    steeplechase: string[];
    jumps: string[];
    throws: string[];
    heptathlon: string[];
    decathlon: string[];
    five_kilometers: string[];
    ten_kilometers: string[];
    half_marathon: string[];
    marathon: string[];
    freestyle: string[];
    backstroke: string[];
    breaststroke: string[];
    butterfly: string[];
    im: string[];
    freestyleRelay: string[];
    medleyRelay: string[];
    openWaterSwimming: string[];
    squad: string[];
    academy: string;
    athlete: string;
}

interface SportProfileResponse {
    status: number;
    message: string;
}

// Define API request functions
const createSportProfile = async (data: SportProfileRequest): Promise<SportProfileResponse> => {
    return api.url('/athleteProfiles').post(data).json<SportProfileResponse>();
};

const updateSportProfile = async (
    id: string,
    data: SportProfileRequest,
): Promise<SportProfileResponse> => {
    return api.url(`/athleteProfiles/${id}`).patch(data).json<SportProfileResponse>();
};

// Define hooks using React Query
export const useCreateSportProfile = (
    options?: UseMutationOptions<SportProfileResponse, Error, SportProfileRequest>,
): UseMutationResult<SportProfileResponse, Error, SportProfileRequest> => {
    return useMutation<SportProfileResponse, Error, SportProfileRequest>({
        mutationFn: (data) => createSportProfile(data),
        ...options,
    });
};

export const useUpdateSportProfile = (
    id: string,
    options?: UseMutationOptions<SportProfileResponse, Error, SportProfileRequest>,
): UseMutationResult<SportProfileResponse, Error, SportProfileRequest> => {
    return useMutation<SportProfileResponse, Error, SportProfileRequest>({
        mutationFn: (data) => updateSportProfile(id, data),
        ...options,
    });
};
