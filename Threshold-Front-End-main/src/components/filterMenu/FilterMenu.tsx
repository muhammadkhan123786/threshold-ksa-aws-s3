import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLayer, Arrow } from 'react-laag';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Theme from './theme';
import { useLocales } from 'hooks/locales';
import { FilterItem } from './FilterItem';
import { FilterMenuProps } from './types';
import { setFilter, clearAllFilters } from 'store/filterSlice';
import { isEmpty, omit } from 'lodash';

interface ExtendedFilterMenuProps extends FilterMenuProps {
    filterName: string;
}

const FilterMenuComponent: React.FC<ExtendedFilterMenuProps> = ({
    fields,
    onApplyFilters,
    length = 0,
    filterName,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const savedFilters = useSelector((state: any) => state.filters[filterName] || {});

    const [isOpen, setIsOpen] = useState(false);
    const { triggerProps, layerProps, renderLayer, arrowProps, layerSide } = useLayer({
        isOpen,
        onOutsideClick: () => setIsOpen(false),
        onDisappear: () => setIsOpen(false),
        placement: 'bottom-end',
        auto: true,
    });

    const { control, handleSubmit, reset, setValue } = useForm();

    const memoizedSavedFilters = useMemo(() => savedFilters, [savedFilters]);
    const memoizedOnApplyFilters = useCallback(onApplyFilters, [onApplyFilters]);

    useEffect(() => {
        if (!length) return;

        Object.keys(memoizedSavedFilters).forEach((key) => {
            setValue(key, memoizedSavedFilters[key]);
        });

        const timer = setTimeout(() => {
            memoizedOnApplyFilters(omit(memoizedSavedFilters, ['_persist']));
        }, 0);

        return () => clearTimeout(timer);
    }, [length]);

    const handleFormSubmit = useCallback(
        (data: { [key: string]: any }) => {
            Object.keys(data).forEach((key) => {
                dispatch(setFilter({ filterName, key, value: data[key] }));
            });

            memoizedOnApplyFilters(omit(data, ['_persist']));
            setIsOpen(false);
        },
        [dispatch, filterName, memoizedOnApplyFilters],
    );

    const handleClearFilters = useCallback(() => {
        reset({});
        dispatch(clearAllFilters({ filterName }));
        memoizedOnApplyFilters({}, true);
        setIsOpen(false);
    }, [dispatch, filterName, memoizedOnApplyFilters, reset]);

    const hasActiveFilters = useMemo(() => !isEmpty(memoizedSavedFilters), [memoizedSavedFilters]);

    const handleToggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const enhancedArrowProps = {
        ...arrowProps,
        onPointerEnterCapture: () => {},
        onPointerLeaveCapture: () => {},
    };

    return (
        <Theme.Body>
            <Theme.FilterButton
                {...triggerProps}
                onClick={handleToggleMenu}
                $hasActiveFilters={hasActiveFilters}
            >
                <Theme.FilterIcon src="/assets/icons/filter-icon.svg" alt="filter" />
                {trans('home.athleteList.filter')}
            </Theme.FilterButton>
            {renderLayer(
                isOpen && (
                    <Theme.FilterMenuContainer {...layerProps}>
                        <FilterItem {...{ fields, control }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Theme.ClearButton onClick={handleClearFilters}>
                                {trans('g.clear')}
                            </Theme.ClearButton>
                            <Theme.ApplyButton onClick={handleSubmit(handleFormSubmit)}>
                                {trans('g.apply')}
                            </Theme.ApplyButton>
                        </div>
                        <Arrow {...enhancedArrowProps} layerSide={layerSide} />
                    </Theme.FilterMenuContainer>
                ),
            )}
        </Theme.Body>
    );
};

export const FilterMenu = React.memo(FilterMenuComponent);
