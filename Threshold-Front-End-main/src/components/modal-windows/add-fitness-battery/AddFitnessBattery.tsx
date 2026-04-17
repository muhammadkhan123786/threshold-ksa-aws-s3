import React from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { InputDateController } from 'components/inputDate';
import { InputController } from 'components/input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import {
    ADD_FITNESS_BATTERY_DEFAULTS,
    useAddFitnessBatterySchema,
} from 'schemas/athlete/addFitnessBattery';
import { useDispatch } from 'react-redux';
import { athleteAPIs } from 'services/apis';
import { closeModal, setModalContent } from 'store/controlsSlice';
import { useQueryClient } from '@tanstack/react-query';

export const AddFitnessBattery: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { isModal, defaultValues, id: athleteId } = props;

    const addFitnessBatterySchema = useAddFitnessBatterySchema();
    const {
        formState: { isValid },
        control,
        getValues,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(addFitnessBatterySchema),
        defaultValues: defaultValues || ADD_FITNESS_BATTERY_DEFAULTS,
    });
    const queryClient = useQueryClient();

    const handleSave = async () => {
        try {
            const response = await dispatch(
                athleteAPIs.addAthleteBattery()({
                    ...getValues(),
                    athlete: athleteId,
                }),
            );

            const isSuccess = [201, 200].includes(response?.payload?.status);
            queryClient.invalidateQueries({ queryKey: ['fitnessData'] });

            dispatch(
                setModalContent({
                    modalContent: {
                        type: isSuccess ? 'success' : 'warning',
                        title: isSuccess ? 'Success' : 'Warning',
                        subtitle: isSuccess
                            ? 'Athlete data has been added'
                            : response?.payload?.payload?.message,
                    },
                }),
            );

            setTimeout(() => {
                dispatch(closeModal());
            }, 3000);
        } catch (error) {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Error occurred',
                        subtitle: '',
                    },
                }),
            );
        }
    };

    return (
        <Body>
            <FormRow
                title={trans('form.addFitnessBattery.date')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'date',
                            withPortal: !isModal,
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addFitnessBattery.curl')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'curl',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addFitnessBattery.push')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'push',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addFitnessBattery.trunk')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'trunk',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addFitnessBattery.sit')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'sit',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addFitnessBattery.pacer')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'pacer',
                        }}
                    />
                }
            />
            <Divider />
            {/* buttons */}
            <FormRow content={<ButtonsControls isValid={isValid} handleSave={handleSave} />} />
        </Body>
    );
};
