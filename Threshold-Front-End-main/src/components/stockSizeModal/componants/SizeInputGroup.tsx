import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { LabelInput } from 'components/labelInput';
import * as Theme from '../Theme';

interface SizeInputGroupProps {
    selectedOption: any;
    selectedSizeUnit: 'US' | 'EU';
    dataFromTable: any;
    activeTab: string;
    trans: (key: string) => string;
    onSizeChange: (size: string, quantity: number) => void;
}

function formatFieldName(sizeName: string): string {
    return sizeName.replace(/\s+/g, '_').replace(/\./g, 'p');
}

export const SizeInputGroup: React.FC<SizeInputGroupProps> = ({
    selectedOption,
    dataFromTable,
    trans,
    onSizeChange,
}) => {
    const { control } = useFormContext();
    const [data, setData] = useState(selectedOption);
    return (
        <div key={selectedOption.id}>
            {selectedOption.sizeOptions.map(
                (sizeOption: { size: string; requiredQuantity: number }) => {
                    const existingSize = dataFromTable?.sizeOptions?.find(
                        (sizeData: any) => sizeData.size === sizeOption.size,
                    );

                    const fieldName = formatFieldName(sizeOption.size);

                    return (
                        <Theme.InputsWrapper key={`${selectedOption.id}-${sizeOption.size}`}>
                            <LabelInput label={trans(`${sizeOption.size}`)} />
                            <Controller
                                name={fieldName}
                                control={control}
                                defaultValue={existingSize?.quantity}
                                render={({ field }) => (
                                    <Theme.Input
                                        {...field}
                                        type="number"
                                        min={0}
                                        placeholder={trans('quantity')}
                                        onChange={(e) => {
                                            const quantity = Number(e.target.value);
                                            field.onChange(e);
                                            if (!isNaN(quantity)) {
                                                onSizeChange(sizeOption.size, quantity);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Theme.InputsWrapper>
                    );
                },
            )}
        </div>
    );
};
