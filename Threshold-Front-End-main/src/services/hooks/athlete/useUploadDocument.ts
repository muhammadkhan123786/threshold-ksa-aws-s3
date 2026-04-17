import api from 'services/clients/wretchClient';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

interface DocumentUploadResponse {
    status: number;
    message: string;
}

const uploadDocument = async (
    id: string | undefined,
    type:
        | 'national_id'
        | 'passport'
        | 'resume'
        | 'certificate'
        | 'driver_license'
        | 'medical_report'
        | 'contract'
        | 'visa'
        | 'other',
    file: File,
): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return api
        .url(`/athletes/${id}/documents/upload/${type}`)
        .post(formData)
        .json<DocumentUploadResponse>();
};

export const useUploadDocument = (
    id: string | undefined,
    type:
        | 'national_id'
        | 'passport'
        | 'resume'
        | 'certificate'
        | 'driver_license'
        | 'medical_report'
        | 'contract'
        | 'visa'
        | 'other',
    options?: UseMutationOptions<DocumentUploadResponse, Error, File>,
): UseMutationResult<DocumentUploadResponse, Error, File> => {
    return useMutation<DocumentUploadResponse, Error, File>({
        mutationFn: (file) => uploadDocument(id, type, file),
        ...options,
    });
};

const updateDocument = async (
    id: string | undefined,
    documentId: string | undefined,
    type:
        | 'national_id'
        | 'passport'
        | 'resume'
        | 'certificate'
        | 'driver_license'
        | 'medical_report'
        | 'contract'
        | 'visa'
        | 'other',
    file: File,
): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // Add type to the form data

    return api
        .url(`/athletes/${id}/documents/${documentId}`)
        .patch(formData)
        .json<DocumentUploadResponse>();
};
export const useUpdateDocument = (
    id: string | undefined,
    documentId: string | undefined,
    type:
        | 'national_id'
        | 'passport'
        | 'resume'
        | 'certificate'
        | 'driver_license'
        | 'medical_report'
        | 'contract'
        | 'visa'
        | 'other',
    options?: UseMutationOptions<DocumentUploadResponse, Error, File>,
): UseMutationResult<DocumentUploadResponse, Error, File> => {
    return useMutation<DocumentUploadResponse, Error, File>({
        mutationFn: (file) => updateDocument(id, documentId, type, file),
        ...options,
    });
};

const deleteDocument = async (
    id: string | undefined,
    documentId: string | undefined,
): Promise<DocumentUploadResponse> => {
    if (!id || !documentId) {
        throw new Error('ID and Document ID are required');
    }
    return api
        .url(`/athletes/${id}/documents/${documentId}`)
        .delete()
        .json<DocumentUploadResponse>();
};

export const useDeleteDocument = (
    id: string | undefined,
    documentId: string | undefined,
    options?: UseMutationOptions<DocumentUploadResponse, Error>,
): UseMutationResult<DocumentUploadResponse, Error, void> => {
    return useMutation<DocumentUploadResponse, Error, void>({
        mutationFn: () => deleteDocument(id, documentId),
        ...options,
    });
};
