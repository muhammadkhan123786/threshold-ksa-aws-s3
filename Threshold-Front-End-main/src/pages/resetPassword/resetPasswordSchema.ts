import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useResetPasswordSchema = () => {
    const { trans } = useLocales();

    const resetPasswordSchema = yup.object().shape({
        password: yup
            .string()
            .min(
                6,
                trans('resetPassword.validation.passwordMinLength', {
                    defaultValue: 'Password must be at least 6 characters',
                }),
            )
            .required(
                trans('resetPassword.validation.passwordRequired', {
                    defaultValue: 'Password is required',
                }),
            ),
        confirmPassword: yup
            .string()
            .oneOf(
                [yup.ref('password'), undefined],
                trans('resetPassword.validation.passwordsMustMatch', {
                    defaultValue: 'Passwords must match',
                }),
            )
            .required(
                trans('resetPassword.validation.confirmPasswordRequired', {
                    defaultValue: 'Confirm Password is required',
                }),
            ),
    });

    return resetPasswordSchema;
};

export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}
