import React, { ReactNode, useState, useEffect } from 'react';
import { useController, Control } from 'react-hook-form';
import styled from 'styled-components';
import * as InputTheme from './Theme';
import { Controls } from 'components';
import { useLocales } from 'hooks/locales';

interface InputControllerProps {
    name: string;
    control: Control<any>;
    label?: string;
    defaultValue?: string;
    contents?: ReactNode;
    isAvatar?: boolean;
    onChange?: (file: File | null) => void;
    trigger?: (name?: string | string[]) => Promise<boolean>;
    showProgress?: boolean; // New Prop to toggle progress UI
}

export const InputPdfController: React.FC<
    InputControllerProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
    label,
    control,
    defaultValue,
    name,
    isAvatar = false,
    trigger,
    contents,
    onChange,
    showProgress = false,
    ...inputProps
}) => {
    const { field, fieldState } = useController<any>({
        control,
        name,
        defaultValue,
    });

    const [fileName, setFileName] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [uploadInterval, setUploadInterval] = useState<any>(null); // Track interval
    const { trans } = useLocales();

    useEffect(() => {
        return () => {
            if (uploadInterval) {
                clearInterval(uploadInterval);
            }
        };
    }, [uploadInterval]);

    const resetProgress = () => {
        setProgress(0);
        setTimeRemaining(null);
        if (uploadInterval) {
            clearInterval(uploadInterval);
            setUploadInterval(null);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        resetProgress();
        setFileName(null);

        if (file) {
            field.onChange(file);
            if (onChange) onChange(file);

            setFileName(file.name);

            let isValid = true;
            if (trigger) {
                isValid = await trigger(name);
            }

            if (!isValid) {
                return;
            }

            if (showProgress) {
                const uploadTime = Math.max(3, Math.ceil(file.size / 500000));
                setTimeRemaining(uploadTime);
                let uploaded = 0;

                setProgress(0);

                const interval = setInterval(
                    () => {
                        uploaded += 10;
                        setProgress((prev) => {
                            const newProgress = Math.min(prev + 10, 100);
                            return newProgress;
                        });

                        setTimeRemaining((prev) => (prev !== null ? Math.max(prev - 1, 0) : null));

                        if (uploaded >= 100) {
                            clearInterval(interval);
                            setUploadInterval(null);
                        }
                    },
                    (uploadTime * 1000) / 10,
                );

                setUploadInterval(interval);
            }
        }
    };
    return (
        <InputTheme.AvatarWrapper $isAvatar={isAvatar}>
            <InputTheme.Body>
                <InputTheme.UploaderWrapper>
                    <input
                        type="file"
                        id={`input-${name}`}
                        hidden
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        {...field}
                        value="" // Prevent React from controlling input
                        onChange={handleFileChange}
                        {...inputProps}
                    />
                    <label htmlFor={`input-${name}`} style={{ cursor: 'pointer' }}>
                        <InputTheme.UploadIcon src="/assets/icons/upload-icon.png" alt="upload" />
                        {contents}
                    </label>
                </InputTheme.UploaderWrapper>

                {/* Display file name */}
                <InputTheme.percentageWrapper>
                    <InputTheme.FileName>
                        {fileName
                            ? progress === 100
                                ? `${trans('fileUpload.uploadedLabel')} ${fileName}`
                                : `${trans('fileUpload.uploadingLabel')} ${fileName}`
                            : trans('fileUpload.noFileSelected')}
                    </InputTheme.FileName>
                    {progress !== 0 && <InputTheme.FileName> {progress}%</InputTheme.FileName>}
                </InputTheme.percentageWrapper>

                {/* ✅ Conditionally show progress bar ONLY if there are NO validation errors */}
                {showProgress && fileName && !fieldState.error && (
                    <InputTheme.ProgressBarWrapper>
                        <InputTheme.ProgressBar onProgress={progress} />
                        {timeRemaining !== null && timeRemaining > 0 && (
                            <InputTheme.TimeRemaining>
                                {trans('fileUpload.secondsRemaining', { time: timeRemaining })}
                            </InputTheme.TimeRemaining>
                        )}
                    </InputTheme.ProgressBarWrapper>
                )}

                {/* Display validation error if present */}
                <Controls.Hint>{fieldState?.error?.message}</Controls.Hint>
            </InputTheme.Body>
        </InputTheme.AvatarWrapper>
    );
};
