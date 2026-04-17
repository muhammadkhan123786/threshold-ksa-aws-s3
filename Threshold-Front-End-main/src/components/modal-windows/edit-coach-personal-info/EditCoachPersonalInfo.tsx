import React, { useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body } from '../Theme';
import { handleEditCoach, selectOptionsToValues } from 'libs/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EDIT_COACH_PERSONAL_INFO_DEFAULTS, useEditCoachPersonalInfoSchema } from 'schemas';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { CoachPersonalInfoForm } from './CoachPersonalInfoForm';

export const EditCoachPersonalInfo: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { defaultValues, id: coachId } = props;
    const dispatch = useDispatch();
    const editCoachPersonalInfoSchema = useEditCoachPersonalInfoSchema();
    const {
        formState: { isValid },
        control,
        getValues,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editCoachPersonalInfoSchema),
        defaultValues: defaultValues || EDIT_COACH_PERSONAL_INFO_DEFAULTS,
    });

    const selectIsValid = useMemo(
        () => !!watch('sport') && !!watch('gender'),
        [watch('sport'), watch('gender')],
    );

    const handleWindowSave = async () => {
        if (coachId) {
            await handleEditCoach(
                selectOptionsToValues(getValues(), ['sport', 'gender']),
                dispatch,
                coachId,
            );
        }
    };

    return (
        <Body>
            <CoachPersonalInfoForm control={control} defaultValues={{}} />

            {/* buttons */}
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid && selectIsValid}
                        handleSave={handleWindowSave}
                        saveText={'form.save'}
                        cancelText={'form.cancel'}
                    />
                }
            />
        </Body>
    );
};
