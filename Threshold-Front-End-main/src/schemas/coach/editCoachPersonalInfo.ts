import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';

export const useEditCoachPersonalInfoSchema = () => {
    const { trans } = useLocales();

    const editCoachPersonalInfoValidators = {
        joinDate: yup.string().required(trans('validation.editCoachPersonalInfo.joinDateRequired')),
        sport: yup.object().shape(SingleSelectOption),
        gender: yup.object().shape(SingleSelectOption),
        phone: yup
            .string()
            .required(trans('validation.editCoachPersonalInfo.phoneRequired'))
            .matches(/^(05)\d{8}$/, trans('validation.editCoachPersonalInfo.phoneInvalid')),
        birthday: yup.string().required(trans('validation.editCoachPersonalInfo.birthdayRequired')),
        experience: yup
            .string()
            .required(trans('validation.editCoachPersonalInfo.experienceRequired'))
            .matches(/^\d{1,2}$/, trans('validation.editCoachPersonalInfo.experienceInvalid')),
    };

    return yup.object().shape(editCoachPersonalInfoValidators);
};
export const EDIT_COACH_PERSONAL_INFO_DEFAULTS = {};
