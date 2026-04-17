import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export interface FeedbackForm {
    type: 'issue' | 'request' | 'suggestion' | 'other';
    subject: string;
    notes: string;
    avatar?: File;
}

export const useSendMessageSchema = () => {
    const { trans } = useLocales();

    const sendMessageValidators = {
        type: yup.string().required(trans('validation.sendMessage.typeRequired')).default(''),
        subject: yup.string().required(trans('validation.sendMessage.subjectRequired')).default(''),
        notes: yup.string().required(trans('validation.sendMessage.notesRequired')).default(''),
        avatar: yup.mixed().nullable(),
    };

    return yup.object().shape<Record<keyof FeedbackForm, any>>(sendMessageValidators);
};
