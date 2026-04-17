import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useAddFitnessBatterySchema = () => {
    const { trans } = useLocales();

    const addFitnessBatteryValidators = {
        date: yup
            .date()
            .required(trans('validation.addFitnessBattery.dateRequired'))
            .typeError(trans('validation.addFitnessBattery.dateInvalid')),
        curl: yup
            .string()
            .required(trans('validation.addFitnessBattery.curlRequired'))
            .matches(/^[\d]+$/, trans('validation.addFitnessBattery.curlInvalid')),
        push: yup
            .string()
            .required(trans('validation.addFitnessBattery.pushRequired'))
            .matches(/^[\d]+$/, trans('validation.addFitnessBattery.pushInvalid')),
        trunk: yup
            .string()
            .required(trans('validation.addFitnessBattery.trunkRequired'))
            .matches(/^[\d]+$/, trans('validation.addFitnessBattery.trunkInvalid')),
        sit: yup
            .string()
            .required(trans('validation.addFitnessBattery.sitRequired'))
            .matches(/^[\d]+$/, trans('validation.addFitnessBattery.sitInvalid')),
        pacer: yup
            .string()
            .required(trans('validation.addFitnessBattery.pacerRequired'))
            .matches(/^[\d]+$/, trans('validation.addFitnessBattery.pacerInvalid')),
    };

    return yup.object().shape(addFitnessBatteryValidators);
};

export const ADD_FITNESS_BATTERY_DEFAULTS = {
    date: new Date(),
    curl: '',
    push: '',
    trunk: '',
    sit: '',
    pacer: '',
};
