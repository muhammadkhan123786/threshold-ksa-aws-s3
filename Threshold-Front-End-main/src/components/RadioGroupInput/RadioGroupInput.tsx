import { UseControllerProps, useController } from 'react-hook-form';
import * as Theme from './Theme';
import React from 'react';
import { Hint } from 'components/controls/hint/Hint';

interface RadioGroupProps extends UseControllerProps {
    label: string;
    options: { value: string; label: string }[];
}

export const RadioGroupInput: React.FC<RadioGroupProps> = ({ label, name, control, options }) => {
    const {
        field: { onChange, value },
        fieldState,
    } = useController({ name, control });

    const error = control ? control.getFieldState(name).error : null;

    return (
        <Theme.Wrapper>
            <Theme.Label>{label}</Theme.Label>
            <Theme.OptionsContainer>
                {options.map((option) => (
                    <Theme.Option key={option.value}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value?.toString?.() === option?.value?.toString?.()}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        {option.label}
                    </Theme.Option>
                ))}
            </Theme.OptionsContainer>
            {error && <Hint error={error.message} />}
        </Theme.Wrapper>
    );
};
