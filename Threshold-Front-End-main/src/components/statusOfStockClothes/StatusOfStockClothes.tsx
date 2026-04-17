import React from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useRouter } from 'react-router5';
import { useFetchStockSummarized } from 'services/hooks/clothe/useFetchStockSummarized';
import { Loader } from 'components/loader';

export const StatusOfStockClothes: React.FC = () => {
    const { trans } = useLocales();
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const { data, isLoading, isError } = useFetchStockSummarized(sportId);

    if (isLoading) {
        return <Loader />;
    }

    // if (isError || !data?.data) {
    //     return <p>{trans('statusOfStockClothes.error')}</p>;
    // }
    const calculateTotalStock = (sizes: Array<{ size: string; quantity: number }>) =>
        sizes.reduce((sum, item) => sum + item.quantity, 0);

    const calculateIsOutOfStock = (sizes: Array<{ size: string; quantity: number }>) =>
        calculateTotalStock(sizes) === 0;

    return (
        <Theme.ClothesCardsWrapper>
            {data?.data?.map((category: any) => (
                <Theme.ClothesCard key={category?.categoryId}>
                    <img
                        src={`/assets/icons/${category?.categoryName.toLowerCase()}.svg`}
                        alt={category?.categoryName}
                    />
                    <Theme.ItemName>
                        {trans(`row.category.${category?.categoryName}`)}
                    </Theme.ItemName>
                    <Theme.TotalStock>
                        {calculateTotalStock(category?.sizeBreakdown)}
                    </Theme.TotalStock>
                    <Theme.LineHR />
                    {calculateIsOutOfStock(category?.sizeBreakdown) ? (
                        <Theme.OutOfStockMessage>{trans('Out.of.stock')}</Theme.OutOfStockMessage>
                    ) : (
                        <Theme.Sizes>
                            {category?.sizeBreakdown
                                .filter((sizeItem: any) => sizeItem?.quantity !== 0) // Filter out items with quantity === 0
                                .slice(0, 5) // Show only the first 5 sizes
                                .map((sizeItem: any) => (
                                    <span key={sizeItem?.size}>
                                        <Theme.Number>{sizeItem?.quantity}</Theme.Number>
                                        {sizeItem?.size}
                                    </span>
                                ))}
                            {category?.sizeBreakdown.filter(
                                (sizeItem: any) => sizeItem?.quantity !== 0,
                            ).length > 5 && (
                                <Theme.ShowMore>
                                    {category?.sizeBreakdown.filter(
                                        (sizeItem: any) => sizeItem?.quantity !== 0,
                                    ).length - 5}
                                    more
                                </Theme.ShowMore>
                            )}
                        </Theme.Sizes>
                    )}
                </Theme.ClothesCard>
            ))}
        </Theme.ClothesCardsWrapper>
    );
};
