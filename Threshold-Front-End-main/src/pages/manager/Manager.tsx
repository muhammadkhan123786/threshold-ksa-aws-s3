import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useFetchManagersTable } from '../../services/hooks/manager/useFetchManagersTable';
import { TemplatesTableManagers } from '../../components/templatesTableManagers';
import { useState, useEffect } from 'react';
import { Loader } from 'components';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { Pagination } from 'components/paginationComponant/Pagination';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { router } from 'routers';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const Manager = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { academy } = useSelector(selectAcademy);
    const { data, isLoading, error } = useFetchManagersTable(academy.id, page, limit);
    const {
        params: { academyId, id },
    } = router.getState();

    useEffect(() => {
        setColumns([
            {
                key: 'manager',
                label: trans('manager.table.manager'),
                width: '8%',
                sortable: false,
            },
            {
                key: 'experiences',
                label: trans('manager.table.experiences'),
                width: '2%',
                sortable: true,
            },
            {
                key: 'position',
                label: trans('manager.table.position'),
                width: '2%',
                sortable: true,
            },
            {
                key: 'contract',
                label: trans('manager.table.contract'),
                width: '5%',
                sortable: true,
            },
        ]);
    }, [trans]);

    const totalPages = Math.ceil((data?.total || 0) / limit);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (error) return <div>Error: {error.message}</div>;
    useBreadcrumbs(
        [
            { label: trans('breadcrumbs.home'), path: 'home' },
            { label: trans('breadcrumbs.manager'), path: 'manager', params: { academyId } },
        ],
        trans,
    );
    return (
        <>
            <TemplatesTableManagers
                loading={isLoading}
                columns={columns}
                data={data?.data || []}
                total={data}
            />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
};
