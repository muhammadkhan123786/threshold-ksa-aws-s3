import React, { useState } from 'react';
import * as Theme from './Theme';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { LabelInput } from '../../labelInput';
import { ClubRole, EmploymentType, Relationship } from 'libs/enums';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { addMonths, arrayToSelectOptions } from 'libs/helpers';
import { InputController } from 'components/input';
import { InputDateController } from 'components/inputDate';
import { ContractDuration } from 'libs/enums/contract';

export const FileInformation: React.FC = () => {
    const { trans } = useLocales();
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext();
    return (
        <Theme.Body>
            <Theme.GridWrapper>
                {/* Position */}
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.position')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'position',
                                    options: arrayToSelectOptions({ array: ClubRole }),
                                    transSuffix: 'form.add.manager.',
                                    menuPlacement: 'bottom',
                                    value: watch('position'),
                                    onChange: (value: any) => setValue('position', value),
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
                {/* Branch ID */}
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.phone')} />
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.phone')}
                                />
                            </>
                        )}
                    />
                </Theme.InputsWrapper>
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.emergencyPhone')} />
                    <Controller
                        control={control}
                        name="emergencyPhone"
                        render={({ field }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.emergencyPhone')}
                                />
                            </>
                        )}
                    />
                </Theme.InputsWrapper>
                {/* Contract Duration */}
                {/* Joined Date */}
                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.joinedDate')}
                        content={
                            <InputDateController
                                control={control}
                                name="joinDate"
                                placeholder={trans('placeholder.joinedDate')}
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>
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
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.contractType')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'contractType',
                                    options: arrayToSelectOptions({ array: EmploymentType }),
                                    transSuffix: 'select.option.',
                                    menuPlacement: 'bottom',
                                    value: watch('contractType'),
                                    onChange: (value: any) => setValue('contractType', value),
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
                <Theme.FullWidthInputsWrapper>
                    <LabelInput label={trans('label.contractBenefits')} />
                    <Controller
                        control={control}
                        name="contractBenefits"
                        render={({ field }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.contractBenefits')}
                                />
                            </>
                        )}
                    />
                </Theme.FullWidthInputsWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
