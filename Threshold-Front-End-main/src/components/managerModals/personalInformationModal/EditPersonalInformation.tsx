import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { arrayToSelectOptions } from 'libs/helpers';
import { Education, Gender, Nationality, Language, SportProfileType } from 'libs/enums';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    useUpdatePersonalInformation,
    useFetchManagerDetailsById,
    useFetchPersonalInfoById,
} from 'services/hooks/managerDetails';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { useValidationSchemas } from 'schemas/manager/useValidationSchemas';
import { PersonalInfoStep } from './tabsComponents/PersonalInformation';
import { FileInfoStep } from './tabsComponents/FileInfoStep';
import { SharedButton } from 'components/sharedButton';
import { ManagementType } from 'libs/enums/manager';
import { ContractDuration } from 'libs/enums/contract';

const STEPS = [
    {
        key: 'personalInformation',
        label: 'tabs.personalInformation',
        component: PersonalInfoStep,
    },
    {
        key: 'fileInformation',
        label: 'tabs.fileInformation',
        component: FileInfoStep,
    },
];

interface EditPersonalInformationModalProps {
    isOpen: boolean;
    onClose: () => void;
    managerDetails: any;
}

export const EditPersonalInformation: React.FC<EditPersonalInformationModalProps> = ({
    isOpen,
    onClose,
    managerDetails,
}) => {
    const { trans } = useLocales();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const validationSchema = useValidationSchemas(STEPS[activeStep].key) as any;

    const {
        params: { academyId, id },
    } = router.getState();

    const { data, refetch } = useFetchPersonalInfoById(academyId, id);
    const { refetch: refetchCoachData } = useFetchManagerDetailsById(academyId, id);

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema as any),
    });

    const { mutate } = useUpdatePersonalInformation(academyId, id, {
        onSuccess: (response) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('player.personalDataUpdatedSuccess')
                            : response.message || trans('form.error_occurred'),
                    },
                }),
            );
            onClose();
            setActiveStep(0);
            refetch();
            refetchCoachData();
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
            onClose();
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message || trans('form.error_occurred'),
                    },
                }),
            );
        },
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

    const handleSave = (_data: any) => {
        setIsLoading(true);
        const data = {
            firstName: _data.firstName,
            lastName: _data.lastName,
            gender: _data.gender.value,
            birthday: _data.birthday,
            nationality: _data.nationality.value,
            country: _data.country.value,
            experience: _data.experience,
            educationalLevel: _data.educationalLevel.value,
            schoolName: _data.schoolName,
            joinDate: _data.joinDate,
            managementType: _data.managementType.value,
            sportType: _data.sportType.value,
            contractDuration: _data.contractDuration.value,
            languages: _data.languages
                ? _data.languages.map((item: any) => item.value).join(',')
                : undefined,
            avatar: _data.avatar,
        };
        mutate(data);
    };

    const { reset } = methods;
    useEffect(() => {
        if (data?.payload) {
            reset({
                firstName: data.payload.firstName || '',
                lastName: data.payload.lastName || '',
                gender: arrayToSelectOptions({ array: Gender }).find(
                    (option) => option.value === data.payload.gender,
                )?.value,
                birthday: data.payload.birthday || '',
                nationality: arrayToSelectOptions({ array: Nationality }).find(
                    (option) => option.value === data.payload.nationality,
                )?.value,
                country: data.payload.country || '',
                experience: data.payload.experience || '',
                phone: data.payload.phone || '',
                emergencyPhone: data.payload.phone || '',
                levelEducation: arrayToSelectOptions({ array: Education }).find(
                    (option) => option.value === data.payload.levelEducation,
                )?.value,
                schoolName: data.payload.schoolName || '',
                joinDate: data.payload.joinDate || '',
                managementType: arrayToSelectOptions({ array: ManagementType }).find(
                    (option) => option.value === data.payload.managementType,
                )?.value,
                sportType: arrayToSelectOptions({ array: SportProfileType }).find(
                    (option) => option.value === data.payload.sportType,
                )?.value,
                contractDuration: arrayToSelectOptions({ array: ContractDuration }).find(
                    (option) => option.value === data.payload.contractDuration,
                )?.value,
                languages:
                    data.payload.languages?.map((lang: string) =>
                        arrayToSelectOptions({ array: Language }).find(
                            (option) => option.value === lang,
                        ),
                    ) || [],
                avatar: '',
            });
        }
    }, [data, reset, trans]);

    const renderStepContent = () => {
        const StepComponent = STEPS[activeStep].component;
        return <StepComponent managerDetails={managerDetails} />;
    };

    const handleClose = () => {
        reset();
        setActiveStep(0);
        onClose();
    };

    return (
        <Theme.SharedModalStyled
            isOpen={isOpen}
            onRequestClose={handleClose}
            title={trans('player.Edit.personalInformation')}
            footerContent={
                <Theme.FooterButtonsWrapper>
                    {activeStep > 0 && (
                        <Theme.NavButton onClick={() => handleStepChange(activeStep - 1)}>
                            {trans('button.previous')}
                        </Theme.NavButton>
                    )}
                    {activeStep < STEPS.length - 1 ? (
                        <SharedButton
                            variant="secondary"
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
                    <FormProvider {...methods}>{renderStepContent()}</FormProvider>
                </Theme.Body>
            </Theme.ModalContainer>
        </Theme.SharedModalStyled>
    );
};
