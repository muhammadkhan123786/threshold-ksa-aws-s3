import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useEditCoachAccountInfoSchema = () => {
    const { trans } = useLocales();

    const editCoachPersonalInfoValidators = {
        username: yup.string().required(trans('validation.editCoachAccountInfo.usernameRequired')),
        email: yup
            .string()
            .required(trans('validation.editCoachAccountInfo.emailRequired'))
            .email(trans('validation.editCoachAccountInfo.emailInvalid')),
        password: yup
            .string()
            .required(trans('validation.editCoachAccountInfo.passwordRequired'))
            .min(6, trans('validation.editCoachAccountInfo.passwordTooShort')),
        confirmPassword: yup
            .string()
            .required(trans('validation.editCoachAccountInfo.confirmPasswordRequired'))
            .oneOf(
                [yup.ref('password')],
                trans('validation.editCoachAccountInfo.passwordsMustMatch'),
            ),
    };

    return yup.object().shape(editCoachPersonalInfoValidators);
};
export const EDIT_COACH_PERSONAL_INFO_DEFAULTS = {};
