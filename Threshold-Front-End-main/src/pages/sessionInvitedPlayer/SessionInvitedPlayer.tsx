import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useFetchManagersTable } from '../../services/hooks/manager/useFetchManagersTable';
import { TemplatesTableManagers } from '../../components/templatesTableManagers';
import { useState, useEffect } from 'react';
import { Loader } from 'components';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { TemplatesTableInvitedPlayers } from 'components/templatesTableInvitedPlayers';
interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}
export const SessionInvitedPlayer = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const { academy } = useSelector(selectAcademy);
    const { data, isLoading, error } = useFetchManagersTable(academy.id, page, limit);

    useEffect(() => {
        setColumns([
            {
                key: 'player',
                label: trans('invitedPlayer.table.player'),
                width: '20%',
                sortable: false,
            },
            {
                key: 'positions',
                label: trans('invitedPlayer.table.positions'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'attendance',
                label: trans('invitedPlayer.table.attendance'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'comment',
                label: trans('invitedPlayer.table.comment'),
                width: '15%',
                sortable: false,
            },
        ]);
    }, [trans]);

    if (error) return <div>Error: {error.message}</div>;
    return (
        <>{isLoading ? <Loader /> : <TemplatesTableInvitedPlayers columns={columns} data={[]} />}</>
    );
};
