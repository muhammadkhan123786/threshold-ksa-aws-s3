import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import * as Theme from '../Theme';
import { LabelInput } from 'components/labelInput';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { InputDateController } from 'components/inputDate';
import { InputController } from 'components/input';
import { AdminType } from 'libs/enums/admin-type';

export const FileInfoStep: React.FC<{ teamsData: any }> = ({ teamsData }) => {
    const { trans } = useLocales();
    const { control } = useFormContext();

    return (
        <Theme.GridWrapper2>
            <Theme.OddWrapper>
                {/* join date */}
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
            </Theme.OddWrapper>
            <Theme.OddWrapper>
                {/* Team Category */}
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('coach.profile.playingFor')}
                        content={
                            <MultiSelectController
                                control={control}
                                name="playingFor"
                                options={teamsData?.payload.items.map((item: any) => ({
                                    label: item.name,
                                    value: item.id,
                                }))}
                            />
                        }
                    />
                </Theme.InputsWrapper>
            </Theme.OddWrapper>

            <Theme.EvenWrapper>
                {/* Experience */}
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
                {/* Role Type */}
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
                                    name: 'roleType',
                                    options: arrayToSelectOptions({ array: AdminType }),
                                    transSuffix: 'form.addCoach.',
                                    menuPlacement: 'top',
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
            </Theme.EvenWrapper>
        </Theme.GridWrapper2>
    );
};
