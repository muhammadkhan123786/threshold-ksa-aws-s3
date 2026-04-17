import { FieldType } from 'components/filterMenu/types';
import { every, filter, find, get, isEmpty, map, toNumber, toString } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';

interface Props {
    initialData: { [key: string]: any }[];
    searchFields?: string[];
    filters?: { [key: string]: any };
    filterFields?: { [key: string]: any }[];
    radio?: {
        radioField: string;
        radioOptions: string[];
        isMultiOption?: boolean;
    };
}

const isFieldIncluded = (item: any, field: string, searchTerm: string) => {
    const fieldValue = get(item, field, '').toString().toLowerCase();
    return searchTerm === '' ? true : fieldValue.indexOf(searchTerm.toLowerCase()) !== -1;
};

const isOptionIncluded = (option: string, currentOption: string, isMultiOption: boolean = false) =>
    currentOption === 'all' ? true : currentOption === option;

export function useDataFilter<DataType>({
    initialData,
    searchFields,
    filters,
    filterFields,
    radio,
}: Props) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [data, setData] = useState<{ [key: string]: any }[]>(initialData);
    const [radioOption, setRadioOption] = useState('all');

    const handlerSearchTermChange = (event: ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(event.target.value);

    const handleSwitchOption = (option: string) => setRadioOption(option);

    const applyFilters = (newFilters: { [key: string]: any }, isClear: boolean = false) => {
        if (isClear) {
            setData(initialData || []);
            return;
        }

        setData(
            filter(initialData || [], (item: any) => {
                const isFieldsPass =
                    !searchFields ||
                    searchFields.some((field) => isFieldIncluded(item, field, searchTerm));
                const isOptionPass =
                    !radio ||
                    isOptionIncluded(
                        get(item, radio.radioField),
                        radioOption,
                        radio.isMultiOption || false,
                    );

                const isFilterPass = every(newFilters, (value, key) => {
                    if (isEmpty(value) || (Array.isArray(value) && isEmpty(value))) {
                        return true;
                    }
                    const filterField = find(filterFields || [], { name: key });
                    let itemValue = get(item, filterField?.mappingFilterKey || key);

                    let filterValues: any;

                    switch (filterField?.type) {
                        case FieldType.Select: {
                            filterValues = Array.isArray(value)
                                ? map(value, (filter) => get(filter, 'value', get(filter, 'label')))
                                : get(value, 'value', get(value, 'label'));

                            break;
                        }
                        case FieldType.NumberRange: {
                            const greaterThanValue = toNumber(
                                get(value, 'greaterThan', '-Infinity'),
                            );
                            const lessThanValue = toNumber(get(value, 'lessThan', 'Infinity'));

                            if (Array.isArray(itemValue)) itemValue = itemValue?.length;

                            return (
                                !isNaN(greaterThanValue) &&
                                !isNaN(lessThanValue) &&
                                itemValue >= greaterThanValue &&
                                itemValue <= lessThanValue
                            );
                        }
                        default: {
                            filterValues = value;
                            break;
                        }
                    }

                    return Array.isArray(filterValues)
                        ? filterValues.includes(itemValue)
                        : toString(itemValue) === toString(filterValues);
                });

                return isFieldsPass && isOptionPass && isFilterPass;
            }),
        );
    };

    useEffect(() => {
        setData(
            (initialData || []).filter((item) => {
                const isFieldsPass: boolean = searchFields
                    ? searchFields.reduce(
                          (acc, curr) => acc || isFieldIncluded(item, curr, searchTerm),
                          false,
                      )
                    : true;

                const isOptionPass = radio
                    ? isOptionIncluded(
                          get(item, radio.radioField),
                          radioOption,
                          radio.isMultiOption || false,
                      )
                    : true;

                const isFilterPass = filters
                    ? Object.keys(filters).every((key) => {
                          if (!filters[key]) return true; // If filter is empty, pass the item
                          return get(item, key) === filters[key];
                      })
                    : true;

                return isFieldsPass && isOptionPass && isFilterPass;
            }),
        );
    }, [radioOption, searchTerm, filters, initialData]);

    return {
        data: data as DataType[],
        radioOption,
        searchTerm,
        applyFilters,
        handlerSearchTermChange,
        handleSwitchOption,
    };
}
