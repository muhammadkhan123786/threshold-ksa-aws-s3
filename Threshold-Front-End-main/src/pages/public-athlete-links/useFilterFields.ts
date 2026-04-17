import { useLocales } from 'hooks/locales';
import { useMemo } from 'react';
import { FieldType } from 'components/filterMenu/types';

interface FilterField {
    name: string;
    label: string;
    type: FieldType;
    options?: { value: string; label: string }[];
    placeholder?: string;
    transSuffix?: string;
    range?: {
        greaterThanPlaceholder: string;
        lessThanPlaceholder: string;
    };
    mappingFilterKey?: string;
}

export const useFilterFields = () => {
    const { trans } = useLocales();

    const statusOptions = useMemo(
        () => [
            { value: 'true', label: trans('form.subscriptionManagement.status.active') },
            { value: 'false', label: trans('form.subscriptionManagement.status.inactive') },
        ],
        [trans],
    );

    const filterFields: FilterField[] = useMemo(
        () => [
            {
                name: 'isActive',
                label: trans('links.status'),
                type: FieldType.Select,
                options: statusOptions,
            },
            {
                name: 'limitNumber',
                label: trans('links.limitNumber'),
                type: FieldType.NumberRange,
                range: {
                    greaterThanPlaceholder: trans('g.numberGreaterThan'),
                    lessThanPlaceholder: trans('g.numberLessThan'),
                },
            },
        ],
        [trans, statusOptions],
    );

    return filterFields;
};
