import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useForgetPasswordSchema = () => {
    const { trans } = useLocales();

    const forgetPasswordSchema = yup.object().shape({
        email: yup
            .string()
            .email(
                trans('forgotPassword.validation.invalidEmail', {
                    defaultValue: 'Invalid email format',
                }),
            )
            .required(
                trans('forgotPassword.validation.emailRequired', {
                    defaultValue: 'Email is required',
                }),
            ),
    });

    return forgetPasswordSchema;
};

export interface ForgetPasswordFormData {
    email: string;
}
