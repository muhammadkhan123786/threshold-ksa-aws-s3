import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

// Updated request interface for manager documents
interface AddDocumentRequest {
    file: File;
    type: any;
}

interface AddDocument {
    message: string;
    status: number;
    payload: any;
}

// API call for editing coach personal information

export const addDocument = async (
    academyId: string,
    id: string,
    data: AddDocumentRequest,
): Promise<AddDocument> => {
    const { file, type, ...rest } = data;
    const formData = new FormData();

    // Append the file if it exists
    if (file) formData.append('file', file);

    // Append the `type` value directly if it exists
    if (type?.value) {
        formData.append('type', type.value);
    }

    // Append the rest of the fields
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
        .url(`club/${academyId}/manager/${id}/document`)
        .post(formData)
        .json<AddDocument>();
    return response;
};

// Hook for using the mutation for editing coach personal information
export const useAddDocument = (
    academyId: string,
    id: string,
    options?: UseMutationOptions<AddDocument, Error, AddDocumentRequest>,
): UseMutationResult<AddDocument, Error, AddDocumentRequest> => {
    return useMutation<AddDocument, Error, AddDocumentRequest>({
        mutationFn: (data: AddDocumentRequest) => addDocument(academyId, id, data),
        ...options,
    });
};
