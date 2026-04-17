import React, { useState } from 'react';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    DEFAULT_ADMINS_VALUES,
    useValidationSchemas,
} from '../../schemas/administrator/createAdministratorSchemas';
import { router } from 'routers';
import { setModalContent } from 'store/controlsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { AccountInformation } from './tabsComponants/AccountInformation';
import { PersonalInformation } from './tabsComponants/PersonalInformation';
import {
    AddAdministratorsRequest,
    useAddAdministrators,
} from 'services/hooks/administrator/useAddAdministrators';
import { useFetchAdministratorsTable } from 'services/hooks/administrator/useFetchAdministratorsTable';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { SharedButton } from 'components/sharedButton';

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

export const AdministratorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const validationSchema = useValidationSchemas(STEPS[activeStep].key);
    const [isLoading, setIsLoading] = useState(false);
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId },
    } = router.getState();
    const { data, isPending } = useClubList(academy.id);
    const filteredSport = data?.payload.find((club) => club.id === sportId);

    if (filteredSport) {
        console.log('Sport Name:', filteredSport?.sport);
    } else {
        console.log('No sport found with the given ID.');
    }
    const { refetch } = useFetchAdministratorsTable(sportId, 1, 10);

    const { mutateAsync } = useAddAdministrators(sportId);

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

    const handleSave = async (data: AddAdministratorsRequest) => {
        setIsLoading(true);
        const payload = {
            relationship: data.relationship.value,
            avatar: data.avatar,
            joinDate: data.joinDate,
            birthday: data.birthday,
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
                setIsLoading(false);
                methods.reset();
                setActiveStep(0);
            } else {
                const errorMessage = response.message || trans('form.error_occurred');
                setIsLoading(false);
                onClose();
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: trans('form.warning'),
                            subtitle: errorMessage,
                        },
                    }),
                );
            }
        } catch (error: any) {
            setIsLoading(false);
            console.error('Error occurred while saving administrator:', error);

            if (error.message === 'Email already exists') {
                // Set the error on the email field
                methods.setError('email', {
                    type: 'manual',
                    message: trans('email.already.exists'),
                });
            } else if (error.message === 'Username already exists') {
                // Set the error on the username field
                methods.setError('username', {
                    type: 'manual',
                    message: trans('username.already.exists'),
                });
            } else if (
                error.message ===
                'Password too weak. It must be at least 8 characters long, include uppercase and lowercase letters, and contain at least one number.'
            ) {
                // Set the error on the password field
                methods.setError('password', {
                    type: 'manual',
                    message: trans('password.too.weak'),
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
        }
    };

    const renderStepContent = () => {
        const StepComponent = STEPS[activeStep].component;
        return <StepComponent />;
    };

    React.useEffect(() => {
        if (!isOpen) {
            methods.reset();
            setActiveStep(0);
        }
    }, [isOpen, methods]);
    return (
        <Theme.SharedModalStyled
            isOpen={isOpen}
            onRequestClose={onClose}
            title={trans('modal.addnew.administrators')}
            footerContent={
                <Theme.FooterButtonsWrapper>
                    {activeStep > 0 && (
                        <Theme.NavButton onClick={() => handleStepChange(activeStep - 1)}>
                            {trans('button.previous')}
                        </Theme.NavButton>
                    )}
                    {activeStep < STEPS.length - 1 ? (
                        <SharedButton
                            onClick={methods.handleSubmit(() => handleStepChange(activeStep + 1))}
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
                    <FormProvider {...methods}>{renderStepContent()} </FormProvider>
                </Theme.Body>
            </Theme.ModalContainer>
        </Theme.SharedModalStyled>
    );
};
