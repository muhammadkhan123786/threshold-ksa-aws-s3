import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditOrCreateManagerContractRequest {
    joinDate: any;
    type: { value: string } | string;
    contractDuration: { value: string } | string;
    status: { value: string } | string;
    contractFile?: File | null;
}

interface EditOrCreateManagerContract {
    message: string;
    status: number;
    payload: any;
}
const createFormData = (data: EditOrCreateManagerContractRequest): FormData => {
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

const createManagerContract = async (
    academyId: string,
    id: string,
    data: EditOrCreateManagerContractRequest,
): Promise<EditOrCreateManagerContract> => {
    const formData = createFormData(data);
    return api
        .url(`club/${academyId}/manager/${id}/contract`)
        .post(formData)
        .json<EditOrCreateManagerContract>();
};

const editManagerContract = async (
    academyId: string,
    id: string,
    data: EditOrCreateManagerContractRequest,
): Promise<EditOrCreateManagerContract> => {
    const formData = createFormData(data);
    return api
        .url(`club/${academyId}/manager/${id}/contract`)
        .patch(formData)
        .json<EditOrCreateManagerContract>();
};

export const useCreateManagerContract = (
    academyId: string,
    id: string,
    options?: UseMutationOptions<
        EditOrCreateManagerContract,
        Error,
        EditOrCreateManagerContractRequest
    >,
): UseMutationResult<EditOrCreateManagerContract, Error, EditOrCreateManagerContractRequest> => {
    return useMutation<EditOrCreateManagerContract, Error, EditOrCreateManagerContractRequest>({
        mutationFn: (data) => createManagerContract(academyId, id, data),
        ...options,
    });
};

export const useEditManagerContract = (
    academyId: string,
    id: string,
    options?: UseMutationOptions<
        EditOrCreateManagerContract,
        Error,
        EditOrCreateManagerContractRequest
    >,
): UseMutationResult<EditOrCreateManagerContract, Error, EditOrCreateManagerContractRequest> => {
    return useMutation<EditOrCreateManagerContract, Error, EditOrCreateManagerContractRequest>({
        mutationFn: (data) => editManagerContract(academyId, id, data),
        ...options,
    });
};
