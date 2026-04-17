import { useController, Control } from 'react-hook-form';
import * as InputTheme from './Theme';
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';

interface Props {
    name: string;
    control: Control<any>;
    label?: string;
    defaultValue?: string;
}

export const InputTimeController: React.FC<Props & React.InputHTMLAttributes<HTMLInputElement>> = ({
    label,
    control,
    defaultValue,
    name,
    ...rest
}) => {
    const { field, fieldState } = useController<any>({
        control,
        name,
        defaultValue,
    });

    return <InputTheme.Body {...rest}></InputTheme.Body>;
};
