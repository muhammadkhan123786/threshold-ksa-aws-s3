import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useLoginSchema = () => {
    const { trans } = useLocales();

    return yup.object().shape({
        email: yup
            .string()
            .required(trans('signin.validation.login.emailRequired'))
            .matches(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                trans('signin.validation.login.emailInvalid'),
            )
            .default(''),
        password: yup
            .string()
            .required(trans('signin.validation.login.passwordRequired'))
            .default(''),
    });
};

const nonAcceptedUsernames = [
    'admin',
    'user',
    'guest',
    'root',
    'test',
    'username',
    'default',
    'newuser',
    'someuser',
    'myname',
];

const nonAcceptedPasswords = [
    'password',
    '123456',
    '12345678',
    'qwerty',
    'abc123',
    'password1',
    'admin',
    'letmein',
    '111111',
    '1234',
];
