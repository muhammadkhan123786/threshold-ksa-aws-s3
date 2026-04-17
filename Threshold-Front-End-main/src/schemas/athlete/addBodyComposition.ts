import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useAddBodyCompositionSchema = () => {
    const { trans } = useLocales();

    const addBodyCompositionValidators = {
        date: yup.string().required(trans('validation.addBodyComposition.dateRequired')),
        weight: yup
            .string()
            .required(trans('validation.addBodyComposition.weightRequired'))
            .matches(/^\d{1,3}(\.\d{1,5})?$/, trans('validation.addBodyComposition.weightInvalid')),
        height: yup
            .string()
            .required(trans('validation.addBodyComposition.heightRequired'))
            .matches(/^[12]{1}(\.\d{1,5})?$/, trans('validation.addBodyComposition.heightInvalid')),
    };

    return yup.object().shape(addBodyCompositionValidators);
};

export const ADD_BODY_COMPOSITION_DEFAULTS = {
    weight: '',
    height: '',
    date: new Date().toLocaleDateString(),
};
