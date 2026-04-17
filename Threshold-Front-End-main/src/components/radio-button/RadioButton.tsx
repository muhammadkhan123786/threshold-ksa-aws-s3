import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import styled from 'styled-components';

interface RadioButtonScaleProps extends UseControllerProps {
    options: { value: string; label: string }[];
}

export const RadioButton: React.FC<RadioButtonScaleProps> = ({ control, name, options }) => {
    const {
        field: { onChange, value },
    } = useController({ name, control });
    const RadioButtonWrapper = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;

        @media (max-width: 768px) {
            flex-direction: row;
            justify-content: center;
            gap: 10px;
        }
    `;

    const RadioButtonOption = styled.div`
        display: flex;
        flex-direction: column;
        align-items: start;

        label {
            margin-bottom: 8px;
            color: black;
        }

        input[type='radio'] {
            height: 24px;
            width: 24px;
            text-color: gray-400;
            border-color: gray-300;
            border-radius: 50%;
            focus-ring: none;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            align-items: center;
            flex-direction: row;
            justify-content: flex-start !important;
            gap: 20px;
            label {
                margin-bottom: 4px;
            }

            input[type='radio'] {
                height: 20px;
                width: 20px;
            }
        }
    `;

    return (
        <RadioButtonWrapper>
            {options.map((option) => (
                <RadioButtonOption key={option.value}>
                    <label htmlFor={`${name}-${option.value}`} className="mb-2 text-black">
                        {option.label}
                    </label>
                    <input
                        type="radio"
                        id={`${name}-${option.value}`}
                        name={name}
                        value={option.value}
                        checked={value?.toString?.() === option?.value?.toString?.()}
                        onChange={(e) => onChange(e.target.value)}
                        className="form-radio"
                    />
                </RadioButtonOption>
            ))}
        </RadioButtonWrapper>
    );
};
