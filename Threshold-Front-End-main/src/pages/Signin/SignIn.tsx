import { useForm } from 'react-hook-form';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { router } from 'routers';
import { setAuthData } from 'store/authSlice';
import { useLoginSchema } from 'schemas';
import { setLang } from 'store/localesSlice';
import { useSignIn } from 'services/hooks';
import { LoginBanner } from 'components/authBanner';
import { FromHeader } from 'components/FromHeader';
import { AuthFrame } from 'components';

export const SignIn = () => {
    const dispatch = useDispatch();
    const loginSchema = useLoginSchema();
    const {
        control,
        formState: { isValid },
        handleSubmit,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(loginSchema),
    });
    const { trans } = useLocales();

    const {
        mutate: signIn,
        isPending: isLoading,
        error,
    } = useSignIn({
        onSuccess: (data) => {
            dispatch(setAuthData(data.payload));
            dispatch(setLang(data.payload.language));
            router.navigate('profile', { id: data.payload.userId }, { replace: true });
        },
    });

    const handleLogin = (data: any) => {
        signIn(data);
    };

    return (
        <Theme.Body onSubmit={handleSubmit(handleLogin)}>
            <>
                <AuthFrame />
                <Theme.FormSection>
                    <FromHeader label={trans('signin.formTitle')} />
                    <Theme.FormSubtitle variant="h5" value={trans('signin.formSubtitle')} />
                    <Theme.InputController
                        autoComplete="email"
                        {...{
                            control,
                            name: 'email',
                            label: trans('signin.email', { defaultValue: 'Email' }),
                            placeholder: trans('signin.emailPlaceholder', {
                                defaultValue: 'Email',
                            }),
                        }}
                    />
                    <Theme.InputController
                        type="password"
                        autoComplete="current-password"
                        {...{
                            control,
                            name: 'password',
                            label: trans('signin.password', { defaultValue: 'Password' }),
                            placeholder: trans('signin.passwordPlaceholder', {
                                defaultValue: 'Password',
                            }),
                        }}
                    />
                    <Theme.ControlsWrapper>
                        <Theme.SentenceWrapper>
                            <Theme.SentenceLink
                                href="forget_password"
                                text={trans('signin.forgotPassword')}
                            />
                        </Theme.SentenceWrapper>
                    </Theme.ControlsWrapper>

                    {error && (
                        <Theme.Errors>
                            {(error.message && error.message) || trans('signin.invalidCredentials')}
                        </Theme.Errors>
                    )}
                    <Theme.Button
                        disabled={!isValid || isLoading}
                        isLoading={isLoading}
                        type="submit"
                    >
                        {trans('signin.submit')}
                    </Theme.Button>

                    <Theme.RegSentenceWrapper>
                        <Theme.SentenceLink href="sign_up" text={trans('auth.registration')} />
                    </Theme.RegSentenceWrapper>
                </Theme.FormSection>
            </>
            <LoginBanner />
        </Theme.Body>
    );
};
