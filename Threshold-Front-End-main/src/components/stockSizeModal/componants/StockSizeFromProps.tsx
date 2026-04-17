import React from 'react';
import { Controller } from 'react-hook-form';
import * as Theme from '../Theme';
import { LabelInput } from 'components/labelInput';

interface StockSizeFromPropsProps {
    dataFromTable: any;
    methods: any;
}

export const StockSizeFromProps: React.FC<StockSizeFromPropsProps> = ({
    dataFromTable,
    methods,
}) => {
    return (
        <Theme.Body>
            {dataFromTable?.category?.sizeOptions?.map((size: string) => (
                <Theme.InputsWrapper key={size}>
                    <LabelInput label={`Size: ${size}`} />
                    <Controller
                        name={`${size}`}
                        control={methods.control}
                        defaultValue={
                            dataFromTable?.sizeOptions?.find(
                                (sizeData: any) => sizeData.size === size,
                            )?.quantity || ''
                        }
                        render={({ field }) => (
                            <Theme.Input {...field} placeholder={`Enter quantity for ${size}`} />
                        )}
                    />
                </Theme.InputsWrapper>
            ))}
        </Theme.Body>
    );
};
