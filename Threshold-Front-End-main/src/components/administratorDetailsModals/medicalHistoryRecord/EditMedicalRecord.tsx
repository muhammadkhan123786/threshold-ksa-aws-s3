import React from 'react';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
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
import { useUpdateMedicalInfo } from 'services/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAthletes } from 'hooks';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { FormRow } from 'components/modal-windows/FormRow';
import { InputDateController } from 'components/inputDate';

interface EditMedicalRecordFormData {
    allergies: any;
    chronicDisease: any;
    injury: any;
    foodAllergies: any;
    consideration: any;
    type?: string;
    description?: string;
    foodAllergiesFile?: File;
    currentConsiderationFile?: File;
    id?: number;
}

interface editMedicalRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: EditMedicalRecordFormData;
    id?: number;
}

export const EditMedicalRecord: React.FC<editMedicalRecordModalProps> = ({
    isOpen,
    onClose,
    defaultValues,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();

    const { data: athlete, isLoading } = useGetAthletes<any>({
        id: id || '',
        idType: 'athlete',
        dependents: [modalContent],
    });

    const updateMedicalInfoMutation = useUpdateMedicalInfo(athlete?.id);
    const methods = useForm<EditMedicalRecordFormData>({
        mode: 'all',
        defaultValues: defaultValues || {},
    });

    const handleSave: SubmitHandler<EditMedicalRecordFormData> = async (data) => {
        const formData = new FormData();

        // Append form data fields
        formData.append('allergies', data.allergies?.value || '');
        formData.append('chronicDisease', data.chronicDisease?.value || '');
        formData.append('foodAllergies', data.foodAllergies?.value || '');
        formData.append('consideration', data.consideration?.value || '');
        formData.append('foodAllergiesFile', data.foodAllergiesFile || '');
        formData.append('currentConsiderationFile', data.currentConsiderationFile || '');

        updateMedicalInfoMutation.mutate(formData, {
            onSuccess: (response) => {
                const isSuccess = [200, 201].includes(response.status);
                queryClient.invalidateQueries({ queryKey: ['medicalInfo'] });

                dispatch(
                    setModalContent({
                        modalContent: {
                            type: isSuccess ? 'success' : 'warning',
                            title: isSuccess ? trans('form.success') : trans('form.warning'),
                            subtitle: isSuccess
                                ? trans('medicalInfo.updatedSuccessfully')
                                : response.message || trans('form.error_occurred'),
                        },
                    }),
                );
                if (isSuccess) onClose();
            },
            onError: (error: Error) => {
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
    };
    const customHeight = '100%';
    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                customHeight={customHeight}
                title={trans('coach.profile.Edit.medicalRecord')}
            >
                <Theme.Body>
                    <Theme.LineHR />

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('athlete.health.type')} />
                        <Controller
                            name="type"
                            control={methods.control}
                            render={({ field }) => (
                                <Theme.Input
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={trans('athlete.health.type')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('athlete.health.description')} />
                        <Controller
                            name="description"
                            control={methods.control}
                            render={({ field }) => (
                                <Theme.Input
                                    {...field}
                                    placeholder={trans('athlete.health.description')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('athlete.health.startDate')}
                            content={
                                <InputDateController
                                    control={methods.control}
                                    name="startDate"
                                    placeholder={trans('athlete.health.startDate')}
                                />
                            }
                        />
                    </Theme.FullWidthInputsWrapper>

                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <Theme.SubmitButton
                            type="button"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            <img
                                src="/assets/icons/add-icon-colored.svg"
                                height={20}
                                width={20}
                                alt="Save Icon"
                            />
                            {trans('form.save')}
                        </Theme.SubmitButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
