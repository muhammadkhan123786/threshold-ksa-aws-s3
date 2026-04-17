import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller, FieldValues, SubmitHandler } from 'react-hook-form';
import * as Theme from './Theme';
import { LabelInput } from '../../components/labelInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { templateSettingValidation } from '../../schemas/sessions/templateSettingValidation';
import { useLocales } from 'hooks/locales';
import { Nationality } from 'libs/enums';
import { arrayToSelectOptions } from 'libs/helpers';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { InputController } from 'components/input';
export interface TemplateSettingsFormRef {
    submitForm: () => Promise<FieldValues>;
}

interface FormData {
    phase: object;
    target: string;
    technique: any;
    unit: object;
    calculationMethod: object;
}

export const TemplateSettingsForm = forwardRef<TemplateSettingsFormRef>((_, ref) => {
    const { trans } = useLocales();
    const schema = templateSettingValidation();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: 'all',
        resolver: yupResolver(schema),
    });
    useImperativeHandle(ref, () => ({
        submitForm: () =>
            new Promise((resolve, reject) => {
                handleSubmit(resolve, reject)();
            }),
    }));

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log('Form Data:', data);
    };

    return (
        <>
            <Theme.Body onSubmit={handleSubmit(onSubmit)}>
                <Theme.GridWrapper>
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('templateSettings.form.phase')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control,
                                        name: 'phase',
                                        options: arrayToSelectOptions({ array: Nationality }),
                                        transSuffix: 'templateSettings.form.selectPhase.',
                                        menuPlacement: 'bottom',
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* Input Field */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('templateSettings.form.target')} />
                        <Controller
                            name="target"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('templateSettings.form.enterInput')}
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
                            title={trans('templateSettings.form.technique')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control,
                                        name: 'technique',
                                        isMulti: true,
                                        options: arrayToSelectOptions({ array: Nationality }),
                                        transSuffix: 'templateSettings.form.selectTechnique.',
                                        menuPlacement: 'bottom',
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                    {/* Unit and Calculation Method */}
                    <Theme.InputsMultiWrapper>
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('templateSettings.form.unit')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'unit',
                                            options: arrayToSelectOptions({ array: Nationality }),
                                            transSuffix: 'templateSettings.form.selectUnit.',
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
                                title={trans('templateSettings.form.calculationMethod')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'calculationMethod',
                                            options: arrayToSelectOptions({ array: Nationality }),
                                            transSuffix:
                                                'templateSettings.form.selectCalculationMethod.',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>
                    </Theme.InputsMultiWrapper>
                </Theme.GridWrapper>
            </Theme.Body>
            <Theme.LineHR />
        </>
    );
});
