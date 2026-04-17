import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const templateSettingValidation = () => {
    const { trans } = useLocales();

    const schema = yup.object().shape({
        phase: yup.object().required(trans('validation.required', { field: 'Phase' })),
        target: yup
            .string()
            .required(trans('validation.required', { field: 'Input Field' }))
            .min(3, trans('validation.min', { field: 'Input Field', count: 3 })),
        technique: yup.array().required(trans('validation.required', { field: 'Technique' })),
        unit: yup.object().required(trans('validation.required', { field: 'Unit' })),
        calculationMethod: yup
            .object()
            .required(trans('validation.required', { field: 'Calculation Method' })),
    });

    return schema;
};
