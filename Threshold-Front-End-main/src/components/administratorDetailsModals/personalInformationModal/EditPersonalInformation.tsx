import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { arrayToSelectOptions } from 'libs/helpers';
import { Education, Gender, Nationality, Language } from 'libs/enums';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    useEditPersonalInformation,
    useFetchAdminDetailsById,
} from 'services/hooks/administratorDetails';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { useValidationSchemas } from 'schemas/coachAndAdministrator/useValidationSchemas';
import { PersonalInfoStep } from './tabsComponents/PersonalInformation';
import { FileInfoStep } from './tabsComponents/FileInfoStep';

import { useFetchPersonalInfoById } from 'services/hooks/administratorDetails';

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
import { usePersonalInfoSchema } from 'schemas';
import { SharedButton } from 'components/sharedButton';
import { AdminType } from 'libs/enums/admin-type';

interface EditPersonalInformationModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamsData: any;
}

export const EditPersonalInformation: React.FC<EditPersonalInformationModalProps> = ({
    isOpen,
    onClose,
    teamsData,
}) => {
    const { trans } = useLocales();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const validationSchema = useValidationSchemas(STEPS[activeStep].key) as any;

    const {
        params: { sportId, id },
    } = router.getState();

    const { data, refetch } = useFetchPersonalInfoById(sportId, id);
    const { refetch: refetchAdminData } = useFetchAdminDetailsById(sportId, id);
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema as any),
    });

    const { mutate } = useEditPersonalInformation(sportId, id, {
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
            refetchAdminData();
            setIsLoading(false);
            methods.reset();
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
            levelEducation: _data.levelEducation.value,
            schoolName: _data.schoolName,
            joinDate: _data.joinDate,
            playingFor: _data.playingFor.value,
            roleType: _data.roleType.value,
            languages: _data.languages
                ? _data.languages.map((item: any) => item.value).join(',')
                : undefined,
            avatar: _data.avatar,
        };
        mutate(data);
    };

    // Initialization effect
    const { reset } = methods;
    useEffect(() => {
        if (data?.payload) {
            const defaultPlayingFor = teamsData?.payload?.items.find((team: any) => {
                return String(team?.id) === String(data?.payload?.playingFor?.id);
            });

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
                playingFor: defaultPlayingFor?.id,
                roleType: arrayToSelectOptions({ array: AdminType }).find(
                    (option) => option.value === data.payload.user.role,
                )?.value,
                languages:
                    data.payload.languages?.map((lang: string) =>
                        arrayToSelectOptions({ array: Language }).find(
                            (option) => option.value === lang,
                        ),
                    ) || [],
                avatar: data.payload.avatar || '',
            });
        }
    }, [data, reset, trans]);

    const renderStepContent = () => {
        const StepComponent = STEPS[activeStep].component;
        return <StepComponent teamsData={teamsData} />;
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
