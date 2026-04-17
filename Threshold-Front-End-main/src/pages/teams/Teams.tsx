import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useState, useEffect } from 'react';
import { Loader } from 'components';
import { useSelector } from 'react-redux';
import { useFetchTeamsTable } from 'services/hooks/teams/useFetchTeamsList';
import { router } from 'routers';
import { TemplatesTableTeams } from '../../components/templatesTableTeams';
import { Pagination } from 'components/paginationComponant/Pagination';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { selectAcademy } from 'store';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const Teams = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);

    const { data, isLoading, error } = useFetchTeamsTable(sportId, page, limit);
    useEffect(() => {
        setColumns([
            {
                key: 'category',
                label: trans('teams.table.category'),
                width: '10%',
                sortable: false,
            },
            {
                key: 'nickname',
                label: trans('teams.table.nickname'),
                width: '5%',
                sortable: true,
            },
            {
                key: 'size',
                label: trans('teams.table.size'),
                width: '1%',
                sortable: true,
            },
            {
                key: 'positions',
                label: trans('teams.table.positions'),
                width: '2%',
                sortable: true,
            },
            {
                key: 'coach',
                label: trans('teams.table.coach'),
                width: '30%',
                sortable: false,
            },
            {
                key: 'sub-coach',
                label: trans('teams.table.sub-coach'),
                width: '10%',
                sortable: true,
            },
            {
                key: 'next-session',
                label: trans('teams.table.next-session'),
                width: '10%',
                sortable: true,
            },
        ]);
    }, [trans]);
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    console.log(data);

    const totalPages = Math.ceil((data?.payload?.meta?.totalItems || 0) / limit);

    if (error) return <div>Error: {error.message}</div>;

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              { label: trans('breadcrumbs.teams'), path: 'teams', params: { sportId } },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    return (
        <div style={{ width: '100%' }}>
            <TemplatesTableTeams
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
