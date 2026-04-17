import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface CreatePublicAthleteLinkRequest {
    academyId: string;
    expirationDate: Date;
    limitNumber: number;
}

interface CreatePublicAthleteLinkResponse {
    message: string;
}

const createPublicAthleteLink = async (
    request: CreatePublicAthleteLinkRequest,
): Promise<CreatePublicAthleteLinkResponse> => {
    const response = await api
        .url('/links/create-public-athlete-link')
        .post(request)
        .json<CreatePublicAthleteLinkResponse>();
    return response;
};

export const useCreatePublicAthleteLink = (
    options?: UseMutationOptions<
        CreatePublicAthleteLinkResponse,
        Error,
        CreatePublicAthleteLinkRequest,
        unknown
    >,
): UseMutationResult<
    CreatePublicAthleteLinkResponse,
    Error,
    CreatePublicAthleteLinkRequest,
    unknown
> => {
    return useMutation<
        CreatePublicAthleteLinkResponse,
        Error,
        CreatePublicAthleteLinkRequest,
        unknown
    >({
        mutationFn: createPublicAthleteLink,
        ...options,
    });
};
