import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

interface CheckBoxesProps extends UseControllerProps {
    options: { value: string; label: string }[];
    singleSelection?: boolean;
    control: any;
}

export const CheckBoxes: React.FC<CheckBoxesProps> = ({
    control,
    name,
    options,
    singleSelection = false,
}) => {
    const {
        field: { onChange, value = [] },
    } = useController({ name, control });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;

        let newValue;
        if (singleSelection) {
            newValue = selectedValue;
        } else {
            newValue = value.includes(selectedValue)
                ? value?.filter?.((v: string) => v !== selectedValue)
                : [...value, selectedValue];
        }
        onChange(newValue);
    };

    return (
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 select-none">
            {options.map((option) => (
                <label
                    key={option.value}
                    className="inline-flex items-center space-x-0 cursor-pointer
               "
                >
                    <input
                        type="checkbox"
                        name={name}
                        value={option.value}
                        checked={value.includes(option.value)}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-[#000] ps-3 capitalize">{option.label}</span>
                </label>
            ))}
        </div>
    );
};
