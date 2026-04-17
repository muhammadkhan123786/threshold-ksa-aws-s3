import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useDocumentSchema = () => {
    const { trans } = useLocales();

    return yup.object({
        type: yup.object().required(trans('validation.documentTypeRequired')),
        file: yup
            .mixed()
            .nullable()
            .required(trans('validation.fileRequired'))
            .test(
                'fileSize',
                trans('validation.fileSize'),
                (value) => value && (value as File).size <= 5242880, // 5 MB max size
            )
            .test(
                'fileType',
                trans('validation.fileType'),
                (value) => value && ['application/pdf'].includes((value as File).type),
            ),
    });
};
