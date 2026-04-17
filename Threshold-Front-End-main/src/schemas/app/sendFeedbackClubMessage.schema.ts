import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useSendFeedbackClubMessageSchema = () => {
    const { trans } = useLocales();

    const sendMessageValidators = {
        notes: yup.string().required(trans('validation.sendMessage.notesRequired')).default(''),
        avatar: yup
            .mixed()
            .nullable()
            .notRequired()
            .test('fileSize', trans('validation.sendMessage.avatarSize'), (value: any) => {
                return !value || (value && value.size <= 5000000); // Example: max 5MB
            })
            .test('fileType', trans('validation.sendMessage.avatarType'), (value: any) => {
                return (
                    !value ||
                    (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))
                );
            }),
        type: yup.string().required(trans('validation.sendMessage.typeRequired')).default(''),
        subject: yup.string().required(trans('validation.sendMessage.subjectRequired')).default(''),
    };

    return yup.object().shape(sendMessageValidators);
};
