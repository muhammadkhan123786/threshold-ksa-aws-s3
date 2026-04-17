import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { InputController } from 'components/input';
import { Education, Gender, SubscriptionPeriod, PaymentMethod } from 'libs/enums';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import {
    addMonths,
    arrayToSelectOptions,
    getDateYearsFromNow,
    handleEditAthlete,
    selectOptionsToValues,
} from 'libs/helpers';
import { MultiSelectController } from 'components/multi-selection';
import { InputDateController } from 'components/inputDate';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { EDIT_ATHLETE_PERSONAL_INFO_DEFAULTS, useEditAthletePersonalInfoSchema } from 'schemas';

export const EditAthletePersonalInfo: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
            nationality: { value: string; label: string } | null;
            setAthleteData?: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const {
        defaultValues,
        isModal,
        activeTab,
        nationality,
        handleSave,
        id: athleteId,
        handleCancel,
        setAthleteData,
    } = props;
    const dispatch = useDispatch();

    const editAthletePersonalInfoSchema = useEditAthletePersonalInfoSchema(nationality);
    const {
        formState: { isValid, touchedFields },
        control,
        getValues,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editAthletePersonalInfoSchema),
        defaultValues: defaultValues || EDIT_ATHLETE_PERSONAL_INFO_DEFAULTS,
    });

    const selectIsValid = useMemo(
        () => !!watch('education') && !!watch('gender') && !!watch('periodOfSubscription'),
        [watch('education'), watch('gender'), watch('periodOfSubscription')],
    );

    const handleWindowSave = async () => {
        if (isModal && athleteId) {
            await handleEditAthlete(
                selectOptionsToValues(getValues(), [
                    'education',
                    'gender',
                    'periodOfSubscription',
                    'paymentMethod',
                ]),
                dispatch,
                athleteId,
            );
        } else {
            setAthleteData && setAthleteData((prev) => ({ ...prev, ...getValues() }));

            setTimeout(
                async () => {
                    handleSave && (await handleSave());
                },
                activeTab === 2 ? 2000 : 100,
            );
        }
    };

    useEffect(() => {
        setAthleteData && setAthleteData((prev) => ({ ...prev, ...getValues() }));
    }, [touchedFields]);

    return (
        <Body>
            <FormRow
                title={trans('form.editAthletePersonalInfo.birth')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'dateOfBirth',
                            withPortal: !isModal,
                        }}
                        maxDate={getDateYearsFromNow(5)}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.join')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'joinDate',
                            withPortal: !isModal,
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.subscriptionManagement.periodSubscription')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'periodOfSubscription',
                            options: arrayToSelectOptions({ array: SubscriptionPeriod }),
                            transSuffix: 'form.subscriptionManagement.periodSubscription.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.paymentMethod')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'paymentMethod',
                            options: arrayToSelectOptions({ array: PaymentMethod }),
                            transSuffix: 'form.editAthletePersonalInfo.paymentMethod.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.cashValue')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'cashValue',
                            type: 'number',
                            min: 0,
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.remainingValue')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'remainingValue',
                            type: 'number',
                            min: 0,
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.education')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'education',
                            options: arrayToSelectOptions({ array: Education }),
                            transSuffix: 'form.editAthletePersonalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.gender')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'gender',
                            options: arrayToSelectOptions({ array: Gender }),
                            transSuffix: 'global.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.nin')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'nin',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.ninExpire')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'ninExpirationDate',
                            withPortal: !isModal,
                        }}
                        maxDate={addMonths(new Date(), 100)}
                        minDate={new Date()}
                    />
                }
            />
            <Divider />

            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid && selectIsValid}
                        handleSave={handleWindowSave}
                        handleCancel={handleCancel}
                        saveText={isModal ? 'form.save' : 'form.next'}
                        cancelText={isModal || activeTab === 0 ? 'form.cancel' : 'form.back'}
                    />
                }
            />
        </Body>
    );
};
