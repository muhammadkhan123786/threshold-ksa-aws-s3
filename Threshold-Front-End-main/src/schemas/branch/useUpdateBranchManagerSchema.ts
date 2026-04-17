import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useUpdateBranchManagerSchema = () => {
    const { trans } = useLocales();

    return yup.object({
        username: yup.string().required(trans('validation.usernameRequired')),
        email: yup
            .string()
            .email(trans('validation.invalidEmailFormat'))
            .required(trans('validation.emailRequired')),
        password: yup
            .string()
            .min(6, trans('validation.passwordMin'))
            .required(trans('validation.passwordRequired')),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), undefined], trans('validation.passwordsMustMatch'))
            .required(trans('validation.confirmPasswordRequired')),
        phoneNumber: yup.string().nullable(),
        academy: yup.string().nullable(),
    });
};
