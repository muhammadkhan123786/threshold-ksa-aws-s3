// CurrentTeamRecords.tsx
import React, { Fragment, useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { arrayToSelectOptions, getScaleExertion } from 'libs/helpers';
import { MultiSelectController } from 'components/multi-selection';
import { SessionRecordStatus } from 'libs/enums';
import { getAvatarPlaceholder } from 'libs/constants';
import { InputController } from 'components/input';
import * as Theme from './Theme';

const CurrentTeamRecords: React.FC = () => {
    const { trans } = useLocales();
    const { control, watch } = useFormContext();
    const { currentTeam } = useSelector(selectAcademy);
    const key = useId();

    return (
        <Theme.AthletesStateList>
            <Theme.ListHeader>{trans('session.teamList')}</Theme.ListHeader>
            <Theme.ListHeader>{trans('session.athleteStatus')}</Theme.ListHeader>
            <Theme.ListHeader>{trans('session.scale')}</Theme.ListHeader>
            <Theme.ListHeader>{trans('session.exertion')}</Theme.ListHeader>
            <Theme.ListHeader>{trans('session.athleteComment')}</Theme.ListHeader>
            {currentTeam?.athletes?.map?.(({ id, avatar, firstName, lastName }) => (
                <Fragment key={key + id}>
                    <Theme.ListAthleteWrapper>
                        <Theme.ListAvatar src={avatar || getAvatarPlaceholder()} alt={firstName} />
                        <Theme.ListAthleteName>{`${firstName} ${lastName}`}</Theme.ListAthleteName>
                    </Theme.ListAthleteWrapper>

                    <MultiSelectController
                        {...{
                            control,
                            name: `status@${id}`,
                            options: arrayToSelectOptions({
                                array: SessionRecordStatus,
                            }),
                            transSuffix: 'session.',
                            menuPlacement: 'top',
                        }}
                        style={{ margin: 'auto' }}
                    />
                    <InputController
                        control={control}
                        name={`scale@${id}`}
                        disabled={watch(`status@${id}`)?.value !== 'present'}
                    />
                    <div>{trans(`session.${getScaleExertion(watch(`scale@${id}`))}`)}</div>
                    <InputController
                        control={control}
                        name={`comment@${id}`}
                        disabled={watch(`status@${id}`)?.value === 'present'}
                    />
                </Fragment>
            ))}
        </Theme.AthletesStateList>
    );
};

export default CurrentTeamRecords;
