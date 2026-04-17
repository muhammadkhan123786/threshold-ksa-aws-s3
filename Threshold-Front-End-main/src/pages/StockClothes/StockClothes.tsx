import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'react-router5';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useFetchStockClothes } from '../../services/hooks/clothe/useFetchStockClothes';
import { StockClothesTable } from '../../components/stockClothesTable';
import { StatusOfStockClothes } from '../../components/statusOfStockClothes';
import { Loader } from 'components';
import { DivWraper } from 'pages/coachDetails/components/ProfileSection/Theme';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { Pagination } from 'components/paginationComponant/Pagination';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { selectAcademy } from 'store';
import { useSelector } from 'react-redux';

export const StockClothes = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const { academy } = useSelector(selectAcademy);
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    const { data, isLoading, error } = useFetchStockClothes(sportId, page, limit);

    useEffect(() => {
        setColumns([
            trans('stockClothes.table.date'),
            trans('stockClothes.table.cloth_type'),
            trans('stockClothes.table.quantity_and_sizes'),
            trans('stockClothes.table.settings'),
        ]);
    }, [trans]);

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              {
                  label: trans('breadcrumbs.club-clothes'),
                  path: 'club-clothes',
                  params: { sportId },
              },
              {
                  label: trans('breadcrumbs.stock-clothes'),
                  path: 'stock-clothes',
                  params: { sportId },
              },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    return (
        <DivWraper>
            <Theme.ComponentsWrapper>
                <StatusOfStockClothes />
            </Theme.ComponentsWrapper>
            <StockClothesTable
                columns={columns}
                total={data?.meta?.totalItems || 0}
                data={data?.data || []}
            />
            <Pagination
                currentPage={data?.meta?.currentPage}
                totalPages={data?.meta?.totalPages}
                onPageChange={handlePageChange}
            />
        </DivWraper>
    );
};
