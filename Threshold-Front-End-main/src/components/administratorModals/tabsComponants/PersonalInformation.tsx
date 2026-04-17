import React from 'react';
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
import { AdministratorsType } from 'libs/enums/athlete';
import { InputController } from 'components/input'; // Import InputController

interface FormData {
    firstName: string;
    lastName: string;
    avatar: File | null;
    nationality: any;
    gender: any;
    birthday: Date | null;
    joinDate: Date | null;
    emergencyPhone: string;
    phone: string;
    type: any;
    relationship: any;
    experience: number;
    branch?: string;
}

export const PersonalInformation: React.FC = () => {
    const { trans } = useLocales();
    const {
        control,
        formState: { errors },
        setValue,
        watch,
    } = useFormContext<FormData>();

    return (
        <Theme.Body>
            <Theme.GridWrapper>
                <Theme.EvenWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.firstName')} />
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field, fieldState }) => (
                                <>
                                    <InputController
                                        {...field}
                                        control={control}
                                        placeholder={trans('placeholder.firstName')}
                                    />
                                </>
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.lastName')} />
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field, fieldState }) => (
                                <>
                                    <InputController
                                        {...field}
                                        control={control}
                                        placeholder={trans('placeholder.lastName')}
                                    />
                                </>
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>
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

                <Theme.OddWrapper>
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
                </Theme.OddWrapper>
                <Theme.OddWrapper>
                    {/* Phone number*/}
                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.phone')} />
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field, fieldState }) => (
                                <>
                                    <InputController
                                        {...field}
                                        control={control}
                                        placeholder={trans('placeholder.phone')}
                                    />
                                </>
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>
                </Theme.OddWrapper>

                <Theme.EvenWrapper>
                    {/* urgent phone number */}
                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.emergencyPhone')} />
                        <Controller
                            control={control}
                            name="emergencyPhone"
                            render={({ field, fieldState }) => (
                                <>
                                    <InputController
                                        {...field}
                                        control={control}
                                        placeholder={trans('placeholder.emergencyPhone')}
                                    />
                                </>
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>

                    {/* relationship */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('label.contactRelationship')}
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

                <Theme.EvenWrapper>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('label.experience')} />
                        <Controller
                            control={control}
                            name="experience"
                            render={({ field }) => (
                                <>
                                    <InputController
                                        {...field}
                                        placeholder={trans('placeholder.experience')}
                                        control={control}
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
                            title={trans('label.joinDate')}
                            content={
                                <InputDateController
                                    control={control}
                                    name="joinDate"
                                    placeholder={trans('placeholder.joinDate')}
                                />
                            }
                        />
                    </Theme.FullWidthInputsWrapper>
                </Theme.EvenWrapper>
                <Theme.OddWrapper>
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('label.type')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control,
                                        name: 'type',
                                        options: arrayToSelectOptions({
                                            array: AdministratorsType,
                                        }),
                                        transSuffix: 'form.addCoach.',
                                        menuPlacement: 'bottom',
                                        value: watch('type'),
                                        onChange: (value: any) => setValue('type', value),
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                </Theme.OddWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
