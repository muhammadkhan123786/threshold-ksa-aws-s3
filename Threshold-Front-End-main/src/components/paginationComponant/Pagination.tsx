import React from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const { isRTL } = useLocales();
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Theme.NumberWrapper key={i}>
                    <Theme.PageButton
                        className={`pagination-button ${i === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(i)}
                        isActive={i === currentPage}
                    >
                        {i}
                    </Theme.PageButton>
                </Theme.NumberWrapper>,
            );
        }
        if (pages.length === 0) {
            return <Theme.PageButton isActive={true}>1</Theme.PageButton>;
        } else {
            return pages;
        }
    };

    return (
        <Theme.PaginationContainer>
            <Theme.PaginationButtonsWrapper>
                <Theme.ButtonPagination
                    className="pagination-button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    {isRTL ? (
                        <img
                            src="/assets/icons/smallArrow.svg"
                            height={30}
                            width={30}
                            alt="Previous"
                        />
                    ) : (
                        <img src="/assets/icons/arrowr.svg" height={30} width={30} alt="Previous" />
                    )}
                </Theme.ButtonPagination>
            </Theme.PaginationButtonsWrapper>
            <Theme.PaginationButtonsWrapper>
                <Theme.NumberWrapper>{renderPageNumbers()}</Theme.NumberWrapper>
            </Theme.PaginationButtonsWrapper>
            <Theme.PaginationButtonsWrapper>
                <Theme.ButtonPagination
                    className="pagination-button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    {isRTL ? (
                        <img src="/assets/icons/arrowr.svg" height={30} width={30} alt="Next" />
                    ) : (
                        <img src="/assets/icons/smallArrow.svg" height={30} width={30} alt="Next" />
                    )}
                </Theme.ButtonPagination>
            </Theme.PaginationButtonsWrapper>
        </Theme.PaginationContainer>
    );
};
