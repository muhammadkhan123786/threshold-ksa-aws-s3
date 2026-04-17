import React from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Loader } from 'components/loader/Loader';
import { useRouter } from 'react-router5';
import { useFetchClothesSummarized } from 'services/hooks/clothe/useFetchClothesSummarized';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ClothesReportPDF } from './ClothesReportPDF';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';

interface Size {
    size: string;
    quantity: number;
}

interface ClothesNeededItem {
    category: string;
    sizes: Size[];
}

export const ClothesNeeded: React.FC = () => {
    const { trans } = useLocales();
    const { academy } = useSelector(selectAcademy);
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    const { data, isLoading, isError } = useFetchClothesSummarized(sportId);

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <p>{trans('clothesNeeded.error')}</p>;
    }

    if (!data?.clothesNeeded?.length) {
        return null;
    }

    return (
        <Theme.ClothesNeededWrapper>
            <Theme.HeaderWrapper>
                <p>{trans('clothesNeeded.header.title')}</p>
                <PDFDownloadLink
                    document={
                        <ClothesReportPDF data={data} trans={trans} sport={filteredSport?.sport} />
                    }
                    fileName="clothes-report.pdf"
                >
                    {({ loading }) => (
                        <Theme.DownloadButton disabled={loading}>
                            <img src="/assets/icons/download-icon.svg" alt="Download" />
                            {loading && ' Generating...'}
                        </Theme.DownloadButton>
                    )}
                </PDFDownloadLink>
            </Theme.HeaderWrapper>

            <Theme.ClothesList>
                {data.clothesNeeded.map((item: ClothesNeededItem, index: number) => (
                    <React.Fragment key={index}>
                        <Theme.ClothesItem>
                            <Theme.ItemName>{item.category}:</Theme.ItemName>
                            <Theme.Sizes>
                                {item.sizes.map((size: Size, sizeIndex: number) => (
                                    <div key={sizeIndex}>
                                        <Theme.SpanSummarizedNum>
                                            {size.quantity}
                                        </Theme.SpanSummarizedNum>
                                        <Theme.SpanSummarizedSize>
                                            {size.size}
                                        </Theme.SpanSummarizedSize>
                                    </div>
                                ))}
                            </Theme.Sizes>
                        </Theme.ClothesItem>
                    </React.Fragment>
                ))}
            </Theme.ClothesList>
        </Theme.ClothesNeededWrapper>
    );
};
