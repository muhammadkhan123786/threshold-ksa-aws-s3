import { useForm, SubmitHandler } from 'react-hook-form';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setModalContent } from 'store/controlsSlice';
import { useForgetPassword } from 'services/hooks/user/useForgetPassword';
import { ForgetPasswordFormData, useForgetPasswordSchema } from './forgetPasswordSchema';
import { useRouter } from 'react-router5';
import { LoginBanner } from 'components/authBanner';
import { FromHeader } from 'components/FromHeader';

export const ForgetPassword = () => {
    const dispatch = useDispatch<any>();
    const [errorText, setErrorText] = useState('');
    const router = useRouter();

    const forgetPasswordSchema = useForgetPasswordSchema();
    const {
        control,
        formState: { isValid },
        handleSubmit,
    } = useForm<ForgetPasswordFormData>({
        mode: 'all',
        resolver: yupResolver(forgetPasswordSchema),
    });
    const { trans } = useLocales();

    const { mutate: forgetPassword, isPending: isLoading } = useForgetPassword({
        onSuccess: (data) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'info',
                        title: 'Info',
                        subtitle: trans('forgotPassword.successMessage'),
                    },
                }),
            );
            router.navigate('signin', {}, { replace: true });
        },
        onError: (error: any) => {
            setErrorText(trans('forgotPassword.failureMessage'));
        },
    });

    const handleForgetPassword: SubmitHandler<ForgetPasswordFormData> = (data) => {
        forgetPassword({ email: data.email });
    };

    return (
        <Theme.Body onSubmit={handleSubmit(handleForgetPassword)}>
            <Theme.FormSection>
                <FromHeader label={trans('forgotPassword.formTitle')} />
                <Theme.FormSubtitle variant="h5" value={trans('forgotPassword.formSubtitle')} />
                <Theme.InputController
                    autoComplete="email"
                    {...{
                        control,
                        name: 'email',
                        label: trans('forgotPassword.email', { defaultValue: 'Email' }),
                        placeholder: trans('forgotPassword.emailPlaceholder', {
                            defaultValue: 'Email',
                        }),
                    }}
                />
                <Theme.Errors>{errorText}</Theme.Errors>
                <Theme.Button disabled={!isValid || isLoading} isLoading={isLoading} type="submit">
                    {trans('forgotPassword.submit')}
                </Theme.Button>
                <Theme.RegSentenceWrapper>
                    <Theme.SentenceLink href="sign_up" text={trans('auth.registration')} />
                </Theme.RegSentenceWrapper>
            </Theme.FormSection>
            <LoginBanner />
        </Theme.Body>
    );
};
