import React, { useEffect } from 'react';
import * as Theme from './Theme';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { LabelInput } from '../../labelInput';
import 'react-datepicker/dist/react-datepicker.css';
import { Gender, Nationality, Relationship, Education } from 'libs/enums';
import { MultiSelectController } from 'components/multi-selection';
import { FormRow } from 'components/modal-windows/FormRow';
import { addMonths, arrayToSelectOptions } from 'libs/helpers';
import { InputDateController } from 'components/inputDate';
import { FilePickerController } from 'components/filePicker/FilePickerController';
import { InputController } from 'components/input';

interface FormData {
    firstName: string;
    lastName: string;
    avatar: File | null;
    nationality: string;
    gender: string;
    dateOfBirth: Date | null;
    contactNumber: string;
    emergencyPhone: string;
    relationship: string;
    nationalId: string;
    education: string;
    nin: number;
    ninExpirationDate: Date | null;
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
                <Theme.EvenWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.firstName')} />
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field, fieldState }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.firstName')}
                                />
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('label.lastName')} />
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field, fieldState }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.lastName')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>
                </Theme.EvenWrapper>
                <Theme.OddWrapper>
                    <Theme.InputsWrapper>
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
                                        accept: 'image/*',
                                        maxFiles: 1,
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                </Theme.OddWrapper>
                <Theme.EvenWrapper>
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
                </Theme.EvenWrapper>
                <Theme.EvenWrapper>
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
                                    name="dateOfBirth"
                                    placeholder={trans('placeholder.birthday')}
                                />
                            }
                        />
                    </Theme.FullWidthInputsWrapper>
                </Theme.EvenWrapper>

                <Theme.EvenWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.contactNumber')} />
                        <Controller
                            control={control}
                            name="contactNumber"
                            rules={{ required: trans('error.contactNumber') }}
                            render={({ field, fieldState }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.contactNumber')}
                                />
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.emergencyPhone')} />
                        <Controller
                            control={control}
                            name="emergencyPhone"
                            rules={{ required: trans('error.emergencyPhone') }}
                            render={({ field, fieldState }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.emergencyPhone')}
                                />
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>
                </Theme.EvenWrapper>
                <Theme.EvenWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.educationalLevel')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'education',
                                    options: arrayToSelectOptions({ array: Education }),
                                    transSuffix: 'form.editAthleteProfile.',
                                    menuPlacement: 'bottom',
                                    value: watch('education'),
                                    onChange: (value: any) => setValue('education', value),
                                }}
                            />
                        }
                    />
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('label.relationship')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control,
                                        name: 'relationship',
                                        options: arrayToSelectOptions({ array: Relationship }),
                                        transSuffix: 'form.editAthleteProfile.',
                                        menuPlacement: 'bottom',
                                        value: watch('relationship'),
                                        onChange: (value: any) => setValue('relationship', value),
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                </Theme.EvenWrapper>
                {/* National ID and Expiration Date */}
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.nationalId')} />
                    <Controller
                        control={control}
                        name="nin"
                        render={({ field, fieldState }) => (
                            <InputController
                                {...field}
                                control={control}
                                placeholder={trans('placeholder.nationalId')}
                            />
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
                                name="ninExpirationDate"
                                placeholder={trans('placeholder.nationalIdExpiration')}
                                maxDate={new Date('01/01/2050')}
                                minDate={new Date()}
                            />
                        }
                    />
                </Theme.InputsWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
