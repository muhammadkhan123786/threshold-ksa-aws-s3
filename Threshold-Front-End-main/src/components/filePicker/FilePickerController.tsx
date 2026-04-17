import React, { useRef, useState, useEffect } from 'react';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import * as Theme from './theme';
import { get, isObject } from 'lodash';

interface FilePickerControllerProps<T extends FieldValues> extends UseControllerProps<T> {
    label?: string;
    accept?: string;
}

export const FilePickerController = <T extends FieldValues>({
    label,
    control,
    name,
    accept = 'image/*',
}: FilePickerControllerProps<T>) => {
    const { field } = useController<T>({ control, name });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const { trans } = useLocales();

    useEffect(() => {
        const selectedFile = get(field, 'value', null);
        if (isObject(selectedFile) && 'name' in selectedFile) {
            setFileName((selectedFile as File).name);
        }
    }, [field.value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            field.onChange(file);
        }
    };

    const handleClick = () => fileInputRef.current?.click();

    return (
        <Theme.FieldWrapper>
            {label && <Theme.Label>{label}</Theme.Label>}
            <Theme.FilePickerContainer onClick={handleClick}>
                <Theme.FileInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                />
                <Theme.DisplayBox>
                    {fileName || trans('file.chooseFile', 'Choose file')}
                </Theme.DisplayBox>
            </Theme.FilePickerContainer>
        </Theme.FieldWrapper>
    );
};
