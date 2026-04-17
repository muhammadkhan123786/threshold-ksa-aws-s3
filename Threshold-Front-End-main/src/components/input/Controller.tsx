import React, { useState } from 'react';
import { useController, Control } from 'react-hook-form';
import * as InputTheme from './Theme';
import { Controls } from 'components';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

interface InputControllerProps {
    name: string;
    control: Control<any>;
    label?: string;
    defaultValue?: string;
    isMultiline?: boolean;
    rows?: number;
}

export const InputController: React.FC<
    InputControllerProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, control, defaultValue, name, isMultiline = false, rows = 5, ...rest }) => {
    const [passIsVisible, setPassIsVisible] = useState(false);
    const isRTL = useSelector((state: any) => state.locales.isRTL);

    const { field, fieldState } = useController<any>({
        control,
        name,
        defaultValue,
    });

    const getComponent = () => {
        if (isMultiline) {
            return <InputTheme.TextArea rows={rows} {...field} />;
        }

        return (
            <InputTheme.InputWrapper>
                <InputTheme.Input
                    {...field}
                    {...rest}
                    type={
                        rest.type !== 'password' ? rest.type : passIsVisible ? 'text' : 'password'
                    }
                />
                {rest.type === 'password' && (
                    <InputTheme.PasswordButton
                        isRTL={isRTL}
                        type="button"
                        visible={rest.type === 'password' || undefined}
                        onClick={() => {
                            setPassIsVisible((prev) => !prev);
                        }}
                    >
                        <InputTheme.PasswordImg src="/assets/icons/eye-icon.png" alt="eye" />
                        <InputTheme.PasswordImgLine visible={passIsVisible || undefined} />
                    </InputTheme.PasswordButton>
                )}
            </InputTheme.InputWrapper>
        );
    };

    return (
        <InputTheme.Body {...rest}>
            <Controls.Label>{label}</Controls.Label>
            {getComponent()}
            {fieldState?.error?.message && (
                <Controls.Hint>{fieldState?.error?.message}</Controls.Hint>
            )}
        </InputTheme.Body>
    );
};
