import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

// Updated request interface for coach personal information
interface AddCoachDocumentRequest {
    file: File;
    type: any;
}

interface AddCoachDocument {
    message: string;
    status: number;
    payload: any;
}

// API call for editing coach personal information

export const addCoachDocument = async (
    sportId: string,
    coachId: string,
    data: AddCoachDocumentRequest,
): Promise<AddCoachDocument> => {
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
        .url(`/sportClubProfile/${sportId}/club-admin/${coachId}/document`)
        .post(formData)
        .json<AddCoachDocument>();
    return response;
};

// Hook for using the mutation for editing coach personal information
export const useAddDocument = (
    sportId: string,
    coachId: string,
    options?: UseMutationOptions<AddCoachDocument, Error, AddCoachDocumentRequest>,
): UseMutationResult<AddCoachDocument, Error, AddCoachDocumentRequest> => {
    return useMutation<AddCoachDocument, Error, AddCoachDocumentRequest>({
        mutationFn: (data: AddCoachDocumentRequest) => addCoachDocument(sportId, coachId, data),
        ...options,
    });
};
