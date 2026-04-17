import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
    addBreadcrumb,
    BreadcrumbItem,
    clearBreadcrumbs,
    setBreadcrumbs,
} from 'store/breadcrumbsSlice';

export const useBreadcrumbs = (
    initialBreadcrumbs?: BreadcrumbItem[],
    trans?: (key: string) => string,
    sportId?: string,
) => {
    const dispatch = useDispatch();
    const breadcrumbs = useSelector((state: any) => state.breadcrumbs.breadcrumbs);

    useEffect(() => {
        if (initialBreadcrumbs?.length) {
            const translatedBreadcrumbs = initialBreadcrumbs.map((item) => ({
                ...item,
                label: trans ? trans(item.label) : item.label,
            }));
            dispatch(setBreadcrumbs(translatedBreadcrumbs));
        }

        return () => {
            if (initialBreadcrumbs && initialBreadcrumbs.length > 0) {
                dispatch(clearBreadcrumbs());
            }
        };
    }, [initialBreadcrumbs?.length, trans, sportId]);

    const setBreadcrumbsFn = (items: BreadcrumbItem[]) => {
        const translatedBreadcrumbs = items.map((item) => ({
            ...item,
            label: trans ? trans(item.label) : item.label,
        }));
        dispatch(setBreadcrumbs(translatedBreadcrumbs));
    };

    const addBreadcrumbFn = (item: BreadcrumbItem) => {
        const translatedItem = {
            ...item,
            label: trans ? trans(item.label) : item.label,
        };
        dispatch(addBreadcrumb(translatedItem));
    };

    const clearBreadcrumbsFn = () => {
        dispatch(clearBreadcrumbs());
    };

    return {
        breadcrumbs,
        setBreadcrumbs: setBreadcrumbsFn,
        addBreadcrumb: addBreadcrumbFn,
        clearBreadcrumbs: clearBreadcrumbsFn,
    };
};
