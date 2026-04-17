import React from 'react';
import { MultiSelectController } from 'components/multi-selection';
import { CheckBoxes } from 'components';
import { InputController } from 'components/input';
import { arrayToSelectOptions } from 'libs/helpers';
import { Control } from 'react-hook-form';
import * as Theme from './theme';
import { FieldType, FilterItemProps } from './types';

export const FilterItem: React.FC<FilterItemProps> = ({ fields, control }) => {
    return (
        <>
            {fields.map((field) => (
                <div key={field.name}>
                    <Theme.FilterLabel>{field.label}</Theme.FilterLabel>
                    {field.type === FieldType.Select ? (
                        <MultiSelectController
                            control={control}
                            name={field.name}
                            options={
                                field.options || arrayToSelectOptions({ array: field.options })
                            }
                            transSuffix={field.transSuffix}
                        />
                    ) : field.type === FieldType.Boolean ? (
                        <CheckBoxes
                            control={control}
                            name={field.name}
                            options={field.options || []}
                        />
                    ) : field.type === FieldType.Text ? (
                        <InputController
                            type="text"
                            control={control}
                            name={field.name}
                            placeholder={field.placeholder || ''}
                        />
                    ) : field.type === FieldType.NumberRange ? (
                        <Theme.RangeBody>
                            <InputController
                                type="number"
                                control={control}
                                name={`${field.name}.greaterThan`}
                                placeholder={field.range?.greaterThanPlaceholder || ''}
                                min={0}
                            />
                            <InputController
                                type="number"
                                control={control}
                                name={`${field.name}.lessThan`}
                                placeholder={field.range?.lessThanPlaceholder || ''}
                                min={0}
                            />
                        </Theme.RangeBody>
                    ) : null}
                </div>
            ))}
        </>
    );
};
