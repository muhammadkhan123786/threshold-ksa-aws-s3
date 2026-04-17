import React from 'react';
import { useController, Control } from 'react-hook-form';
import * as Theme from './theme';
import _ from 'lodash';

interface SportsSelectionControllerProps {
    name: string;
    control: Control<any>;
    options: { label: string; value: string; icon: string }[];
    selectedOptions?: string[];
}

export const SelectionCardController: React.FC<SportsSelectionControllerProps> = ({
    name,
    control,
    options,
    selectedOptions,
}) => {
    const {
        field: { value, onChange },
    } = useController({
        name,
        control,
    });

    const handleSelect = (selectedOption: { label: string; value: string }) => {
        if (_.isEqual(selectedOption.value, value)) {
            onChange({ label: '', value: '' });
        } else {
            onChange(selectedOption);
        }
    };

    return (
        <Theme.Grid>
            {options.map((option) => (
                <Theme.Card
                    key={option.value}
                    selected={value?.value === option.value}
                    onClick={() => handleSelect({ label: option.label, value: option.value })}
                    disabled={!!selectedOptions?.includes(option.value)}
                >
                    <Theme.Icon src={option.icon} alt={option.label} />
                    <Theme.Label>{option.label}</Theme.Label>
                </Theme.Card>
            ))}
        </Theme.Grid>
    );
};
