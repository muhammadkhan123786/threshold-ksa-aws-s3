import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

interface EditOrCreatePlayerContractRequest {
    joinDate: any;
    type: { value: string } | string;
    contractDuration: { value: string } | string;
    status: { value: string } | string;
    contractFile?: File | null;
}

interface EditOrCreatePlayerContract {
    message: string;
    status: number;
    payload: any;
}

const createFormData = (data: EditOrCreatePlayerContractRequest): FormData => {
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

const createPlayerContract = async (
    playerId: string,
    data: EditOrCreatePlayerContractRequest,
): Promise<EditOrCreatePlayerContract> => {
    const formData = createFormData(data);
    return api
        .url(`players/${playerId}/contract`)
        .post(formData)
        .json<EditOrCreatePlayerContract>();
};

const editPlayerContract = async (
    playerId: string,
    data: EditOrCreatePlayerContractRequest,
): Promise<EditOrCreatePlayerContract> => {
    const formData = createFormData(data);
    return api
        .url(`players/${playerId}/contract`)
        .patch(formData)
        .json<EditOrCreatePlayerContract>();
};

export const useCreatePlayerContract = (
    playerId: string,
    options?: UseMutationOptions<
        EditOrCreatePlayerContract,
        Error,
        EditOrCreatePlayerContractRequest
    >,
): UseMutationResult<EditOrCreatePlayerContract, Error, EditOrCreatePlayerContractRequest> => {
    return useMutation<EditOrCreatePlayerContract, Error, EditOrCreatePlayerContractRequest>({
        mutationFn: (data) => createPlayerContract(playerId, data),
        ...options,
    });
};

export const useEditPlayerContract = (
    playerId: string,
    options?: UseMutationOptions<
        EditOrCreatePlayerContract,
        Error,
        EditOrCreatePlayerContractRequest
    >,
): UseMutationResult<EditOrCreatePlayerContract, Error, EditOrCreatePlayerContractRequest> => {
    return useMutation<EditOrCreatePlayerContract, Error, EditOrCreatePlayerContractRequest>({
        mutationFn: (data) => editPlayerContract(playerId, data),
        ...options,
    });
};
