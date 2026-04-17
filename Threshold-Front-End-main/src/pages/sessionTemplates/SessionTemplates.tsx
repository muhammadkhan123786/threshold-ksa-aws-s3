import React, { useEffect, useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { SessionTemplatesTable } from 'components/sessiomTemplatesTable';
import { router } from 'routers';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const SessionTemplates = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const { trans } = useLocales();
    useEffect(() => {
        setColumns([
            {
                key: 'sessionName',
                label: trans('sessionCreation.table.sessionName'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'phases',
                label: trans('sessionCreation.table.phases'),
                width: '20%',
                sortable: true,
            },
            {
                key: 'details',
                label: trans('sessionCreation.table.details'),
                width: '20%',
                sortable: true,
            },
        ]);
    }, [trans]);
    const redirect = () => {
        router.navigate(`add-sesstion-page/templates/template-settings`);
    };
    return (
        <>
            <Theme.NavigationWrapper>
                <Theme.CreateSessionTitle>{trans('title.Templates')}:</Theme.CreateSessionTitle>
                <Theme.NavigationButton onClick={() => redirect()}>
                    <img src="/assets/icons/arrow-colored.svg" alt="Arrow Icon" />
                    {trans('add.template')}
                </Theme.NavigationButton>
            </Theme.NavigationWrapper>
            <SessionTemplatesTable columns={columns || []} data={[]} />
        </>
    );
};
