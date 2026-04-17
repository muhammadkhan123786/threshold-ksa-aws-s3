import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddPlayersRequest {
    file: File;
    type: any;
}

interface AddPlayersResponse {
    message: string;
    status: number;
    payload: any;
}

export const addPlayerDocs = async (
    playerId: string,
    data: AddPlayersRequest,
): Promise<AddPlayersResponse> => {
    const { file, type } = data;
    const formData = new FormData();

    if (file) formData.append('file', file);

    const response = await api
        .url(`players/${playerId}/documents/upload/${type}`)
        .post(formData)
        .json<AddPlayersResponse>();
    return response;
};

export const useAddPlayerDocs = (
    playerId: string,
    options?: UseMutationOptions<AddPlayersResponse, Error, AddPlayersRequest>,
): UseMutationResult<AddPlayersResponse, Error, AddPlayersRequest> => {
    return useMutation<AddPlayersResponse, Error, AddPlayersRequest>({
        mutationFn: (data: AddPlayersRequest) => addPlayerDocs(playerId, data),
        ...options,
    });
};
