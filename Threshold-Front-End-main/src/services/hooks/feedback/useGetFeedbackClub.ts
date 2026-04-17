import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import api from '../../clients/wretchClient';

export enum FeedbackType {
    ISSUE = 'issue',
    REQUEST = 'request',
    SUGGESTION = 'suggestion',
    OTHER = 'other',
}
interface FeedbackData {
    message: string;
    type: FeedbackType;
    avatar?: File;
    subject: string;
}

interface FeedbackResponse {
    status: number;
    data: any;
}

const postFeedbackClub = async (feedbackData: FeedbackData): Promise<FeedbackResponse> => {
    const formData = new FormData();
    formData.append('message', feedbackData.message);
    formData.append('type', feedbackData.type);
    formData.append('subject', feedbackData.subject);
    if (feedbackData.avatar) {
        formData.append('avatar', feedbackData.avatar);
    }

    const response = await api.url('feedbacks/club').post(formData).json<FeedbackResponse>();
    return response;
};

export const usePostFeedbackClub = (
    options?: UseMutationOptions<FeedbackResponse, Error, FeedbackData>,
): UseMutationResult<FeedbackResponse, Error, FeedbackData> => {
    return useMutation<FeedbackResponse, Error, FeedbackData>({
        mutationFn: postFeedbackClub,
        ...options,
    });
};
