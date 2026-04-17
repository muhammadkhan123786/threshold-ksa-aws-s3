import React from 'react';
import * as Theme from './Theme';
import { useController, Control } from 'react-hook-form';
import { Controls } from 'components';
import { useLocales } from 'hooks/locales';

interface FileInputControllerProps {
    name: string;
    control: Control<any>;
    label?: string;
    onChange?: (file: File | null) => void;
    placeholder?: string;
}

export const ImageInputController: React.FC<FileInputControllerProps> = ({
    name,
    control,
    label,
    onChange,
    placeholder,
}) => {
    const { field } = useController({ name, control });
    const { trans } = useLocales();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        field.onChange(file);
        if (onChange) {
            onChange(file);
        }
    };

    return (
        <>
            <Theme.Label>{label}</Theme.Label>
            <Theme.FileInputWrapper>
                <Theme.FileInputLabel htmlFor={name}>
                    {field.value?.name || trans('file.chooseFile')}
                </Theme.FileInputLabel>
                <Theme.HiddenFileInput
                    id={name}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </Theme.FileInputWrapper>
        </>
    );
};
