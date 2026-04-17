import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditAdminStratorsContactRequest {
    joinDate: any;
    type: { value: string } | string;
    contractDuration: { value: string } | string;
    status: { value: string } | string;
    contractFile?: File | null;
}

interface EditAdminStratorsContact {
    message: string;
    status: number;
    payload: any;
}

// Function to convert data into FormData
const createFormData = (data: EditAdminStratorsContactRequest): FormData => {
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

const createAdminStratorsContract = async (
    sportClubProfileId: string,
    adminId: string,
    data: EditAdminStratorsContactRequest,
): Promise<EditAdminStratorsContact> => {
    const formData = createFormData(data);

    return api
        .url(`sportClubProfile/${sportClubProfileId}/club-admin/${adminId}/contract`)
        .post(formData)
        .json<EditAdminStratorsContact>();
};

const editAdminStratorsContract = async (
    sportClubProfileId: string,
    adminId: string,
    data: EditAdminStratorsContactRequest,
): Promise<EditAdminStratorsContact> => {
    const formData = createFormData(data);

    return api
        .url(`sportClubProfile/${sportClubProfileId}/club-admin/${adminId}/contract`)
        .patch(formData)
        .json<EditAdminStratorsContact>();
};

export const useCreateAdminStratorsContract = (
    sportClubProfileId: string,
    adminId: string,
    options?: UseMutationOptions<EditAdminStratorsContact, Error, EditAdminStratorsContactRequest>,
): UseMutationResult<EditAdminStratorsContact, Error, EditAdminStratorsContactRequest> => {
    return useMutation<EditAdminStratorsContact, Error, EditAdminStratorsContactRequest>({
        mutationFn: (data) => createAdminStratorsContract(sportClubProfileId, adminId, data),
        ...options,
    });
};

// Hook to edit a contract
export const useEditAdminStratorsContract = (
    sportClubProfileId: string,
    adminId: string,
    options?: UseMutationOptions<EditAdminStratorsContact, Error, EditAdminStratorsContactRequest>,
): UseMutationResult<EditAdminStratorsContact, Error, EditAdminStratorsContactRequest> => {
    return useMutation<EditAdminStratorsContact, Error, EditAdminStratorsContactRequest>({
        mutationFn: (data) => editAdminStratorsContract(sportClubProfileId, adminId, data),
        ...options,
    });
};
