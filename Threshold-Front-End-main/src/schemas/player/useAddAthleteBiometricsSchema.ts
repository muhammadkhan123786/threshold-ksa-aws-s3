import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useAthleteBiometricsSchema = () => {
    const { trans } = useLocales();

    const athleteBiometricsValidators = {
        date: yup
            .date()
            .required(trans('validation.addAthleteBiometrics.dateRequired'))
            .typeError(trans('validation.addAthleteBiometrics.dateInvalid')),

        height: yup
            .string()
            .required(trans('validation.addAthleteBiometrics.heightRequired'))
            .min(0, trans('validation.addAthleteBiometrics.heightMin'))
            .typeError(trans('validation.addAthleteBiometrics.heightInvalid')),

        weight: yup
            .string()
            .required(trans('validation.addAthleteBiometrics.weightRequired'))
            .min(0, trans('validation.addAthleteBiometrics.weightMin'))
            .typeError(trans('validation.addAthleteBiometrics.weightInvalid')),
    };

    return yup.object().shape(athleteBiometricsValidators);
};

export const ADD_ATHLETE_BIOMETRICS_DEFAULTS = {
    date: new Date(),
    height: '0',
    weight: '0',
    status: 'under_weight',
};
