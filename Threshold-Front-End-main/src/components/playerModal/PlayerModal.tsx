import React, { useState } from 'react';
import { useLocales } from 'hooks/locales';
import { AccountInformation } from './tabsComponants/AccountInformation';
import { FileInformation } from './tabsComponants/FileInformation';
import { MedicalInformation } from './tabsComponants/MedicalInformation';
import * as Theme from './Theme';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    DEFAULT_PLAYER_VALUES,
    useValidationSchemas,
} from '../../schemas/player/createPlayerSchemas';
import { AddPlayersRequest, useAddPlayers } from 'services/hooks/players/useAddPlayers';
import { router } from 'routers';
import { setModalContent } from 'store/controlsSlice';
import { useFetchPlayersTable } from 'services/hooks/players/useFetchPlayersTable';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { SharedButton } from 'components/sharedButton';
import { useAddPlayersTeamId } from 'services/hooks/players/useAddPlayersToTeamId';
import { useFetchPlayersTableTeamId } from 'services/hooks/players/useFetchPlayersTableTeamId';

const STEPS = [
    {
        key: 'personalInformation',
        label: 'tabs.personalInformation',
        component: AccountInformation,
    },
    { key: 'fileInformation', label: 'tabs.fileInformation', component: FileInformation },
    { key: 'medicalInformation', label: 'tabs.medicalInformation', component: MedicalInformation },
];

export const PlayerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNationality, setSelectedNationality] = useState<any>(null);
    const validationSchema = useValidationSchemas(STEPS[activeStep].key);
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();
    const { data, isPending } = useClubList(academy.id);
    const filteredSport = data?.payload.find((club) => club.id === sportId);
    const { refetch } = useFetchPlayersTableTeamId(sportId, id);
    const { mutateAsync: addPlayer } = useAddPlayers(sportId);
    const { mutateAsync: addplayersToTeamId } = useAddPlayersTeamId(id);

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: DEFAULT_PLAYER_VALUES,
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

    const handleSave = async (data: AddPlayersRequest) => {
        setIsLoading(true);
        try {
            const payload = {
                relationship: data.relationship?.value,
                avatar: data.avatar,
                joinDate: data.joinDate,
                dateOfUpdating: data.dateOfUpdating,
                contactNumber: data.contactNumber,
                emergencyPhone: data.emergencyPhone,
                nationality: data.nationality?.value,
                education: data.education?.value,
                gender: data.gender?.value,
                nin: data.nin,
                ninExpirationDate: data.ninExpirationDate,
                dateOfBirth: data.dateOfBirth,
                lastName: data.lastName,
                firstName: data.firstName,
                allergyDetails: data.allergyDetails
                    ? data.allergyDetails.map((item: any) => item.value).join(',')
                    : undefined,
                chronicConditions: data.chronicConditions
                    ? data.chronicConditions.map((item: any) => item.value).join(',')
                    : undefined,
                healthFactors: data.healthFactors
                    ? data.healthFactors.map((item: any) => item.value).join(',')
                    : undefined,
                periodOfSubscription: data.periodOfSubscription?.value,
                position: data.position?.value,
                clublevel: data.clublevel?.value,
                category: data.category?.value,
                weight: data.weight,
            } as AddPlayersRequest;

            const response = id ? await addplayersToTeamId(payload) : await addPlayer(payload);

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
            methods.reset();
            onClose();
            setActiveStep(0);
        } catch (error: any) {
            onClose();
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans(error || 'form.error'),
                        subtitle: trans(error || 'form.error_occurred'),
                    },
                }),
            );
        } finally {
            setIsLoading(false);
        }
    };

    // handle nationality change
    const handleNationalityChange = (newValue: any): void => {
        setSelectedNationality(newValue);
    };
    const renderStepContent = () => {
        const StepComponent = STEPS[activeStep].component;
        return <StepComponent onNationalityChange={handleNationalityChange} />;
    };

    return (
        <Theme.SharedModalStyled
            isOpen={isOpen}
            onRequestClose={onClose}
            title={trans('modal.addnew.player')}
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
                        <Theme.LoaderButtton onClick={methods.handleSubmit(handleSave)}>
                            <>{isLoading ? <SaveLoaderButton /> : trans('button.save')}</>
                        </Theme.LoaderButtton>
                    )}
                </Theme.FooterButtonsWrapper>
            </Theme.ModalContainer>
        </Theme.SharedModalStyled>
    );
};
