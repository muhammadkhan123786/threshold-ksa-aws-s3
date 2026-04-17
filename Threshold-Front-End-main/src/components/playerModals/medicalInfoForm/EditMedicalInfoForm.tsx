import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import { MultiSelectController } from 'components/multi-selection';
import { InputPdfController } from 'components/inputFilesController';
import { arrayToSelectOptions } from 'libs/helpers';
import { YesNo, Consideration } from 'libs/enums';
import { FoodAllergies } from 'libs/enums/athlete';
import * as Theme from './Theme';
import { useFetchMedicalInfoById, useUpdateMedicalInfo } from 'services/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAthletes } from 'hooks';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface MedicalInfoFormData {
    allergies: any;
    chronicDisease: any;
    injury: any;
    foodAllergies: any;
    consideration: any;
    foodAllergiesFile: File;
    currentConsiderationFile: File;
}

interface MedicalInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: MedicalInfoFormData;
}

export const MedicalInfoModal: React.FC<MedicalInfoModalProps> = ({
    isOpen,
    onClose,
    defaultValues,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { modalContent } = useSelector(selectControls);
    const [isLoading, setIsLoading] = useState(false);

    const {
        params: { id },
    } = router.getState();

    const { data: athlete } = useGetAthletes<any>({
        id: id || '',
        idType: 'athlete',
        dependents: [modalContent],
    });

    const updateMedicalInfoMutation = useUpdateMedicalInfo(athlete?.id);
    const methods = useForm<MedicalInfoFormData>({
        mode: 'all',
        defaultValues: defaultValues || {},
    });

    const { control, reset } = methods;

    // Pre-fill the form when athlete data is fetched
    useEffect(() => {
        if (athlete) {
            reset({
                allergies: athlete?.allergies || null,
                chronicDisease: athlete?.chronicDisease || null,
                foodAllergies: athlete?.foodAllergies || null,
                consideration: athlete?.consideration || null,
                foodAllergiesFile: athlete?.foodAllergiesFile || null,
                currentConsiderationFile: athlete?.currentConsiderationFile || null,
            });
        }
    }, [athlete, reset]);

    const handleSave: SubmitHandler<MedicalInfoFormData> = async (data) => {
        setIsLoading(true);
        const formData = new FormData();

        // Append form data fields
        formData.append('allergies', data.allergies?.value || data.allergies || null);
        formData.append(
            'chronicDisease',
            data.chronicDisease?.value || data.chronicDisease || null,
        );
        formData.append('foodAllergies', data.foodAllergies?.value || data.foodAllergies || null);
        formData.append('consideration', data.consideration?.value || data.consideration || null);
        formData.append('foodAllergiesFile', data.foodAllergiesFile || null);
        formData.append('currentConsiderationFile', data.currentConsiderationFile || null);

        updateMedicalInfoMutation.mutate(formData, {
            onSuccess: (response) => {
                const isSuccess = [200, 201].includes(response.status);
                queryClient.invalidateQueries({ queryKey: ['medicalInfo'] });

                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: trans('form.success'),
                            subtitle: isSuccess
                                ? trans('medicalInfo.updatedSuccessfully')
                                : response.message,
                        },
                    }),
                );
                onClose();
                setIsLoading(false);
            },
            onError: (error: Error) => {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: trans('form.warning'),
                            subtitle: error.message,
                        },
                    }),
                );
                onClose();
                setIsLoading(false);
            },
        });
    };

    const customHeight = '100%';

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                customHeight={customHeight}
                title={trans('medicalInfo.editTitle')}
            >
                <Theme.Body>
                    <Theme.LineHR />
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.edit.allergies')} />
                        <MultiSelectController
                            name="allergies"
                            control={control}
                            options={arrayToSelectOptions({ array: YesNo })}
                            transSuffix="form.editMedicalInfo."
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.edit.foodAllergies')} />
                        <MultiSelectController
                            name="foodAllergies"
                            control={control}
                            options={arrayToSelectOptions({ array: FoodAllergies })}
                            transSuffix="foodAllergies."
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.edit.chronicDisease')} />
                        <MultiSelectController
                            name="chronicDisease"
                            control={control}
                            options={arrayToSelectOptions({ array: YesNo })}
                            transSuffix="form.editMedicalInfo."
                        />
                    </Theme.InputsWrapper>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.edit.consideration')} />
                        <MultiSelectController
                            name="consideration"
                            control={control}
                            options={arrayToSelectOptions({ array: Consideration })}
                            transSuffix="form.editMedicalInfo."
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.edit.foodAllergiesFile')} />
                        <InputPdfController
                            name="foodAllergiesFile"
                            control={control}
                            contents={
                                <Theme.UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>{' '}
                                    {trans('form.editAthleteProfile.uploadText2')}
                                    <br />
                                    {trans('form.editAthleteProfile.uploadText4')}
                                </Theme.UploadText>
                            }
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.edit.currentConsiderationFile')} />
                        <InputPdfController
                            name="currentConsiderationFile"
                            control={control}
                            contents={
                                <Theme.UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>{' '}
                                    {trans('form.editAthleteProfile.uploadText2')}
                                    <br />
                                    {trans('form.editAthleteProfile.uploadText4')}
                                </Theme.UploadText>
                            }
                        />
                    </Theme.InputsWrapper>

                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton
                            variant="secondary"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            {isLoading ? (
                                <SaveLoaderButton spinnerColor="#C0D330" trackColor="#C0D330" />
                            ) : (
                                trans('form.save')
                            )}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
