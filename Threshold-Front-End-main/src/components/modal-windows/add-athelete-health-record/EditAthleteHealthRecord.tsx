import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocales } from 'hooks/locales';
import { InputController } from 'components/input';
import { InputDateController } from 'components/inputDate';
import ButtonsControls from '../ButtonsControls';
import { useAddAthleteHealthRecord, useUpdateAthleteHealthRecord } from 'services/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { setModalContent } from 'store/controlsSlice';
import { useDispatch } from 'react-redux';
import { Body, Divider } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { useEditAthleteHealthRecordSchema } from 'schemas/athlete/addAtheleteBank';
import { addMonths, arrayToSelectOptions } from 'libs/helpers';
import { MultiSelectController } from 'components/multi-selection';
import { SessionRecordStatus } from 'libs/enums';

interface AthleteHealthRecordData {
    type: string;
    description: string;
    startDate: string;
    endDate: string;
    medicalRecommendation: string;
}

export const EditAthleteHealthRecord: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
            setAthleteData?: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const {
        defaultValues,
        isModal,
        activeTab,
        handleCancel,
        handleSave,
        id: athleteId,
        setAthleteData,
    } = props;
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const schema = useEditAthleteHealthRecordSchema();
    const {
        control,
        getValues,
        formState: { isValid },
    } = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    });

    const addHealthRecordMutation = useAddAthleteHealthRecord(athleteId);
    const updateHealthRecordMutation = useUpdateAthleteHealthRecord(
        athleteId,
        defaultValues?.recordId,
    );

    const handleFormSave = async () => {
        const formData: AthleteHealthRecordData = {
            type: getValues('type')?.value,
            description: getValues('description'),
            startDate: getValues('startDate'),
            endDate: getValues('endDate'),
            medicalRecommendation: getValues('medicalRecommendation'),
        };

        if (defaultValues?.recordId) {
            // Patch existing record
            updateHealthRecordMutation.mutate(formData, {
                onSuccess: (response) => {
                    queryClient.invalidateQueries({ queryKey: ['healthRecords'] });

                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'success',
                                title: trans('form.success'),
                                subtitle: trans('record.updated_successfully'),
                            },
                        }),
                    );
                    if (handleSave) handleSave(formData);
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
        } else {
            // Add new record
            addHealthRecordMutation.mutate(formData, {
                onSuccess: (response) => {
                    queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'success',
                                title: trans('form.success'),
                                subtitle: trans('record.added_successfully'),
                            },
                        }),
                    );
                    if (handleSave) handleSave(formData);
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
        }
    };

    return (
        <Body>
            <FormRow
                title={trans('athlete.health.type')}
                content={
                    // <InputController
                    //     type="text"
                    //     control={control}
                    //     name="type"
                    //     placeholder={trans('athlete.health.type')}
                    // />
                    <MultiSelectController
                        {...{
                            control,
                            name: `type`,
                            options: arrayToSelectOptions({
                                array: SessionRecordStatus,
                            }),
                            transSuffix: 'session.',
                            menuPlacement: 'bottom',
                        }}
                        style={{
                            margin: 'auto',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.health.description')}
                // content={
                //     <InputController
                //         type="text"
                //         control={control}
                //         name="description"
                //         placeholder={trans('athlete.health.description')}
                //     />
                // }
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'description',
                            placeholder: trans('athlete.health.description'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.health.startDate')}
                content={
                    <InputDateController
                        control={control}
                        name="startDate"
                        placeholder={trans('athlete.health.startDate')}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.health.endDate')}
                content={
                    <InputDateController
                        control={control}
                        name="endDate"
                        maxDate={addMonths(new Date(), 1)}
                        minDate={new Date()}
                        placeholder={trans('athlete.health.endDate')}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.health.medicalRecommendation')}
                content={
                    <InputController
                        type="text"
                        control={control}
                        name="medicalRecommendation"
                        placeholder={trans('athlete.health.medicalRecommendation')}
                    />
                }
            />
            {/* Buttons */}
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid}
                        handleSave={handleFormSave}
                        handleCancel={handleCancel}
                    />
                }
            />
        </Body>
    );
};
