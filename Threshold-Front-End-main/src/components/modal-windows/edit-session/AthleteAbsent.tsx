// AthleteAbsent.tsx
import React, { Fragment, useId } from 'react';
import { useLocales } from 'hooks/locales';
import { getAvatarPlaceholder } from 'libs/constants';
import * as Theme from './Theme';

interface AthleteAbsentProps {
    id: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    status: string;
    comment: string;
}

const AthleteAbsent: React.FC<AthleteAbsentProps> = ({
    id,
    avatar,
    firstName,
    lastName,
    status,
    comment,
}) => {
    const { trans } = useLocales();
    const key = useId();

    return (
        <Theme.AthletesLabelBody key={id}>
            <Theme.ListHeader>{trans('session.teamList')}</Theme.ListHeader>
            <Theme.ListHeader>{trans('session.status')}</Theme.ListHeader>
            <Theme.ListHeader>{trans('session.athleteComment')}</Theme.ListHeader>
            <Fragment key={key + id}>
                <Theme.ListAthleteWrapper>
                    <Theme.ListAvatar src={avatar || getAvatarPlaceholder()} alt={firstName} />
                    <Theme.ListAthleteName>{`${firstName} ${lastName}`}</Theme.ListAthleteName>
                </Theme.ListAthleteWrapper>
                <Theme.AbsentAthleteLabel className="uppercase">
                    {status || 'NA'}
                </Theme.AbsentAthleteLabel>
                <Theme.AbsentAthleteLabel>{comment || 'NA'}</Theme.AbsentAthleteLabel>
            </Fragment>
        </Theme.AthletesLabelBody>
    );
};

export default AthleteAbsent;
