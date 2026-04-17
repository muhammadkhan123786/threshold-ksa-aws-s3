import { useLocales } from 'hooks/locales';
// API call for the coaches table
import { useFetchCoachesTable } from '../../services/hooks/coach/useFetchCoachesTable';
import { TemplatesTableCoaches } from '../../components/templatesTableCoaches';
import { useState, useEffect } from 'react';
import { router } from 'routers';
import { Loader } from 'components';
import { Pagination } from 'components/paginationComponant/Pagination';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const Coaches = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const {
        params: { sportId, id },
    } = router.getState();
    const { academy } = useSelector(selectAcademy);
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              { label: trans('breadcrumbs.coaches'), path: 'coaches', params: { sportId } },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    // Fetch data using the custom hook
    const { data, isLoading, error } = useFetchCoachesTable(sportId, page, limit);

    // Set up columns dynamically based on translations
    useEffect(() => {
        setColumns([
            {
                key: 'coach',
                label: trans('coach.table.coach'),
                width: '20%',
                sortable: false,
            },
            {
                key: 'experiences',
                label: trans('coach.table.experiences'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'type',
                label: trans('coach.table.type'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'team category',
                label: trans('coach.table.teamCategory'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'contact',
                label: trans('coach.table.contact'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'contract',
                label: trans('coach.table.contract'),
                width: '15%',
                sortable: true,
            },
        ]);
    }, [trans]);

    // Handle page change for pagination
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    // Handle errors
    if (error) return <div>Error: {error?.message}</div>;

    return (
        <div>
            <TemplatesTableCoaches
                loading={isLoading}
                columns={columns}
                data={data?.payload?.items || []}
                total={data?.payload?.meta?.totalItems || 0}
            />
            <Pagination
                currentPage={data?.payload?.meta?.currentPage}
                totalPages={data?.payload?.meta?.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
