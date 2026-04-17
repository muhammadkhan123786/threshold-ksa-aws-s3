import React, { useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body } from '../Theme';
import { handleEditTeam, selectOptionsToValues } from 'libs/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNewTeamSchema, EDIT_NEW_TEAM_DEFAULTS } from 'schemas';
import ButtonsControls from '../ButtonsControls';
import { useDispatch, useSelector } from 'react-redux';
import { TeamInfoForm } from './TeamInfoForm';
import { selectAcademy, selectControls } from 'store';
import { useGetAthletes } from 'hooks';
import { Athlete, Coach } from 'libs/types';
import { useGetCoaches } from 'hooks/data';

export const EditTeamInfo: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const { defaultValues, isModal, activeTab, handleCancel, id: teamId } = props;
    const dispatch = useDispatch();
    const { academy } = useSelector(selectAcademy);
    const { modalContent } = useSelector(selectControls);
    const { data: athletes } = useGetAthletes<Athlete[]>({
        idType: 'academy',
        dependents: [modalContent],
    });
    const { data: coaches } = useGetCoaches<Coach[]>({
        idType: 'academy',
        dependents: [modalContent],
    });
    const newTeamSchema = useNewTeamSchema();

    const {
        formState: { isValid },
        getValues,
        control,
        watch,
        trigger,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(newTeamSchema),
        defaultValues: defaultValues || EDIT_NEW_TEAM_DEFAULTS,
    });

    const selectIsValid = useMemo(
        () => !!watch('branch') && !!watch('sport') && !!watch('coach'),
        [watch('branch'), watch('sport'), watch('coach')],
    );

    const handleWindowSave = async () => {
        if (teamId) {
            await handleEditTeam(
                selectOptionsToValues(getValues(), ['branch', 'coach', 'sport', 'multi:athletes']),
                dispatch,
                teamId,
            );
        }
    };

    return (
        <Body>
            <TeamInfoForm
                control={control}
                academy={academy}
                athletes={athletes}
                coaches={coaches}
                getValues={getValues}
                trigger={trigger}
                flag={defaultValues?.flag}
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
