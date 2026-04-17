import { useLocales } from 'hooks/locales';
import { useState, useEffect } from 'react';
import { Loader } from 'components';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useRouter } from 'react-router5';
import { TemplatesTableAdministrator } from 'components/templatesTableAdministrator';
import { useFetchAdministratorsTable } from 'services/hooks/administrator/useFetchAdministratorsTable';
import { Pagination } from 'components/paginationComponant/Pagination';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { useClubList } from 'services/hooks/clubProfile/useClubList';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const Administrator = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { academy } = useSelector(selectAcademy);
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    // Fetch data using the custom hook
    const { data, isLoading, error } = useFetchAdministratorsTable(sportId, page, limit);

    // Set up columns dynamically based on translations
    useEffect(() => {
        setColumns([
            {
                key: 'administrator',
                label: trans('administrator.table.administrator'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'experience',
                label: trans('administrator.table.experience'),
                width: '5%',
                sortable: true,
            },
            {
                key: 'type',
                label: trans('administrator.table.type'),
                width: '5%',
                sortable: true,
            },
            {
                key: 'teamCategory',
                label: trans('administrator.table.teamCategory'),
                width: '5%',
                sortable: false,
            },
            {
                key: 'contract',
                label: trans('administrator.table.contract'),
                width: '8%',
                sortable: true,
            },
            // Uncomment if needed
            // {
            //     key: 'contact',
            //     label: trans('administrator.table.contact'),
            //     width: '15%',
            //     sortable: true,
            // },
        ]);
    }, [trans]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const totalPages = Math.ceil((data?.payload?.meta?.totalItems || 0) / limit);
    // Handle errors
    if (error) return <div>Error: {error.message}</div>;

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              {
                  label: trans('breadcrumbs.administrator'),
                  path: 'administrator',
                  params: { sportId },
              },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    return (
        <div style={{ width: '100%' }}>
            <TemplatesTableAdministrator
                loading={isLoading}
                columns={columns}
                data={data?.payload?.items || []}
                total={data?.payload?.meta?.totalItems || 0}
            />
            <Pagination
                currentPage={data?.payload?.meta?.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
