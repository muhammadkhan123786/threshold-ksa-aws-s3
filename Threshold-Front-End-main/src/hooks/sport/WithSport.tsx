import React from 'react';
import { SportProfileType, PlayingSessionType, PlayingSessionStatus } from 'libs/enums';
import { indexOf } from 'lodash';

interface WithSportProps {
    allowSports?: SportProfileType[];
    blockSports?: SportProfileType[];
    allowSessionTypes?: PlayingSessionType[];
    blockSessionTypes?: PlayingSessionType[];
    sportType?: SportProfileType;
    sessionType?: PlayingSessionType;
    sessionStatus?: PlayingSessionStatus;
    beforeStatus?: PlayingSessionStatus;
    afterStatus?: PlayingSessionStatus;
    elseIf?: React.ReactNode;
    children: React.ReactNode;
}

const statusOrder = [
    PlayingSessionStatus.NOT_STARTED,
    PlayingSessionStatus.STARTED,
    PlayingSessionStatus.PREPARATION_COMPLETE,
    PlayingSessionStatus.DONE,
];

export const WithSport: React.FC<WithSportProps> = ({
    allowSports,
    blockSports,
    allowSessionTypes,
    blockSessionTypes,
    sportType,
    sessionType,
    sessionStatus,
    beforeStatus,
    afterStatus,
    elseIf = null,
    children,
}) => {
    const isBlocked =
        blockSports?.includes(sportType!) ||
        false ||
        blockSessionTypes?.includes(sessionType!) ||
        false;

    const isAllowed =
        allowSports?.includes(sportType!) ||
        false ||
        allowSessionTypes?.includes(sessionType!) ||
        false;

    const currentIndex = indexOf(statusOrder, sessionStatus);
    const beforeIndex = indexOf(statusOrder, beforeStatus);
    const afterIndex = indexOf(statusOrder, afterStatus);

    const isBeforeStatus = beforeIndex !== -1 && currentIndex < beforeIndex;
    const isAfterStatus = afterIndex !== -1 && currentIndex > afterIndex;

    if (isBlocked) return null;

    if (
        (isAllowed || (!allowSports && !allowSessionTypes)) &&
        (!beforeStatus || isBeforeStatus) &&
        (!afterStatus || isAfterStatus)
    ) {
        return <>{children}</>;
    }

    return <>{elseIf}</>;
};
