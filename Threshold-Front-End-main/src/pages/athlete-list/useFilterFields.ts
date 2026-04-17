import { useLocales } from 'hooks/locales';
import { SubscriptionStatus, SportProfileType } from 'libs/enums';
import { useMemo } from 'react';
import { map } from 'lodash';
import { FieldType } from 'components/filterMenu/types';
import { AthleteLevel } from 'libs/enums/athlete';

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

    const subscriptionOptions = useMemo(
        () =>
            map(SubscriptionStatus, (status) => ({
                value: status,
                label: trans(`form.subscriptionManagement.status.${status.toLowerCase()}`),
            })),
        [trans],
    );

    const levelOptions = useMemo(
        () =>
            map(AthleteLevel, (level) => ({
                value: level,
                label: trans(`profileLeveName.${level}`),
            })),
        [trans],
    );

    const filterFields: FilterField[] = useMemo(
        () => [
            {
                name: 'subscriptionStatus',
                label: trans('home.athleteList.subscription'),
                type: FieldType.Boolean,
                options: subscriptionOptions,
            },
            {
                name: 'level',
                label: trans('athlete.level'),
                mappingFilterKey: 'level',
                type: FieldType.Select,
                options: levelOptions, // Add level filter options here
            },
        ],
        [trans, subscriptionOptions, levelOptions],
    );

    return filterFields;
};
