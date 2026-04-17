import { useLocales } from 'hooks/locales';
import { SubscriptionStatus, SportProfileType } from 'libs/enums';
import { useMemo } from 'react';
import { map } from 'lodash';
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

    const sportProfileOptions = useMemo(
        () =>
            map(SportProfileType, (sport) => ({
                value: sport,
                label: trans(`sport.${sport.toLowerCase()}`),
            })),
        [trans],
    );

    const filterFields: FilterField[] = useMemo(
        () => [
            {
                name: 'experience',
                label: trans('home.coachesList.experience'),
                mappingFilterKey: 'experience',
                type: FieldType.NumberRange,
                range: {
                    greaterThanPlaceholder: trans('g.numberGreaterThan'),
                    lessThanPlaceholder: trans('g.numberLessThan'),
                },
            },
            {
                name: 'teams',
                label: trans('home.coachesList.teams'),
                mappingFilterKey: 'teams',
                type: FieldType.NumberRange,
                range: {
                    greaterThanPlaceholder: trans('g.numberGreaterThan'),
                    lessThanPlaceholder: trans('g.numberLessThan'),
                },
            },
            {
                name: 'sport',
                mappingFilterKey: 'sport',
                label: trans('home.coachesList.sport'),
                type: FieldType.Select,
                options: sportProfileOptions,
            },
        ],
        [trans, sportProfileOptions],
    );

    return filterFields;
};
