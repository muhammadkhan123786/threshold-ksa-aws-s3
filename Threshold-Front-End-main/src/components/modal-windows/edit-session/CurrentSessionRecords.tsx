import React from 'react';
import { useSelector } from 'react-redux';
import * as Theme from './Theme';
import { selectAcademy } from 'store';
import { SessionRecordStatus } from 'libs/enums';
import AthleteAbsent from './AthleteAbsent';
import AthletePresent from './AthletePresent';
import { useLocales } from 'hooks/locales';

const CurrentSessionRecords: React.FC = () => {
    const { currentSessionRecords } = useSelector(selectAcademy);
    const { trans } = useLocales();

    // Filter present and absent athletes
    const presentAthletes = currentSessionRecords?.filter(
        (record) => record.status === SessionRecordStatus.PRESENT,
    );
    // const absentAthletes = currentSessionRecords?.filter(
    //     (record) => record.status !== SessionRecordStatus.PRESENT,
    // );

    return (
        <Theme.AthletesList>
            {/* Render headers */}
            {presentAthletes?.length ? (
                <>
                    <Theme.ListHeader>{trans('session.teamList')}</Theme.ListHeader>
                    <Theme.ListHeader>{trans('session.scale')}</Theme.ListHeader>
                    <Theme.ListHeader>{trans('session.exertion')}</Theme.ListHeader>
                    <Theme.ListHeader>{trans('session.athleteComment')}</Theme.ListHeader>
                </>
            ) : null}

            {/* Render present athletes */}
            {presentAthletes?.map(
                ({ id, athlete: { avatar, firstName, lastName }, comment }: any) => (
                    <AthletePresent
                        key={id}
                        id={id}
                        avatar={avatar}
                        firstName={firstName}
                        lastName={lastName}
                        comment={comment}
                    />
                ),
            )}

            {/* Render absent athletes */}
            {/* {absentAthletes?.map(
                ({ id, athlete: { avatar, firstName, lastName }, comment }: any) => (
                    <AthleteAbsent
                        key={id}
                        id={id}
                        avatar={avatar}
                        firstName={firstName}
                        lastName={lastName}
                        status={status}
                        comment={comment}
                    />
                ),
            )} */}
        </Theme.AthletesList>
    );
};

export default CurrentSessionRecords;
