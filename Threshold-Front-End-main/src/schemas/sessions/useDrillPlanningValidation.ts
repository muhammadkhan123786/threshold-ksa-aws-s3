import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { MAX_FILE_SIZE } from 'libs/types/athlete';

export const useDrillPlanningValidation = () => {
    const { trans } = useLocales();

    const schema = yup.object().shape({
        title: yup.string().required(trans('form.enterDrillTitle')).default(''),
        description: yup.string().required(trans('form.enterDrillDescription')).default(''),
        theme: yup.string().required(trans('form.enterTheme')).default(''),
        space: yup.string().required(trans('form.enterSpace')).default(''),
        trainingLoad: yup.string().required(trans('form.enterTrainingLoad')).default(''),
        timeLoad: yup.string().required(trans('form.enterTimeLoad')).default(''),
        drillImage: yup
            .string()
            .nullable()
            .test('is-base64', trans('validation.editAthleteProfile.uploadImage'), (value) => {
                if (!value) return true;
                return /^data:image\/(png|jpe?g|gif);base64,/.test(value);
            })
            .test('file-size', trans('validation.editAthleteProfile.uploadImageSize'), (value) => {
                if (!value) return true;
                const sizeInBytes =
                    (value.length * 3) / 4 -
                    (value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0);
                return sizeInBytes <= MAX_FILE_SIZE;
            })
            .default(undefined),
    });

    return schema;
};
