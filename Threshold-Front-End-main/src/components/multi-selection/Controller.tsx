import React from 'react';
import { useController, Control } from 'react-hook-form';
import { Controls } from 'components';
import * as InputTheme from './Theme';
import Select, { components, GroupBase } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectComponents } from 'react-select/dist/declarations/src/components';
import { useLocales } from 'hooks/locales';
import makeAnimated from 'react-select/animated';
import { isEqual, map, filter, find, includes } from 'lodash';

type item = {
    value: string;
    label: string;
};
interface SelectControllerProps {
    label?: string;
    name: string;
    control: Control<any>;
    options: Array<item>;
    isMulti?: true | undefined;
    isCreatable?: boolean;
    DropdownIndicatorIcon?: string;
    transSuffix?: string;
    style?: React.CSSProperties;
}

export const MultiSelectController: React.FC<SelectControllerProps> = ({
    label,
    control,
    options,
    name,
    isMulti,
    isCreatable = false,
    DropdownIndicatorIcon,
    transSuffix,
    style,
    ...rest
}) => {
    const { field, fieldState } = useController<any>({
        control,
        name,
    });
    const { trans } = useLocales();

    const DropdownIndicator = (props: any) => (
        <components.DropdownIndicator {...props}>
            <InputTheme.Icon src={DropdownIndicatorIcon} alt="icon" />
        </components.DropdownIndicator>
    );

    const selectComponents: Partial<SelectComponents<any, true, GroupBase<any>>> = {};

    if (DropdownIndicatorIcon) selectComponents['DropdownIndicator'] = DropdownIndicator;

    const animatedComponents = makeAnimated();

    const selectOptions = !options
        ? []
        : map(options, (item) => ({
              value: item.value,
              label: transSuffix ? trans(`${transSuffix}${item.value}`) : item.label,
          }));

    const selectedValue = isMulti
        ? filter(selectOptions, (option) => {
              const isObjectArray = typeof field?.value?.[0] === 'object';

              if (isObjectArray) {
                  return includes(
                      map(field?.value, (val: { value: any }) => val.value),
                      option?.value,
                  );
              } else {
                  return includes(field?.value, option?.value);
              }
          })
        : find(selectOptions, (option) => {
              if (typeof field.value === 'object' && field.value !== null) {
                  return isEqual(option.value, field.value.value);
              }
              return isEqual(option.value, field.value);
          });

    const styles: any = {
        multiValue: (base: any) => ({
            ...base,
            border: '1px solid #c0d330',
            backgroundColor: '#fbffd2',
            borderRadius: '15px',
            padding: '0px 6px',
        }),
        multiValueRemove: (base: any) => ({
            ...base,
            borderRadius: '3px',
        }),
        menu: (base: any) => ({
            ...base,
            zIndex: 100,
            maxHeight: '300px',
            overflowY: 'auto',
        }),
        menuList: (base: any) => ({
            ...base,
            maxHeight: '150px',
            padding: 0,
        }),
    };
    return (
        <InputTheme.Body style={style}>
            <Controls.Label>{label}</Controls.Label>
            {isCreatable ? (
                <CreatableSelect
                    closeMenuOnSelect={isMulti ? false : true}
                    isMulti={isMulti}
                    options={transSuffix ? selectOptions : options || []}
                    components={{ ...selectComponents, ...animatedComponents }}
                    styles={styles}
                    {...field}
                    {...rest}
                />
            ) : (
                <Select
                    closeMenuOnSelect={isMulti ? false : true}
                    isMulti={isMulti}
                    options={transSuffix ? selectOptions : options || []}
                    components={{ ...selectComponents, ...animatedComponents }}
                    menuPlacement="bottom"
                    styles={styles}
                    {...field}
                    value={selectedValue}
                    {...rest}
                    placeholder={trans('form.select')}
                />
            )}
            {fieldState?.error?.message && (
                <Controls.Hint>{fieldState?.error?.message}</Controls.Hint>
            )}
        </InputTheme.Body>
    );
};
