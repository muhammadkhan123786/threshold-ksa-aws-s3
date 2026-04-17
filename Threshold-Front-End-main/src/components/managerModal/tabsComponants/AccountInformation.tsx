import React, { useEffect, useState } from 'react';
import * as Theme from './Theme';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { LabelInput } from '../../labelInput';
import 'react-datepicker/dist/react-datepicker.css';
import { Gender, Nationality } from 'libs/enums';
import { MultiSelectController } from 'components/multi-selection';
import { FormRow } from 'components/modal-windows/FormRow';
import { arrayToSelectOptions } from 'libs/helpers';
import { addMonths, format } from 'date-fns';
import { InputDateController } from 'components/inputDate';
import { FilePickerController } from 'components/filePicker/FilePickerController';
import { InputController } from 'components/input';

interface FormData {
    firstName: string;
    lastName: string;
    avatar: File | null;
    nationality: string;
    gender: string;
    birthday: any;
    experience: string;
    nationalId: string;
    nationalIdExpirationDate: any;
}

export const AccountInformation: React.FC<{ onNationalityChange: (value: any) => void }> = ({
    onNationalityChange,
}) => {
    const { trans } = useLocales();
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext<FormData>();
    const nationality = watch('nationality');
    useEffect(() => {
        if (onNationalityChange) {
            onNationalityChange(nationality);
        }
    }, [nationality, onNationalityChange]);
    return (
        <Theme.Body>
            <Theme.GridWrapper>
                {/* Full Name and Image */}
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.firstName')} />
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.firstName')}
                                />
                            </>
                        )}
                    />
                </Theme.InputsWrapper>
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.lastName')} />
                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.lastName')}
                                />
                            </>
                        )}
                    />
                </Theme.InputsWrapper>
                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.imageWithoutBackground')}
                        content={
                            <FilePickerController
                                {...{
                                    control,
                                    name: 'avatar',
                                    placeholder: trans('placeholder.avatar'),
                                }}
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>
                {/* Nationality and Gender */}
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.nationality')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'nationality',
                                    options: arrayToSelectOptions({ array: Nationality }),
                                    transSuffix: 'form.editAthleteProfile.',
                                    menuPlacement: 'bottom',
                                    value: watch('nationality'),
                                    onChange: (value: any) => setValue('nationality', value),
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.gender')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'gender',
                                    options: arrayToSelectOptions({ array: Gender }),
                                    transSuffix: 'form.editAthletePersonalInfo.',
                                    menuPlacement: 'bottom',
                                    value: watch('gender'),
                                    onChange: (value: any) => setValue('gender', value),
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
                {/* Birthday */}
                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.birthday')}
                        content={
                            <InputDateController
                                control={control}
                                name="birthday"
                                placeholder={trans('placeholder.birthday')}
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>
                <Theme.FullWidthInputsWrapper>
                    <LabelInput label={trans('label.experience')} />
                    <Controller
                        control={control}
                        name="experience"
                        render={({ field }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.experience')}
                                />
                            </>
                        )}
                    />
                </Theme.FullWidthInputsWrapper>
                {/* National ID and Expiration Date */}
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.nationalId')} />
                    <Controller
                        control={control}
                        name="nationalId"
                        render={({ field }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.nationalId')}
                                />
                            </>
                        )}
                    />
                </Theme.InputsWrapper>
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.nationalIdExpirationDate')}
                        content={
                            <InputDateController
                                control={control}
                                name="nationalIdExpirationDate"
                                placeholder={trans('placeholder.nationalIdExpiration')}
                                maxDate={addMonths(new Date(), 100)}
                                minDate={new Date()}
                            />
                        }
                    />
                </Theme.InputsWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
