import { TFunction } from 'i18next';

interface Props {
    array: any;
    isEnum?: boolean;
    trans?: TFunction<'translation'>;
    transSuffix?: string;
}

export const getFilteredLocationOptions = (selectedLocations: string[], allLocations: string[]) => {
    const filteredLocations = allLocations.filter((location: string) =>
        selectedLocations.includes(String(location)),
    );

    const locationOptions = arrayToSelectOptions({
        array: filteredLocations || [],
    });

    return locationOptions;
};

export const arrayToSelectOptions = ({
    array,
    isEnum = true,
    trans,
    transSuffix,
}: Props): {
    id?: string;
    name?: string;
    value: string;
    label: string;
}[] =>
    (isEnum ? Object.values(array) : array).map((value: any) => ({
        value: value as string,
        label: transSuffix && trans ? trans(`${transSuffix}${value}`) : value,
    }));

export const enumToSelectOption = (defaultValue: string, defaultLabel?: string) => ({
    value: defaultValue,
    label: defaultLabel || defaultValue,
});

export const mappingOptionsToValues = (
    obj: { [key: string]: any },
    whitelist: string[],
): { [key: string]: any } => {
    const result: { [key: string]: any } = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            result[key] = value.map((item: any) => item.value);
        } else if (whitelist.includes(key) && value && typeof value === 'object') {
            result[key] = value.value;
        } else {
            result[key] = value;
        }
    });

    return result;
};

export const selectOptionsToValues = (
    obj: { [key: string]: any },
    whitelist: string[],
): { [key: string]: any } => {
    const result: { [key: string]: any } = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (whitelist.includes(`multi:${key}`)) result[key] = value.map((item: any) => item.value);
        else if (whitelist.includes(key)) result[key] = value.value;
        else result[key] = value;
    });

    return result;
};

export const valueToSelectOption = (
    selectedValue: string,
    enumObj: any,
    trans?: TFunction,
    transPrefix?: string,
    multi?: string[],
) => {
    if (multi) {
        return multi.map((value) => ({
            label: value,
            value: value,
        }));
    } else {
        if (!selectedValue) return null;
        const selectedOption = Object.entries(enumObj).filter(
            ([key, value]) => value === selectedValue,
        )[0][0];

        return {
            label:
                transPrefix && trans
                    ? trans(`${transPrefix}${enumObj[selectedOption]}`)
                    : selectedOption,
            value: enumObj[selectedOption],
        };
    }
};
