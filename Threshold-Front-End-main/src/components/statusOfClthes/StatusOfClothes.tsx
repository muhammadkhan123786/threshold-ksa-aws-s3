import React, { useMemo } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Loader } from 'components/loader/Loader';
import { useRouter } from 'react-router5';
import { useFetchClothesSummarized } from 'services/hooks/clothe/useFetchClothesSummarized';

export const StatusOfClothes = () => {
    const { trans, isRTL } = useLocales();
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const { data, isLoading, isError } = useFetchClothesSummarized(sportId);

    if (isLoading) {
        return <Loader />;
    }

    if (isError || !data) {
        return <p>{trans('clothesNeeded.error')}</p>;
    }
    return (
        <Theme.StatusContainer>
            <Theme.IconContainer isRTL={isRTL}>
                <Theme.IconImage src="/assets/icons/all-is-good.svg" alt="all-is-good" />
                <Theme.Text>{trans('statusClothes.status.allIsGood')}</Theme.Text>
                <Theme.NumberText status="allIsGood">{data?.summary?.allIsGood}</Theme.NumberText>
            </Theme.IconContainer>

            <Theme.IconContainer isRTL={isRTL}>
                <Theme.IconImage src="/assets/icons/not-delivered.svg" alt="not-delivered" />
                <Theme.Text>{trans('statusClothes.status.notDelivered')}</Theme.Text>
                <Theme.NumberText status="notDelivered">
                    {data?.summary?.notDelivered}
                </Theme.NumberText>
            </Theme.IconContainer>

            <Theme.IconContainer isRTL={isRTL}>
                <Theme.IconImage src="/assets/icons/needs-cloth.svg" alt="needs-cloth" />
                <Theme.Text>{trans('statusClothes.status.needsCloth')}</Theme.Text>
                <Theme.NumberText status="needsCloth">
                    {data?.summary?.needsClothes}
                </Theme.NumberText>
            </Theme.IconContainer>
        </Theme.StatusContainer>
    );
};
