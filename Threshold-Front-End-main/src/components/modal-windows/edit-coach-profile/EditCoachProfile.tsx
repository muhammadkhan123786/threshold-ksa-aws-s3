import React from 'react';
import { useForm } from 'react-hook-form';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { handleEditCoach } from 'libs/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { EDIT_COACH_PROFILE_DEFAULTS, useEditCoachProfileSchema } from 'schemas';
import { CoachProfileInfoForm } from './CoachProfileInfoForm';

export const EditCoachProfile: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { defaultValues, id: coachId, handleCancel } = props;
    const dispatch = useDispatch();

    const editCoachProfileSchema = useEditCoachProfileSchema();
    const {
        formState: { isValid },
        control,
        getValues,
        trigger,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editCoachProfileSchema),
        defaultValues: defaultValues || EDIT_COACH_PROFILE_DEFAULTS,
    });

    const handleWindowSave = async () => {
        if (coachId) {
            await handleEditCoach(getValues(), dispatch, coachId);
        }
    };

    return (
        <Body>
            <CoachProfileInfoForm control={control} trigger={trigger} getValues={getValues} />
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid}
                        handleSave={handleWindowSave}
                        handleCancel={handleCancel}
                        saveText={'form.save'}
                        cancelText={'form.cancel'}
                    />
                }
            />
        </Body>
    );
};
