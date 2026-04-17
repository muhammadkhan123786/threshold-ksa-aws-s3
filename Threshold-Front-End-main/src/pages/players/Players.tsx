import { useLocales } from 'hooks/locales';
import { TemplatesTablePlayer } from '../../components/templatesTablePlayer';
import { useState, useEffect } from 'react';
import { Loader } from 'components';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useFetchPlayersTable } from 'services/hooks/players/useFetchPlayersTable';
import { useRouter } from 'react-router5';
import { Pagination } from 'components/paginationComponant/Pagination';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const Players = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { academy } = useSelector(selectAcademy);
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();

    // Fetch data using the custom hook
    const { data, isLoading, error } = useFetchPlayersTable(sportId, page, limit);

    // Set up columns dynamically based on translations
    useEffect(() => {
        setColumns([
            {
                key: 'player',
                label: trans('player.table.player'),
                width: '20%',
                sortable: true,
            },
            {
                key: 'category',
                label: trans('player.table.category'),
                width: '8%',
                sortable: true,
            },
            {
                key: 'team',
                label: trans('player.table.team'),
                width: '8%',
                sortable: true,
            },
            {
                key: 'position',
                label: trans('player.table.position'),
                width: '8%',
                sortable: false,
            },
            {
                key: 'weight',
                label: trans('player.table.weight'),
                width: '8%',
                sortable: false,
            },
            {
                key: 'contract',
                label: trans('player.table.contract'),
                width: '10%',
                sortable: true,
            },
        ]);
    }, [trans]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const totalPages = Math.ceil((data?.meta?.totalItems || 0) / limit);
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div style={{ width: '100%' }}>
            <TemplatesTablePlayer
                loading={isLoading}
                total={data?.meta?.totalItems || 0}
                columns={columns}
                data={data?.data || []}
            />
            <Pagination
                currentPage={data?.meta?.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
