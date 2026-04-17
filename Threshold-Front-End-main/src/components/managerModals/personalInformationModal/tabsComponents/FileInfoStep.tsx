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
import { ContractDuration } from 'libs/enums/contract';
import { ManagementType } from 'libs/enums/manager';
import { SportProfileType } from 'libs/enums/athlete';

export const FileInfoStep: React.FC<{ managerDetails: any }> = ({ managerDetails }) => {
    const { trans } = useLocales();
    const { control } = useFormContext();

    return (
        <Theme.GridWrapper2>
            <Theme.EvenWrapper>
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
                {/* contract duration */}
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.contractDuration')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'contractDuration',
                                    options: arrayToSelectOptions({
                                        array: ContractDuration,
                                    }),
                                    transSuffix: 'form.subscriptionManagement.periodSubscription.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
            </Theme.EvenWrapper>
            <Theme.EvenWrapper>
                {/* Management Type */}
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.managementType')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'managementType',
                                    options: arrayToSelectOptions({
                                        array: ManagementType,
                                    }),
                                    transSuffix: 'form.manager.managementType.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
                {/* Sport Type */}
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.sportType')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'sportType',
                                    options: arrayToSelectOptions({ array: SportProfileType }),
                                    transSuffix: 'sport.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
            </Theme.EvenWrapper>

            <Theme.OddWrapper>
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
            </Theme.OddWrapper>
        </Theme.GridWrapper2>
    );
};
