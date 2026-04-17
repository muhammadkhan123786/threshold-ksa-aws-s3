import React, { useEffect, useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { PlayersTable } from 'components/templatesTablesTeamDetails/PlayersTable';
import { useFetchPlayersTable } from 'services/hooks/players/useFetchPlayersTable';
import { Pagination } from 'components/paginationComponant/Pagination';
import { useRouter } from 'react-router5';
import { useFetchPlayersTableTeamId } from 'services/hooks/players/useFetchPlayersTableTeamId';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}
export const Players: React.FC = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const router = useRouter();
    const {
        params: { sportId, id },
    } = router.getState();
    const [limit, setLimit] = useState(50); // Renamed to setLimit for consistency
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useFetchPlayersTableTeamId(sportId, id);
    const { trans } = useLocales();
    useEffect(() => {
        setColumns([
            {
                key: 'player',
                label: trans('player.table.player'),
                width: '20%',
                sortable: false,
            },
            {
                key: 'level',
                label: trans('player.table.level'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'positions',
                label: trans('player.table.positions'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'weight',
                label: trans('player.table.weight'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'contract',
                label: trans('player.table.contract'),
                width: '15%',
                sortable: true,
            },
        ]);
    }, [trans]);
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const totalPages = Math.ceil((data?.meta?.total || 0) / limit);
    return (
        <Theme.Body>
            <PlayersTable
                loading={isLoading}
                total={data?.meta?.total || 0}
                columns={columns}
                data={data?.data || []}
            />
            <Pagination
                currentPage={data?.meta?.page}
                totalPages={data?.meta?.totalPages}
                onPageChange={handlePageChange}
            />
        </Theme.Body>
    );
};
