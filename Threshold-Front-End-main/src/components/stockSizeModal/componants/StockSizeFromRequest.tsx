import React from 'react';
import { Controller } from 'react-hook-form';
import * as Theme from '../Theme';
import { LabelInput } from 'components/labelInput';

interface StockSizeFromRequestProps {
    data: any;
    activeTab: string;
    methods: any;
    mutateAsync: (data: any) => Promise<any>;
    onClose: () => void;
}

export const StockSizeFromRequest: React.FC<StockSizeFromRequestProps> = ({
    data,
    activeTab,
    methods,
    mutateAsync,
    onClose,
}) => {
    const handleSave = async (formData: any) => {
        const finalData: { categoryId: string; size: string; requiredQuantity: number }[] = [];

        const categoryData = data?.find((option: any) => option.id === activeTab);

        if (!categoryData || !activeTab) {
            return;
        }

        categoryData.sizeOptions.forEach((size: string) => {
            const quantity = formData[`${activeTab}-${size}`];

            if (quantity) {
                finalData.push({
                    categoryId: activeTab,
                    size: size,
                    requiredQuantity: Number(quantity),
                });
            }
        });

        if (finalData.length === 0) {
            return;
        }

        try {
            await mutateAsync(finalData[0]);
            methods.reset();
            onClose();
        } catch (err) {
            console.error('Error while sending data:', err);
            methods.reset();
            onClose();
        }
    };

    return (
        <Theme.Body>
            {data
                .filter((option: any) => option.id === activeTab)
                .map((selectedOption: any) => (
                    <div key={selectedOption.id}>
                        {selectedOption.sizeOptions.map((size: string) => (
                            <Theme.InputsWrapper key={`${selectedOption.id}`}>
                                <LabelInput label={`Size: ${size}`} />
                                <Controller
                                    name={`${size}`}
                                    control={methods.control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Theme.Input
                                            {...field}
                                            placeholder={`Enter quantity for ${size}`}
                                        />
                                    )}
                                />
                            </Theme.InputsWrapper>
                        ))}
                    </div>
                ))}
        </Theme.Body>
    );
};
