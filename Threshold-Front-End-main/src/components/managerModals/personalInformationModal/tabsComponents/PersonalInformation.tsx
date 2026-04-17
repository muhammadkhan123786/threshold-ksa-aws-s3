import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import * as Theme from '../Theme';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { Education, Gender, Nationality, Language, Country } from 'libs/enums';
import { InputDateController } from 'components/inputDate';
import { InputController } from 'components/input';
import { FilePickerController } from 'components/filePicker/FilePickerController';

export const PersonalInfoStep: React.FC<{ managerDetails: any }> = ({ managerDetails }) => {
    const { trans } = useLocales();
    const { control } = useFormContext();

    return (
        <Theme.GridWrapper2>
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
            {/* country */}
            <Theme.OddWrapper>
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('coach.profile.country')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'country',
                                    options: arrayToSelectOptions({ array: Country }),
                                    transSuffix: 'form.editAthleteProfile.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
            </Theme.OddWrapper>

            <Theme.EvenWrapper>
                {/* Education Input */}
                <Theme.InputsWrapper>
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('coach.profile.educationLevel')}
                        content={
                            <MultiSelectController
                                control={control}
                                name="educationalLevel"
                                options={arrayToSelectOptions({ array: Education })}
                                transSuffix="form.editAthleteProfile."
                            />
                        }
                    />
                </Theme.InputsWrapper>

                {/* School Name Input */}
                <Theme.InputsWrapper>
                    <LabelInput label={trans('player.Edit.schoolName')} />
                    <Controller
                        name="schoolName"
                        control={control}
                        render={({ field }) => (
                            <InputController
                                {...field}
                                placeholder={trans('player.Edit.schoolName')}
                                control={control}
                            />
                        )}
                    />
                </Theme.InputsWrapper>
            </Theme.EvenWrapper>
            <Theme.OddWrapper>
                <Theme.InputsWrapper>
                    <LabelInput label={trans('profile.language')} />
                    <MultiSelectController
                        {...{
                            control,
                            name: 'languages',
                            isMulti: true,
                            options: arrayToSelectOptions({ array: Language }),
                            transSuffix: 'language.',
                            menuPlacement: 'top',
                        }}
                    />
                </Theme.InputsWrapper>
            </Theme.OddWrapper>
        </Theme.GridWrapper2>
    );
};
