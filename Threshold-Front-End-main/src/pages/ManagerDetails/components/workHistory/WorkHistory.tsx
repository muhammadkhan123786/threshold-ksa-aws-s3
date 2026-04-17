import React, { useState } from 'react';
import * as Theme from './Theme';
import { TemplatesTableManagerDetails } from 'components/templatesTableManagerDetails';
import { time } from 'console';
import { useLocales } from 'hooks/locales';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface WorkHistoryProps {
    columns: Column[];
    coachDetails?: any;
}

export const WorkHistory: React.FC<WorkHistoryProps> = ({ columns, coachDetails }) => {
    const { trans } = useLocales();
    const fakeData = [
        {
            startDate: '2025-01-12',
            endDate: '2025-01-12',
            manageType: 'sport profile manager',
            sportType: 'Football',
            contractStatus: {
                status: 'available',
                till: '20 Aug 2025',
            },
        },
        {
            startDate: '2025-01-12',
            endDate: '2025-01-12',
            manageType: 'sport profile manager',
            sportType: 'Football',
            contractStatus: {
                status: 'expired',
                till: '20 Aug 2025',
            },
        },
        {
            startDate: '2025-01-13',
            endDate: '2025-01-13',
            manageType: 'Technical Director',
            sportType: 'Volleyball',
            contractStatus: {
                status: 'available',
                till: '20 Aug 2025',
            },
        },
        {
            startDate: '2025-01-13',
            endDate: '2025-01-13',
            manageType: 'sport profile manager',
            sportType: 'Football',
            contractStatus: {
                status: 'expired',
                till: '20 Aug 2025',
            },
        },
        {
            startDate: '2025-01-14',
            endDate: '2025-01-14',
            manageType: 'Technical Director',
            sportType: 'Volleyball',
            contractStatus: {
                status: 'expired',
                till: '20 Aug 2025',
            },
        },
    ];

    return (
        <Theme.body>
            <Theme.HeaderWrapper>
                <Theme.SearchWrapper>
                    <Theme.UsersNumberTable>{`${trans('manager.profile.details.all')} (${
                        fakeData.length
                    })`}</Theme.UsersNumberTable>
                </Theme.SearchWrapper>
            </Theme.HeaderWrapper>
            <TemplatesTableManagerDetails columns={columns || []} data={fakeData} />
        </Theme.body>
    );
};
