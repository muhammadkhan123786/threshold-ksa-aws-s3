import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { useForm } from 'react-hook-form';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { arrayToSelectOptions, selectOptionsToValues } from 'libs/helpers';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { MultiSelectController } from 'components/multi-selection';
import { InputDateController } from 'components/inputDate';
import { SubscriptionPeriod, SubscriptionStatus } from 'libs/enums/athlete';
import { handleEditSubscription } from 'libs/helpers/modalHelpers';
import {
    EDIT_ATHLETE_SUBSCRIPTION_DEFAULTS,
    useEditAthleteSubscriptionSchema,
} from 'schemas/athlete/editAthleteSubscription';

export const UpdateAthleteSubscription: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
            setAthleteData?: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const {
        defaultValues,
        isModal,
        activeTab,
        id: athleteId,
        setAthleteData,
        handleCancel,
    } = props;
    const dispatch = useDispatch();

    const editAthleteSubscriptionSchema = useEditAthleteSubscriptionSchema();
    const {
        formState: { isValid, touchedFields },
        control,
        getValues,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editAthleteSubscriptionSchema),
        defaultValues: defaultValues || EDIT_ATHLETE_SUBSCRIPTION_DEFAULTS,
    });

    const handleWindowSave = async () => {
        if (athleteId) {
            await handleEditSubscription(
                selectOptionsToValues(getValues(), ['status', 'period']),
                dispatch,
                athleteId,
            );
        }
    };

    useEffect(() => {
        setAthleteData && setAthleteData((prev) => ({ ...prev, ...getValues() }));
    }, [touchedFields]);

    const selectIsValid = useMemo(
        () => !!watch('status') || !!watch('period') || !!watch('subscriptionDate'),
        [watch('status'), watch('period'), watch('subscriptionDate')],
    );

    return (
        <Body>
            <FormRow
                title={trans('form.subscriptionManagement.date')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'subscriptionDate',
                            withPortal: !isModal,
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.subscriptionManagement.status')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'status',
                            menuPlacement: 'bottom',
                            options: arrayToSelectOptions({
                                array: SubscriptionStatus,
                            }),
                            transSuffix: 'form.subscriptionManagement.status.',
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
                            name: 'period',
                            menuPlacement: 'bottom',
                            options: arrayToSelectOptions({
                                array: SubscriptionPeriod,
                            }),
                            transSuffix: 'form.subscriptionManagement.periodSubscription.',
                        }}
                    />
                }
            />
            {/* buttons */}
            <FormRow
                content={
                    <ButtonsControls
                        isValid={selectIsValid}
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
