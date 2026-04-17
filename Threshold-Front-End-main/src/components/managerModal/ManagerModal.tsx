import React, { useEffect, useState } from 'react';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useForm, FormProvider } from 'react-hook-form';
import { useAddManagers } from 'services/hooks/manager/useAddManagers';
import { useSelector, useDispatch } from 'react-redux';
import { selectAcademy } from 'store';
import { setModalContent } from 'store/controlsSlice';
import { useFetchManagersTable } from 'services/hooks/manager/useFetchManagersTable';
import { useManagerValidationSchemas } from '../../schemas/manager/createManagerSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { AccountInformation } from './tabsComponants/AccountInformation';
import { FileInformation } from './tabsComponants/FileInformation';
import { PersonalInformation } from './tabsComponants/PersonalInformation';
import { toast } from 'react-toastify';

interface ManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    {
        key: 'account',
        label: 'tabs.account',
        component: AccountInformation,
    },
    {
        key: 'file',
        label: 'tabs.file',
        component: FileInformation,
    },
    {
        key: 'personal',
        label: 'tabs.personal',
        component: PersonalInformation,
    },
];

export const ManagerModal: React.FC<ManagerModalProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const [resError, setResError] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const { academy } = useSelector(selectAcademy);
    const dispatch = useDispatch();
    const { mutateAsync, isPending } = useAddManagers(academy.id, {
        onSuccess: (response) => {
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
            methods.reset();
            onClose();
        },
        onError: (error: any) => {
            onClose();
            toast.error(error.message || trans('form.error_occurred'));
            setResError(error.message);
            if (error.message === 'Error creating manager: Email already exists.') {
                setResError('email.already.exists');
            } else if (error.message === 'Error creating manager: Username already exists.') {
                setResError('username.already.exists');
            }
        },
    });
    const { refetch } = useFetchManagersTable(academy.id, 1, 10);
    const [selectedNationality, setSelectedNationality] = useState<any>(null);

    const validationSchema = useManagerValidationSchemas(STEPS[activeStep].key);

    const methods = useForm({
        resolver: yupResolver(validationSchema),
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
        const payload = {
            relationship: data.relationship.value,
            avatar: data.avatar,
            joinDate: data.joinDate,
            birthday: data.birthday,
            phone: data.phone,
            emergencyPhone: data.emergencyPhone,
            nationality: data.nationality.value,
            gender: data.gender.value,
            experience: data.experience,
            email: data.email,
            username: data.username,
            password: data.password,
            confirmPassword: data.confirmPassword,
            branch: data.branch,
            lastName: data.lastName,
            firstName: data.firstName,
            educationalLevel: data.educationalLevel,
            nationalId: data.nationalId,
            nationalIdExpirationDate: data.nationalIdExpirationDate,
            position: data.position.value,
            contractRenewalTerms: data.contractRenewalTerms,
            contractBenefits: data.contractBenefits,
        };

        await mutateAsync(payload);
    };

    // handle nationality change
    const handleNationalityChange = (newValue: any): void => {
        setSelectedNationality(newValue);
    };

    const renderStepContent = () => {
        const StepComponent = STEPS[activeStep].component;
        return <StepComponent onNationalityChange={handleNationalityChange} />;
    };

    useEffect(() => {
        if (!isOpen) {
            methods.reset();
        }
    }, [isOpen]);

    return (
        <Theme.SharedModalStyled
            isOpen={isOpen}
            onRequestClose={onClose}
            title={trans('modal.addnew.manager')}
        >
            <Theme.ModalContainer>
                <FormProvider {...methods}>
                    <SharedModal
                        customHeight={'100%'}
                        isOpen={isOpen}
                        onRequestClose={onClose}
                        title={trans('modal.addnew.manager')}
                        footerContent={
                            <Theme.FooterButtonsWrapper>
                                {activeStep > 0 && (
                                    <Theme.NavButton
                                        onClick={() => handleStepChange(activeStep - 1)}
                                    >
                                        {trans('button.previous')}
                                    </Theme.NavButton>
                                )}
                                {activeStep < STEPS.length - 1 ? (
                                    <SharedButton onClick={() => handleStepChange(activeStep + 1)}>
                                        {trans('button.next')}
                                    </SharedButton>
                                ) : (
                                    <SharedButton
                                        onClick={methods.handleSubmit(handleSave)}
                                        loading={isPending}
                                    >
                                        {trans('button.save')}
                                    </SharedButton>
                                )}
                            </Theme.FooterButtonsWrapper>
                        }
                    >
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
                    </SharedModal>
                </FormProvider>
            </Theme.ModalContainer>
        </Theme.SharedModalStyled>
    );
};
