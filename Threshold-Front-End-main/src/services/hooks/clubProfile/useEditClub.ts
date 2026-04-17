import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditClubPayload {
    clubId: string;
    name?: string;
    registrationNumber?: string;
    contactNumber?: string;
    address?: string;
    avatar?: File;
}

interface EditClubResponse {
    message: string;
    status: number;
    payload: {
        id: string;
        name: string;
        registrationNumber: string;
        contactNumber: string;
        address: string;
        avatarUrl?: string;
        updatedAt: string;
    };
}

const editClub = async (data: EditClubPayload): Promise<EditClubResponse> => {
    const { clubId, avatar, ...rest } = data;

    const formData = new FormData();

    if (avatar) formData.append('avatar', avatar);
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as string);
            }
        }
    });

    return await api.url(`/club/${clubId}`).patch(formData).json<EditClubResponse>();
};

export const useEditClub = (
    options?: UseMutationOptions<EditClubResponse, Error, EditClubPayload>,
): UseMutationResult<EditClubResponse, Error, EditClubPayload> => {
    return useMutation<EditClubResponse, Error, EditClubPayload>({
        mutationFn: (data) => editClub(data),
        ...options,
    });
};
