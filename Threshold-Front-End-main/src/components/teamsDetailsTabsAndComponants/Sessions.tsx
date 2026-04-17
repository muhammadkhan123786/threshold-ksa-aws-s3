import React, { useEffect, useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { SessionsTable } from 'components/templatesTablesTeamDetails/SessionsTable';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}
export const Sessions: React.FC = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const { trans } = useLocales();
    useEffect(() => {
        setColumns([
            {
                key: 'date',
                label: trans('sessions.table.date'),
                width: '20%',
                sortable: false,
            },
            {
                key: 'sessionType',
                label: trans('sessions.table.sessionType'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'mission',
                label: trans('sessions.table.mission'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'attendance',
                label: trans('sessions.table.attendance'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'avg',
                label: trans('sessions.table.avg'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'status',
                label: trans('sessions.table.status'),
                width: '15%',
                sortable: true,
            },
        ]);
    }, [trans]);
    return (
        <Theme.Body>
            <Theme.TableWrapper>
                <SessionsTable columns={columns || []} data={[]} />
            </Theme.TableWrapper>
        </Theme.Body>
    );
};
