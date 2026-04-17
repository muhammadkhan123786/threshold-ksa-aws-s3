import React, { useState } from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { useAddAthleteHealthRecord, useFetchHealthRecordsById } from 'services/hooks';
import { LabelInput } from 'components/labelInput';
import { useEditAthleteHealthRecordSchema } from 'schemas/athlete/addAtheleteBank';
import { FormRow } from 'components/modal-windows/FormRow';
import { InputDateController } from 'components/inputDate';
import { router } from 'routers';
import { addMonths } from 'libs/helpers';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface EditMedicalInformationProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AthleteHealthRecordForm {
    type: { label?: string; value?: string };
    description: string;
    startDate: Date;
    endDate?: Date | null;
    medicalRecommendation: string;
}

export const EditMedicalInformation: React.FC<EditMedicalInformationProps> = ({
    isOpen,
    onClose,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const schema = useEditAthleteHealthRecordSchema();
    const {
        params: { id },
    } = router.getState();
    const methods = useForm<AthleteHealthRecordForm>({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            type: { label: '', value: '' },
            description: '',
            startDate: new Date(),
            endDate: null,
            medicalRecommendation: '',
        },
    });
    const { refetch: refetchAthleteAthelteSessionRecords } = useFetchHealthRecordsById(id);
    const mutate = useAddAthleteHealthRecord(id, {
        onSuccess: (response) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('record.added_successfully')
                            : response.message || trans('form.error_occurred'),
                    },
                }),
            );
            onClose();
            refetchAthleteAthelteSessionRecords();
            setIsLoading(false);
        },
        onError: (error) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message || trans('form.error_occurred'),
                    },
                }),
            );
            setIsLoading(false);
        },
    });
    const handleSave: SubmitHandler<AthleteHealthRecordForm> = (data) => {
        setIsLoading(true);
        const transformedData = {
            ...data,
            type: data.type.value || '',
            startDate: data.startDate.toISOString().split('T')[0],
            endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : null,
        };
        mutate.mutate(transformedData as any);
    };

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                title={trans('athlete.Edit.healthRecord')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('athlete.health.type')} />
                        <Controller
                            name="type"
                            control={methods.control}
                            render={({ field }) => (
                                <Theme.Input
                                    {...field}
                                    value={field.value?.value || ''}
                                    onChange={(e) =>
                                        field.onChange({ ...field.value, value: e.target.value })
                                    }
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
                    <Theme.EvenWrapper>
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
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('athlete.health.endDate')}
                                content={
                                    <InputDateController
                                        control={methods.control}
                                        name="endDate"
                                        placeholder={trans('athlete.health.endDate')}
                                        maxDate={addMonths(new Date(), 100)}
                                        minDate={new Date()}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('athlete.health.medicalRecommendation')} />
                        <Controller
                            name="medicalRecommendation"
                            control={methods.control}
                            render={({ field }) => (
                                <Theme.Input
                                    {...field}
                                    placeholder={trans('athlete.health.medicalRecommendation')}
                                />
                            )}
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
