import React, { useState, useEffect } from 'react';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import { AccountInformation } from './tabsComponents/AccountInformation';
import { PersonalInformation } from './tabsComponents/PersonalInformation';
import * as Theme from './Theme';
import { useForm, FormProvider } from 'react-hook-form';
import { useAddCoach } from 'services/hooks/coach/useAddCoach';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import { useFetchCoachesTable } from 'services/hooks/coach/useFetchCoachesTable';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'routers';
import {
    DEFAULT_ADMINS_VALUES,
    useValidationSchemas,
} from '../../schemas/administrator/createAdministratorSchemas';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { SharedButton } from 'components/sharedButton';

interface CoachesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    {
        key: 'personalInformation',
        label: 'tabs.personalInformation',
        component: PersonalInformation,
    },
    {
        key: 'accountInformation',
        label: 'tabs.accountInformation',
        component: AccountInformation,
    },
];

export const CoachesModal: React.FC<CoachesModalProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const validationSchema = useValidationSchemas(STEPS[activeStep].key);

    const {
        params: { sportId },
    } = router.getState();

    const { refetch } = useFetchCoachesTable(sportId, 1, 10);
    const { mutateAsync } = useAddCoach(sportId);

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: DEFAULT_ADMINS_VALUES,
        mode: 'all',
    });

    const handleStepChange = async (nextStep: number) => {
        if (nextStep < activeStep) {
            setActiveStep(nextStep);
            return;
        }
        const isValid = await methods.trigger();
        if (isValid) {
            setActiveStep(nextStep);
        } else {
            const firstErrorField = Object.keys(methods.formState.errors)[0];
            if (firstErrorField) methods.setFocus(firstErrorField);
        }
    };
    const handleSave = async (data: any) => {
        setIsLoading(true);
        const payload = {
            relationship: data.relationship.value,
            avatar: data.avatar,
            joinDate: data.joinDate,
            birthday: data.birthday || new Date(),
            phone: data.phone,
            type: data.type.value,
            emergencyPhone: data.emergencyPhone,
            nationality: data.nationality.value,
            gender: data.gender.value,
            experience: data.experience,
            email: data.email,
            username: data.username,
            password: data.password,
            branch: data.branch,
            lastName: data.lastName,
            firstName: data.firstName,
        };

        try {
            const response = await mutateAsync(payload);

            if ([200, 201].includes(response.status)) {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: trans('form.success'),
                            subtitle: trans('manager.created_successfully'),
                        },
                    }),
                );
                refetch();
                onClose();
                methods.reset();
                setActiveStep(0);
            } else {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: trans('form.warning'),
                            subtitle: response.message || trans('form.error_occurred'),
                        },
                    }),
                );
            }
        } catch (error: any) {
            if (error.message === 'Email already exists') {
                methods.setError('email', {
                    type: 'manual',
                    message: trans('email.already.exists'),
                });
            } else if (error.message === 'Username already exists') {
                methods.setError('username', {
                    type: 'manual',
                    message: trans('username.already.exists'),
                });
            } else {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: trans('form.warning'),
                            subtitle: trans('form.error_occurred'),
                        },
                    }),
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        const StepComponent = STEPS[activeStep].component;
        return <StepComponent key={STEPS[activeStep].key} />;
    };

    useEffect(() => {
        if (!isOpen) {
            methods.reset();
            setActiveStep(0);
        }
    }, [isOpen, methods]);

    return (
        <Theme.SharedModalStyled
            isOpen={isOpen}
            onRequestClose={onClose}
            title={trans('modal.addnew.coach')}
            footerContent={
                <Theme.FooterButtonsWrapper>
                    {activeStep > 0 && (
                        <Theme.NavButton
                            type="button"
                            onClick={() => handleStepChange(activeStep - 1)}
                        >
                            {trans('button.previous')}
                        </Theme.NavButton>
                    )}
                    {activeStep < STEPS.length - 1 ? (
                        <SharedButton
                            type="button"
                            onClick={() => handleStepChange(activeStep + 1)}
                        >
                            {trans('button.next')}
                        </SharedButton>
                    ) : (
                        <SharedButton type="button" onClick={methods.handleSubmit(handleSave)}>
                            {isLoading ? <SaveLoaderButton /> : trans('button.save')}
                        </SharedButton>
                    )}
                </Theme.FooterButtonsWrapper>
            }
        >
            <Theme.ModalContainer>
                <Theme.ProgressContainer>
                    {STEPS.map((step, index) => (
                        <Theme.ProgressStep
                            key={step.key}
                            isActive={index === activeStep}
                            isCompleted={index < activeStep}
                            onClick={() => handleStepChange(index)}
                        >
                            {trans(step.label)}
                        </Theme.ProgressStep>
                    ))}
                </Theme.ProgressContainer>

                <Theme.Body>
                    <FormProvider {...methods}>{renderStepContent()}</FormProvider>
                </Theme.Body>
            </Theme.ModalContainer>
        </Theme.SharedModalStyled>
    );
};
