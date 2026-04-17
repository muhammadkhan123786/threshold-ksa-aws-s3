import React, { Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import { useLocales } from 'hooks/locales';
import { Consideration, YesNo } from 'libs/enums';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions, handleEditAthlete, selectOptionsToValues } from 'libs/helpers';
import { InputDateController } from 'components/inputDate';
import { CHRONIC_DISEASES } from 'libs/constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EDIT_MEDICAL_INFO_DEFAULTS, useEditMedicalInfoSchema } from 'schemas';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';

export const EditMedicalInfo: React.FC<
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

    const editMedicalInfoSchema = useEditMedicalInfoSchema();
    const {
        formState: { isValid, touchedFields },
        getValues,
        control,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editMedicalInfoSchema),
        defaultValues: defaultValues || EDIT_MEDICAL_INFO_DEFAULTS,
    });

    const selectIsValid = useMemo(
        () => !!watch('allergies') && !!watch('injury') && !!watch('consideration'),
        [watch('allergies'), watch('injury'), watch('consideration')],
    );

    const handleWindowSave = async () => {
        if (isModal && athleteId) {
            await handleEditAthlete(
                selectOptionsToValues(getValues(), [
                    'allergies',
                    'multi:chronic',
                    'injury',
                    'consideration',
                ]),
                dispatch,
                athleteId,
            );
        } else {
            setAthleteData && setAthleteData((prev) => ({ ...prev, ...getValues() }));

            await new Promise<void>((resolve, reject) => {
                setTimeout(
                    async () => {
                        try {
                            if (handleSave) {
                                await handleSave(getValues());
                                resolve();
                            }
                        } catch (error) {
                            console.error('Error occurred while saving:', error);
                            reject(error);
                        }
                    },
                    activeTab === 2 ? 1000 : 100,
                );
            });
        }
    };

    useEffect(() => {
        setAthleteData && setAthleteData((prev) => ({ ...prev, ...getValues() }));
    }, [touchedFields]);

    return (
        <Body>
            <FormRow
                title={trans('form.editMedicalInfo.updating')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'dateOfUpdating',
                            withPortal: !isModal,
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editMedicalInfo.allergies')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'allergies',
                            options: arrayToSelectOptions({ array: YesNo }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editMedicalInfo.chronicDisease')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'chronic',
                            autocomplete: 'chronic',
                            options: arrayToSelectOptions({
                                array: CHRONIC_DISEASES,
                            }),
                            isMulti: true,
                            isCreatable: true,
                            menuPlacement: 'bottom',
                            transSuffix: 'form.editMedicalInfo.CHRONIC_DISEASES.',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editMedicalInfo.injury')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'injury',
                            options: arrayToSelectOptions({ array: YesNo }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editMedicalInfo.consideration')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'consideration',
                            options: arrayToSelectOptions({ array: Consideration }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            {/* buttons */}
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid && selectIsValid}
                        handleSave={handleWindowSave}
                        handleCancel={handleCancel}
                        saveText={isModal ? 'form.save' : 'form.next'}
                        cancelText={isModal || activeTab === 0 ? 'form.cancel' : 'form.back'}
                    />
                }
            />
        </Body>
    );
};
