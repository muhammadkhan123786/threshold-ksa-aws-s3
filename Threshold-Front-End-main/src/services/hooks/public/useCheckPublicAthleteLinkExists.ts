import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface CheckPublicAthleteLinkExistsResponse {
    message: string;
    payload: boolean;
    status: number;
}

const checkPublicAthleteLinkExists = async (
    academyId: string,
    deviceIdentifier: string,
): Promise<CheckPublicAthleteLinkExistsResponse> => {
    const response = await api
        .url(`links/check/${academyId}/${deviceIdentifier}`)
        .get()
        .json<CheckPublicAthleteLinkExistsResponse>();
    return response;
};

export const useCheckPublicAthleteLinkExists = (
    options?: UseMutationOptions<
        CheckPublicAthleteLinkExistsResponse,
        Error,
        { academyId: string; deviceIdentifier: string }
    >,
): UseMutationResult<
    CheckPublicAthleteLinkExistsResponse,
    Error,
    { academyId: string; deviceIdentifier: string }
> => {
    return useMutation<
        CheckPublicAthleteLinkExistsResponse,
        Error,
        { academyId: string; deviceIdentifier: string }
    >({
        mutationFn: ({ academyId, deviceIdentifier }) =>
            checkPublicAthleteLinkExists(academyId, deviceIdentifier),
        ...options,
    });
};
