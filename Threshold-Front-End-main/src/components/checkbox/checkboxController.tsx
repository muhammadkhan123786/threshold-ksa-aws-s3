import React, { ReactNode } from 'react';
import { useController, Control } from 'react-hook-form';
import * as Theme from './Theme';

interface Props {
    name: string;
    control: Control<any>;
    label: ReactNode;
    defaultValue?: boolean;
}

export const CheckboxController = ({ label, control, defaultValue, name, ...rest }: Props) => {
    const { field, fieldState } = useController<any>({
        control,
        name,
        defaultValue,
    });

    return (
        <Theme.CheckboxBody {...rest}>
            <div className="flex gap-[15px]">
                <Theme.Checkbox type="checkbox" id={name} {...field} />
                <Theme.InputLabel htmlFor={name}>{label}</Theme.InputLabel>
            </div>
            <Theme.InputHint>{fieldState?.error?.message}</Theme.InputHint>
        </Theme.CheckboxBody>
    );
};
