import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface AddCoachRequest {
    firstName: string;
    lastName: string;
    nationality: string;
    gender: string;
    birthday: Date;
    phone: string;
    emergencyPhone: string;
    relationship: string;
    experience: number;
    joinDate: Date | null;
    username: string;
    email: string;
    password: string;
    avatar: File | null;
}

interface AddCoach {
    message: string;
    status: number;
    payload: any;
}

export const addCoach = async (sportId: string, request: AddCoachRequest): Promise<AddCoach> => {
    const { avatar, ...rest } = request;

    const formData = new FormData();

    if (avatar) {
        formData.append('avatar', avatar);
    }

    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as string);
            }
        }
    });

    const response = await api
        .url(`/sportClubProfile/${sportId}/club-coaches`)
        .post(formData)
        .json<AddCoach>();

    return response;
};

export const useAddCoach = (
    sportId: string,
    options?: UseMutationOptions<AddCoach, Error, AddCoachRequest>,
): UseMutationResult<AddCoach, Error, AddCoachRequest> => {
    return useMutation<AddCoach, Error, AddCoachRequest>({
        mutationFn: (data: AddCoachRequest) => addCoach(sportId, data),
        ...options,
    });
};
