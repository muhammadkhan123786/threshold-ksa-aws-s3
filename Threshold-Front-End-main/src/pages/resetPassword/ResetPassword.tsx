import { useForm, SubmitHandler } from 'react-hook-form';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { includes } from 'lodash';
import { SUCCESS_STATUS } from 'libs/constants';
import { AuthBanner } from 'components';
import { setModalContent } from 'store/controlsSlice';
import { useRouter } from 'react-router5';
import { ResetPasswordFormData, useResetPasswordSchema } from './resetPasswordSchema';
import { useResetPassword } from 'services/hooks';
import { LoginBanner } from 'components/authBanner';
import { FromHeader } from 'components/FromHeader';

export const ResetPassword = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const {
        params: { token },
    } = router.getState();

    const resetPasswordSchema = useResetPasswordSchema();
    const dispatch = useDispatch<any>();
    const [errorText, setErrorText] = useState('');
    const {
        control,
        formState: { isValid },
        handleSubmit,
    } = useForm<ResetPasswordFormData>({
        mode: 'all',
        resolver: yupResolver(resetPasswordSchema),
    });
    const { trans } = useLocales();

    const { mutate: resetPassword, isPending: isLoading } = useResetPassword({
        onSuccess: (data) => {
            setIsSuccess(true);
        },
        onError: (error: any) => {
            setErrorText(trans('resetPassword.failureMessage'));
            setIsSuccess(false);
        },
    });

    const handleResetPassword: SubmitHandler<ResetPasswordFormData> = (data) => {
        resetPassword({ token, password: data.password });
    };

    return (
        <Theme.Body onSubmit={handleSubmit(handleResetPassword)}>
            {isSuccess ? (
                <Theme.FormSection>
                    <FromHeader label={trans('resetPassword.successMessage')} />
                    <Theme.ResetSuccessBackGround />
                    <Theme.Button
                        disabled={!isValid || isLoading}
                        isLoading={isLoading}
                        type="button"
                    >
                        {/* {trans('resetPassword.continue')} */}
                        <Theme.SentenceLink
                            href="/auth/sign_in"
                            text={trans('resetPassword.continue')}
                        />
                    </Theme.Button>
                </Theme.FormSection>
            ) : (
                <Theme.FormSection>
                    <FromHeader label={trans('resetPassword.formTitle')} />
                    <Theme.FormSubtitle variant="h5" value={trans('resetPassword.formSubtitle')} />
                    <Theme.InputController
                        type="password"
                        autoComplete="new-password"
                        {...{
                            control,
                            name: 'password',
                            label: trans('resetPassword.password', { defaultValue: 'Password' }),
                            placeholder: trans('resetPassword.passwordPlaceholder', {
                                defaultValue: 'Password',
                            }),
                        }}
                    />
                    <Theme.InputController
                        type="password"
                        autoComplete="new-password"
                        {...{
                            control,
                            name: 'confirmPassword',
                            label: trans('resetPassword.confirmPassword', {
                                defaultValue: 'Confirm Password',
                            }),
                            placeholder: trans('resetPassword.confirmPasswordPlaceholder', {
                                defaultValue: 'Confirm Password',
                            }),
                        }}
                    />
                    <Theme.Errors>{errorText}</Theme.Errors>
                    <Theme.Button
                        disabled={!isValid || isLoading}
                        isLoading={isLoading}
                        type="submit"
                    >
                        {trans('resetPassword.submit')}
                    </Theme.Button>
                    <Theme.RegSentenceWrapper>
                        <Theme.SentenceLink href="sign_up" text={trans('auth.registration')} />
                    </Theme.RegSentenceWrapper>
                </Theme.FormSection>
            )}

            <LoginBanner />
        </Theme.Body>
    );
};
