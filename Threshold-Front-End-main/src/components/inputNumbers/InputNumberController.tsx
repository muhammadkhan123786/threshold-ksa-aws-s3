import React, { useState } from 'react';
import { useController, Control, useFormContext } from 'react-hook-form';
import * as Theme from './Theme';
import { Controls } from 'components';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

interface InputControllerProps {
    name: string;
    control: Control<any>;
    label?: string;
    defaultValue?: string[];
}

export const InputNumberController: React.FC<
    InputControllerProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, control, defaultValue = [], name, ...rest }) => {
    const [inputValue, setInputValue] = useState('');
    const { setError } = useFormContext();
    const isRTL = useSelector((state: any) => state.locales.isRTL);
    const { trans } = useLocales();
    const phoneNumberSchema = yup
        .string()
        .matches(/^(05)\d{8}$/, trans('signup.validation.register.academyContactNumberInvalid'));
    const { field, fieldState } = useController<any>({
        control,
        name,
        defaultValue,
    });

    const addPhoneNumber = () => {
        phoneNumberSchema
            .validate(inputValue.trim())
            .then(() => {
                if (inputValue.trim() && !field.value.includes(inputValue.trim())) {
                    field.onChange([...field.value, inputValue.trim()]);
                    setInputValue('');
                }
            })
            .catch((err) => {
                setError(name, {
                    type: 'manual',
                    message: err.message,
                });
            });
    };

    const removePhoneNumber = (index: number) => {
        const updatedValues = field.value.filter((_: any, i: number) => i !== index);
        field.onChange(updatedValues);
    };

    return (
        <Theme.Body {...rest}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Controls.Label>{label}</Controls.Label>
                <p>{trans('signup.validation.register.pressEnterToAdd')}</p>
            </div>

            <Theme.InputWrapper>
                <Theme.Input
                    {...rest}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={trans('signup.validation.register.pressEnterToAdd')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent the default form submission behavior
                            addPhoneNumber();
                        }
                    }}
                />
            </Theme.InputWrapper>
            <Controls.Hint>{fieldState?.error?.message}</Controls.Hint>
            <Theme.ContactsNumberWrapper>
                {field.value.map((phone: string, index: number) => (
                    <Theme.PhoneItem key={index}>
                        <span>{phone}</span>
                        <Theme.RemoveButton type="button" onClick={() => removePhoneNumber(index)}>
                            x
                        </Theme.RemoveButton>
                    </Theme.PhoneItem>
                ))}
            </Theme.ContactsNumberWrapper>
        </Theme.Body>
    );
};
