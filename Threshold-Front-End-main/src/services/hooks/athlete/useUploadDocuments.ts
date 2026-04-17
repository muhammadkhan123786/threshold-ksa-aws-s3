import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { DocumentType } from 'libs/enums/athlete';

interface DocumentUploadResponse {
    status: number;
    message: string;
    id?: string;
}

interface DocumentUploadParams {
    athleteId: string;
    type: DocumentType;
    file: File;
}

const uploadSingleDocument = async ({
    athleteId,
    type,
    file,
}: DocumentUploadParams): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        return await api
            .url(`/athletes/${athleteId}/documents/upload/${type}`)
            .post(formData)
            .json<DocumentUploadResponse>();
    } catch (error: any) {
        // Throw a specific error to be handled by the mutation's onError handler
        throw new Error(error?.message || 'Failed to upload document');
    }
};

export const useUploadDocument = (
    options?: UseMutationOptions<DocumentUploadResponse, Error, DocumentUploadParams>,
): UseMutationResult<DocumentUploadResponse, Error, DocumentUploadParams> => {
    return useMutation<DocumentUploadResponse, Error, DocumentUploadParams>({
        mutationFn: uploadSingleDocument,
        ...options,
    });
};
