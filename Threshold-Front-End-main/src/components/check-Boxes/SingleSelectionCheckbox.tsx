import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

interface SingleSelectionCheckboxProps extends UseControllerProps {
    options: { value: string; label: string; disabled?: boolean }[];
    control: any;
}

export const SingleSelectionCheckbox: React.FC<SingleSelectionCheckboxProps> = ({
    control,
    name,
    options,
}) => {
    const {
        field: { onChange, value },
    } = useController({ name, control });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        onChange(selectedValue);
    };

    return (
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 select-none">
            {options.map(({ value: optionValue, label, disabled }) => (
                <label
                    key={optionValue}
                    className={`inline-flex items-center space-x-2 cursor-pointer ${
                        disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <input
                        type="checkbox"
                        name={name}
                        value={optionValue}
                        checked={value?.toString?.() === optionValue?.toString?.()}
                        onChange={handleChange}
                        disabled={disabled}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-[#000] ps-3 capitalize">{label}</span>
                </label>
            ))}
        </div>
    );
};

export default SingleSelectionCheckbox;
