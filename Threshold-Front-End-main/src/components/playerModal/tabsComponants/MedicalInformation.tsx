import React from 'react';
import * as Theme from './Theme';
import { useFormContext } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { InputDateController } from 'components/inputDate';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { Conditions } from 'libs/enums';
import { Consideration, FoodAllergies } from 'libs/enums/athlete';

export const MedicalInformation: React.FC = () => {
    const { trans } = useLocales();
    const { control } = useFormContext();

    return (
        <Theme.Body>
            <Theme.GridWrapper>
                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.lastUpdatedDate')}
                        content={
                            <InputDateController
                                control={control}
                                name="dateOfUpdating"
                                placeholder={trans('placeholder.lastUpdatedDate')}
                                defaultValue=""
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>
                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.allergies')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'allergyDetails',
                                    isMulti: true,
                                    options: arrayToSelectOptions({ array: FoodAllergies }),
                                    transSuffix: 'foodAllergies.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>

                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.chronic')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'chronicConditions',
                                    isMulti: true,
                                    options: arrayToSelectOptions({ array: Consideration }),
                                    transSuffix: 'form.editMedicalInfo.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>

                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.healthConsiderations')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'healthFactors',
                                    isMulti: true,
                                    options: arrayToSelectOptions({ array: Conditions }),
                                    transSuffix: 'form.add.player.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
