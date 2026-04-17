import React from 'react';
import { useLocales } from 'hooks/locales';
import { PlayingSessionStatus } from 'libs/enums';
import * as Theme from './Theme';
interface SessionCardProps {
    status: PlayingSessionStatus;
    type: string;
    onClick?: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ status, type, onClick }) => {
    const { trans } = useLocales();

    if (!type) return null;

    return (
        <Theme.SessionCardContainer {...{ onClick, status }}>
            <Theme.StatusText status={status}>{trans(`session.${type}`)}</Theme.StatusText>
            <Theme.DetailsContainer>
                <Theme.Dot status={status} />
                <Theme.DetailsText status={status}>{trans(`session.${status}`)}</Theme.DetailsText>
            </Theme.DetailsContainer>
        </Theme.SessionCardContainer>
    );
};

export default SessionCard;
