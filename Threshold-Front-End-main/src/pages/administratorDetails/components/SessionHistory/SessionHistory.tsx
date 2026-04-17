import React, { useState } from 'react';
import * as Theme from './Theme';
import { TemplatesTableCoachesDetails } from 'components/templatesTableCoachesDetails';
import { time } from 'console';
import { useLocales } from 'hooks/locales';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface SessionHistoryProps {
    columns: Column[];
    coachDetails: any;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ columns, coachDetails }) => {
    const { trans } = useLocales();
    const fakeData = [
        {
            date: '2025-01-12',
            time: '01:00 PM - 03:00 PM',
            teamCategory: 'male 12 - 16',
            sessionType: 'Training',
            attendance: '23/24',
            avgPE: '8',
            status: 'soon',
        },
        {
            date: '2025-01-12',
            time: '03:00 PM - 05:00 PM',
            teamCategory: 'female 12 - 16',
            sessionType: 'Game',
            attendance: '24/24',
            avgPE: '9',
            status: 'done',
        },
        {
            date: '2025-01-13',
            time: '01:00 PM - 03:00 PM',
            teamCategory: 'male 12 - 16',
            sessionType: 'Workshop',
            attendance: '20/24',
            avgPE: '7',
            status: 'soon',
        },
        {
            date: '2025-01-13',
            time: '03:00 PM - 05:00 PM',
            teamCategory: 'male 12 - 16',
            sessionType: 'Game',
            attendance: '18/24',
            avgPE: '6',
            status: 'done',
        },
        {
            date: '2025-01-14',
            time: '01:00 PM - 03:00 PM',
            teamCategory: 'female 12 - 16',
            sessionType: 'Training',
            attendance: '22/24',
            avgPE: '8',
            status: 'soon',
        },
    ];

    return (
        <Theme.body>
            <Theme.HeaderWrapper>
                <Theme.SearchWrapper>
                    <Theme.UsersNumberTable>{`All (${fakeData.length})`}</Theme.UsersNumberTable>
                </Theme.SearchWrapper>
                <Theme.ButtonsWrapper>
                    <Theme.CreateRegularSessionButton
                        onClick={() => console.log('Create regular Session button clicked')}
                    >
                        <img
                            src="/assets/icons/colored-edit.svg"
                            alt="edit"
                            height={18}
                            width={18}
                        />
                        {trans('coach.button.createRegularSession')}
                    </Theme.CreateRegularSessionButton>
                    <Theme.CreateSessionButton
                        onClick={() => console.log('Create Session button clicked')}
                    >
                        <img
                            src="/assets/icons/add-icon-white.svg"
                            alt="edit"
                            height={18}
                            width={18}
                        />
                        {trans('coach.button.createSession')}
                    </Theme.CreateSessionButton>
                </Theme.ButtonsWrapper>
            </Theme.HeaderWrapper>
            <TemplatesTableCoachesDetails columns={columns || []} data={fakeData} />
        </Theme.body>
    );
};

export default SessionHistory;
