import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useAddNewSportSchema = () => {
    const { trans } = useLocales();

    return yup.object().shape({
        sport: yup
            .object()
            .shape({
                label: yup.string().required(trans('validation.sportNameRequired')),
                value: yup.string().required(trans('validation.sportNameRequired')),
            })
            .required(trans('validation.sportNameRequired')),
        sportProfileManager: yup
            .object()
            .shape({
                label: yup.string().required(trans('validation.sportProfileManagerRequired')),
                value: yup.string().required(trans('validation.sportProfileManagerRequired')),
            })
            .required(trans('validation.sportProfileManagerRequired')),
        technicalDirector: yup
            .object()
            .shape({
                label: yup.string().required(trans('validation.technicalDirectorRequired')),
                value: yup.string().required(trans('validation.technicalDirectorRequired')),
            })
            .required(trans('validation.technicalDirectorRequired')),
    });
};
