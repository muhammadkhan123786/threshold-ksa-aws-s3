import { useForm, FormProvider } from 'react-hook-form';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { AuthBanner, AuthFrame } from 'components';
import { useRegisterSchema } from 'schemas';
import { setModalContent } from 'store/controlsSlice';
import { router } from 'routers';
import { useSignUp } from 'services/hooks';
import { MultiStepForm } from 'components/MultiStepForm';
import AcademyOrClub from './AcademyOrClub';
import OrganizationData from './OrganizationData';
import UserData from './UserData';
import { FromHeader } from 'components/FromHeader';
import { omitBy } from 'lodash';
import { SignUpRequest } from 'services/hooks/user/useSignUp';

export const SignUp = () => {
    const dispatch = useDispatch<any>();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const registerSchema = useRegisterSchema();
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(registerSchema),
    });
    const { trans } = useLocales();

    const {
        mutate: signUp,
        isPending: isLoading,
        error,
    } = useSignUp({
        onSuccess: () => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'info',
                        title: 'Info',
                        subtitle: trans('signup.success.message'),
                    },
                }),
            );
            router.navigate('home', {}, { replace: true });
        },
        onError: (error) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message,
                    },
                }),
            );
        },
    });

    const handleRegister = (data: SignUpRequest) => {
        signUp(data);
    };

    const handleStepChange = (step: number) => {
        if (step >= 1 && step <= steps.length) {
            setCurrentStep(step);
        }
    };

    const steps = [
        <AcademyOrClub key="step1" />,
        <OrganizationData key="step2" />,
        <UserData key="step3" />,
    ];

    return (
        <FormProvider {...methods}>
            <Theme.Body onSubmit={methods.handleSubmit(handleRegister as any)}>
                <AuthBanner />
                <Theme.FormSection>
                    <Theme.StageWrapper>
                        <FromHeader label={trans('signup.formSubtitle1')} marginTop="100px" />
                    </Theme.StageWrapper>
                    <Theme.MultiStepFormWrapper>
                        <MultiStepForm
                            steps={steps}
                            currentStep={currentStep}
                            activeColor="#C0D330"
                            inactiveColor="rgba(192, 211, 48, 0.08)"
                            onStepChange={handleStepChange}
                        />
                    </Theme.MultiStepFormWrapper>
                    <>
                        <Theme.ButtonWrapper>
                            <Theme.Button
                                isLoading={isLoading}
                                type={currentStep === steps.length ? 'submit' : 'button'}
                                disabled={
                                    currentStep === steps.length
                                        ? !methods.formState.isValid || isLoading
                                        : isLoading
                                }
                                onClick={() => {
                                    if (currentStep < steps.length) {
                                        setCurrentStep((prev) => prev + 1);
                                    }
                                }}
                            >
                                {currentStep < steps.length
                                    ? trans('signup.next')
                                    : trans('signup.submit')}
                            </Theme.Button>
                            {error?.message && <Theme.Errors>{error?.message}</Theme.Errors>}
                        </Theme.ButtonWrapper>

                        <Theme.RegSentenceWrapper>
                            <Theme.SentenceLink
                                href="sign_in"
                                text={trans('signup.alreadyHaveAccount')}
                            />
                        </Theme.RegSentenceWrapper>
                    </>
                </Theme.FormSection>
                <AuthFrame />
            </Theme.Body>
        </FormProvider>
    );
};
