import React from 'react';
import Select, { components, GroupBase } from 'react-select';
import { SelectComponents } from 'react-select/dist/declarations/src/components';
import { useLocales } from 'hooks/locales';
import * as InputTheme from './Theme';
import makeAnimated from 'react-select/animated';
import { Controls } from 'components';

type Item = {
    value: string;
    label: string;
};

interface SingleSelectProps {
    label?: string;
    name: string;
    options: Array<Item>;
    isMulti?: false;
    DropdownIndicatorIcon?: string;
    transSuffix?: string;
    style?: React.CSSProperties;
    onChange?: (selected: Item | null) => void;
}

export const SingleSelect: React.FC<SingleSelectProps> = ({
    label,
    options,
    isMulti = false,
    DropdownIndicatorIcon,
    transSuffix,
    style,
    onChange,
    ...rest
}) => {
    const { trans } = useLocales();

    const DropdownIndicator = (props: any) => (
        <components.DropdownIndicator {...props}>
            <InputTheme.Icon src={DropdownIndicatorIcon} alt="icon" />
        </components.DropdownIndicator>
    );

    const selectComponents: Partial<SelectComponents<any, false, GroupBase<any>>> = {};

    if (DropdownIndicatorIcon) selectComponents['DropdownIndicator'] = DropdownIndicator;

    const animatedComponents = makeAnimated();

    const selectOptions = options.map((item) => ({
        value: item.value,
        label: transSuffix ? trans(`${transSuffix}${item.value}`) : item.value,
    }));

    const styles: any = {
        singleValue: (base: any) => ({
            ...base,
            color: '#333',
        }),
        placeholder: (base: any) => ({
            ...base,
            color: '#999',
        }),
    };

    return (
        <InputTheme.Body style={style}>
            {label && <Controls.Label>{label}</Controls.Label>}
            <Select
                closeMenuOnSelect={true}
                isMulti={isMulti}
                options={selectOptions}
                components={{ ...selectComponents, ...animatedComponents }}
                styles={styles}
                onChange={onChange}
                placeholder={trans('form.select')}
                {...rest}
            />
        </InputTheme.Body>
    );
};
