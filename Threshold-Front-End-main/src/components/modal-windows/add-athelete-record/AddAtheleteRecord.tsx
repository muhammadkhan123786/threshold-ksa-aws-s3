import React, { Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import { useLocales } from 'hooks/locales';
import { Consideration, SportProfileType, YesNo } from 'libs/enums';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { MultiSelectController } from 'components/multi-selection';
import {
    arrayToSelectOptions,
    handleAddAthleteRecord,
    handleEditAthlete,
    handleEditAthleteRecord,
    selectOptionsToValues,
} from 'libs/helpers';
import { InputDateController } from 'components/inputDate';
import { CHRONIC_DISEASES } from 'libs/constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    EDIT_MEDICAL_INFO_DEFAULTS,
    useEditAthelteRecordsSchema,
    useEditMedicalInfoSchema,
} from 'schemas';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { InputController } from 'components/input';
import { useQueryClient } from '@tanstack/react-query';
import { useAddAthleteRecords, useUpdateAthleteRecords } from 'services/hooks';
import { setModalContent } from 'store/controlsSlice';

interface AthleteRecordUpdateData {
    category: string;
    subcategory?: string;
    personalRecord?: number;
    bestRecord?: number;
    lastRecord?: number;
}

export const AddAtheleteRecord: React.FC<
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
    const dispatch = useDispatch();

    const editMedicalInfoSchema = useEditAthelteRecordsSchema();
    const {
        formState: { isValid, touchedFields },
        getValues,
        control,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editMedicalInfoSchema),
        defaultValues: defaultValues,
    });

    const updatePersonalInfoMutation = useAddAthleteRecords(athleteId);
    const queryClient = useQueryClient();
    const handleFormSave = async () => {
        const formData: AthleteRecordUpdateData = {
            category: getValues('category')?.value,
            subcategory: getValues('subcategory'),
            personalRecord: getValues('personalRecord'),
            bestRecord: getValues('bestRecord'),
            lastRecord: getValues('lastRecord'),
        };

        updatePersonalInfoMutation.mutate(formData, {
            onSuccess: (response) => {
                const isSuccess =
                    [201, 200].includes(response.status) ||
                    response?.message === 'Athlete record created successfully';
                queryClient.invalidateQueries({ queryKey: ['athelteRecords'] });

                dispatch(
                    setModalContent({
                        modalContent: {
                            type: isSuccess ? 'success' : 'warning',
                            title: isSuccess ? trans('form.success') : trans('form.warning'),
                            subtitle: isSuccess
                                ? trans('personal_info.updated_successfully')
                                : response.message || trans('form.error_occurred'),
                        },
                    }),
                );

                if (handleSave) {
                    handleSave(formData);
                }
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

    return (
        <Body>
            <FormRow
                title={trans('athlete.personal.category')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'category',
                            options: arrayToSelectOptions({ array: SportProfileType }),
                            transSuffix: 'sport.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.personal.subcategory')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'subcategory',
                            placeholder: trans('athlete.personal.subcategory'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.personal.personal')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'personalRecord',
                            placeholder: trans('highest_record_number'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.personal.best')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'bestRecord',
                            placeholder: trans('top_record_this_season'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.personal.last')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'lastRecord',
                            placeholder: trans('most_recent_record_this_season'),
                        }}
                    />
                }
            />
            {/* buttons */}
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid}
                        handleSave={handleFormSave}
                        handleCancel={handleCancel}
                        saveText={isModal ? trans('form.save') : trans('form.save')}
                        cancelText={isModal ? trans('form.cancel') : 'form.cancel'}
                    />
                }
            />
        </Body>
    );
};
