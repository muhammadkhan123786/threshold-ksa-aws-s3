import React, { ReactNode } from 'react';
import { useController, Control } from 'react-hook-form';
import * as InputTheme from './Theme';
import 'react-datepicker/dist/react-datepicker.css';
import { Controls } from 'components';
import { getAvatarPlaceholder } from 'libs/constants';

interface InputControllerProps {
    name: string;
    control: Control<any>;
    label?: string;
    defaultValue?: string;
    contents?: ReactNode;
    isAvatar?: boolean;
    onChange?: (base64String: string | null) => void;
    trigger: (name?: string | string[]) => Promise<boolean>;
}

export const InputFileController: React.FC<
    InputControllerProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
    label,
    control,
    defaultValue,
    name,
    isAvatar = true,
    trigger,
    contents,
    onChange,
    ...inputProps
}) => {
    const { field, fieldState } = useController<any>({
        control,
        name,
        defaultValue,
    });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64String = await convertFileToBase64(file);
                field.onChange(base64String);
                if (onChange) {
                    onChange(base64String);
                }
                trigger(name);
            } catch (error) {
                console.error('FileReader API is not supported by your browser.', error);
            }
        }
    };

    const convertFileToBase64 = async (file: File): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            if (typeof URL.createObjectURL === 'undefined') {
                reject(new Error('URL.createObjectURL is not supported by your browser.'));
                return;
            }

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d') as any;
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
            img.src = URL.createObjectURL(file);
        });
    };

    return (
        <InputTheme.AvatarWrapper $isAvatar={isAvatar}>
            {isAvatar && (
                <InputTheme.Avatar src={field.value || getAvatarPlaceholder()} alt="avatar" />
            )}
            <InputTheme.Body>
                <InputTheme.UploaderWrapper>
                    <input
                        type="file"
                        id="actual-btn"
                        hidden
                        accept="image/png, image/jpg, image/jpeg"
                        {...field}
                        value=""
                        onChange={handleFileChange}
                        {...inputProps}
                    />
                    <label
                        htmlFor="actual-btn"
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        <InputTheme.UploadIcon src="/assets/icons/upload-icon.png" alt="upload" />
                        {contents}
                    </label>
                </InputTheme.UploaderWrapper>
                <Controls.Hint>{fieldState?.error?.message}</Controls.Hint>
            </InputTheme.Body>
        </InputTheme.AvatarWrapper>
    );
};
