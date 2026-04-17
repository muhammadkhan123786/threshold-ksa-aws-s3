// AthletePresent.tsx
import React, { Fragment, useId } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { getScaleExertion } from 'libs/helpers';
import { getAvatarPlaceholder } from 'libs/constants';

import { InputController } from 'components/input';
import * as Theme from './Theme';

interface AthletePresentProps {
    id: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    comment: string;
}

const AthletePresent: React.FC<AthletePresentProps> = ({
    id,
    avatar,
    firstName,
    lastName,
    comment,
}) => {
    const { trans } = useLocales();
    const { control, watch } = useFormContext();
    const key = useId();

    return (
        <>
            <Fragment key={key + id}>
                <Theme.ListAthleteWrapper>
                    <Theme.ListAvatar src={avatar || getAvatarPlaceholder()} alt={firstName} />
                    <Theme.ListAthleteName>{`${firstName} ${lastName}`}</Theme.ListAthleteName>
                </Theme.ListAthleteWrapper>

                <InputController control={control} name={`scale@${id}`} />

                <div>{trans(`session.${getScaleExertion(watch(`scale@${id}`))}`)}</div>

                <InputController control={control} name={`comment@${id}`} defaultValue={comment} />
            </Fragment>
        </>
    );
};

export default AthletePresent;
