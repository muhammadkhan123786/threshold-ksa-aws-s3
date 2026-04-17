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
}

export const useFilterFields = () => {
    const { trans } = useLocales();

    const approvalOptions = useMemo(
        () => [
            { value: 'true', label: trans('approved') },
            { value: 'false', label: trans('notApproved') },
        ],
        [trans],
    );

    const filterFields: FilterField[] = useMemo(
        () => [
            {
                name: 'isApproved',
                label: trans('approve'),
                type: FieldType.Select,
                options: approvalOptions,
            },
        ],
        [trans, approvalOptions],
    );

    return filterFields;
};
