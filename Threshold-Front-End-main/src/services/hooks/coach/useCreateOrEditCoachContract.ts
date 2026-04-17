import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditOrCreateCoachContactRequest {
    joinDate: any;
    type: { value: string } | string;
    contractDuration: { value: string } | string;
    status: { value: string } | string;
    contractFile?: File | null;
}

interface EditOrCreateCoachContact {
    message: string;
    status: number;
    payload: any;
}
const createFormData = (data: EditOrCreateCoachContactRequest): FormData => {
    const formData = new FormData();
    if (data.contractFile) {
        formData.append('contractFile', data.contractFile);
    }
    formData.append('joinDate', data.joinDate);
    formData.append('type', typeof data.type === 'object' ? data.type.value : data.type);
    formData.append(
        'contractDuration',
        typeof data.contractDuration === 'object'
            ? data.contractDuration.value
            : data.contractDuration,
    );
    formData.append('status', typeof data.status === 'object' ? data.status.value : data.status);

    return formData;
};

const createCoachContract = async (
    sportClubProfileId: string,
    coachId: string,
    data: EditOrCreateCoachContactRequest,
): Promise<EditOrCreateCoachContact> => {
    const formData = createFormData(data);
    return api
        .url(`/sportClubProfile/${sportClubProfileId}/club-coaches/${coachId}/contract`)
        .post(formData)
        .json<EditOrCreateCoachContact>();
};

const editCoachContract = async (
    sportClubProfileId: string,
    coachId: string,
    data: EditOrCreateCoachContactRequest,
): Promise<EditOrCreateCoachContact> => {
    const formData = createFormData(data);
    return api
        .url(`/sportClubProfile/${sportClubProfileId}/club-coaches/${coachId}/contract`)
        .patch(formData)
        .json<EditOrCreateCoachContact>();
};

export const useCreateCoachContract = (
    sportClubProfileId: string,
    coachId: string,
    options?: UseMutationOptions<EditOrCreateCoachContact, Error, EditOrCreateCoachContactRequest>,
): UseMutationResult<EditOrCreateCoachContact, Error, EditOrCreateCoachContactRequest> => {
    return useMutation<EditOrCreateCoachContact, Error, EditOrCreateCoachContactRequest>({
        mutationFn: (data) => createCoachContract(sportClubProfileId, coachId, data),
        ...options,
    });
};

export const useEditCoachContract = (
    sportClubProfileId: string,
    coachId: string,
    options?: UseMutationOptions<EditOrCreateCoachContact, Error, EditOrCreateCoachContactRequest>,
): UseMutationResult<EditOrCreateCoachContact, Error, EditOrCreateCoachContactRequest> => {
    return useMutation<EditOrCreateCoachContact, Error, EditOrCreateCoachContactRequest>({
        mutationFn: (data) => editCoachContract(sportClubProfileId, coachId, data),
        ...options,
    });
};
