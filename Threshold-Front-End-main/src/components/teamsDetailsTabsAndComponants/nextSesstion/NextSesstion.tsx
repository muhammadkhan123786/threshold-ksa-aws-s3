import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';

export const NextSesstion: React.FC = () => {
    const { trans } = useLocales();

    return (
        <Theme.Body>
            <Theme.NextSesstionWrapper>
                <Theme.SessionDetails>
                    <Theme.NextSessionTitle>Session Title</Theme.NextSessionTitle>
                    <Theme.SessionTitle>Session Title</Theme.SessionTitle>
                    <Theme.SessionDescription>
                        Examination Match (KPI: 8/10)
                    </Theme.SessionDescription>
                </Theme.SessionDetails>
                <Theme.TimeDetails>
                    <Theme.TimeValue>starts: 2:30 pm</Theme.TimeValue>
                    <Theme.TimeValue>ends: 6:00 pm</Theme.TimeValue>
                </Theme.TimeDetails>
            </Theme.NextSesstionWrapper>
        </Theme.Body>
    );
};
