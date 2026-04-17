import React, { useState, useEffect } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useFetchStockClothesStatus } from 'services/hooks/clothe/useFetchStockClothesStatus';
import { useRouter } from 'react-router5';
import { Loader } from 'components/loader';
import { TemplatesTableClothes } from '../../components/templatesTableClothes';
import { ClothesNeeded } from '../../components/clothesNeeded/ClothesNeeded';
import { StatusOfClothes } from '../../components/statusOfClthes';
import { SharedButton } from 'components/sharedButton';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { Pagination } from 'components/paginationComponant/Pagination';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';

export const Clothes = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<any>([]);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    const { data, isLoading, isError } = useFetchStockClothesStatus(sportId, page, limit);

    useEffect(() => {
        setColumns([
            {
                key: 'player',
                label: trans('clothes.table.player'),
                width: '20%',
                sortable: false,
            },
            {
                key: 'category',
                label: trans('clothes.table.category'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'joined_date',
                label: trans('clothes.table.joined_date'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'clothes',
                label: trans('clothes.table.clothes'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'actions',
                label: trans(''),
                width: '15%',
                sortable: false,
            },
        ]);
    }, [trans]);

    const handleRedirect = () => {
        router.navigate(`stock-clothes`, { sportId });
    };

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              {
                  label: trans('breadcrumbs.club-clothes'),
                  path: 'club-clothes',
                  params: { sportId },
              },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const totalPages = Math.ceil((data?.result?.meta?.totalItems || 0) / limit);
    return (
        <>
            <Theme.ContainerButtonsWrapper>
                <SharedButton onClick={handleRedirect}>{trans('view.stock')}</SharedButton>
            </Theme.ContainerButtonsWrapper>
            <Theme.ComponentsWrapper>
                <ClothesNeeded />
                <Theme.DivWrapperClothes>
                    <StatusOfClothes />
                </Theme.DivWrapperClothes>
            </Theme.ComponentsWrapper>
            <TemplatesTableClothes
                total={data?.result?.meta?.totalItems || 0}
                columns={columns}
                data={data?.result || []}
            />
            <Pagination
                currentPage={data?.result?.meta?.currentPage}
                totalPages={data?.result?.meta?.totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
};
