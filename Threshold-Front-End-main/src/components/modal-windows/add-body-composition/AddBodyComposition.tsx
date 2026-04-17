import React from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { InputDateController } from 'components/inputDate';
import { InputController } from 'components/input';
import { useForm } from 'react-hook-form';
import { ADD_BODY_COMPOSITION_DEFAULTS, useAddBodyCompositionSchema } from 'schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { useDispatch, useSelector } from 'react-redux';
import { calculateBmi, calculateYearsDifference } from 'libs/helpers';
import { selectAcademy } from 'store';
import { closeModal, setModalContent } from 'store/controlsSlice';
import { athleteAPIs } from 'services/apis';
import { Gender } from 'libs/enums';
import { useQueryClient } from '@tanstack/react-query';

export const AddBodyComposition: React.FC<
    FormWindowProps & FormControlsProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const { isModal, defaultValues } = props;
    const dispatch = useDispatch();
    const { currentAthlete } = useSelector(selectAcademy);
    const addBodyCompositionSchema = useAddBodyCompositionSchema();
    const {
        formState: { isValid },
        control,
        getValues,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(addBodyCompositionSchema),
        defaultValues: defaultValues || ADD_BODY_COMPOSITION_DEFAULTS,
    });
    const queryClient = useQueryClient();

    const handleSave = async () => {
        try {
            const { status, bmi, bmiPercentile } = calculateBmi({
                weight: Number(watch('weight')),
                height: Number(watch('height')),
                age: calculateYearsDifference(
                    new Date(),
                    new Date(currentAthlete?.dateOfBirth || ''),
                ),
                gender: currentAthlete?.gender || Gender.MALE,
            });

            const response = await dispatch(
                athleteAPIs.addAthleteBiometric()({
                    ...getValues(),
                    bmi: bmi.toString(),
                    bmiPercentile: bmiPercentile.toString(),
                    status,
                    athlete: currentAthlete.id,
                }),
            );

            const isSuccess = [201, 200].includes(response?.payload?.status);
            queryClient.invalidateQueries({ queryKey: ['bodyComposition'] });

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

            return response;
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
            return error;
        }
    };

    return (
        <Body>
            <FormRow
                title={trans('form.addBodyComposition.date')}
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
                title={trans('form.addBodyComposition.weight')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'weight',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addBodyComposition.height')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'height',
                        }}
                    />
                }
            />
            {/* buttons */}
            <FormRow content={<ButtonsControls isValid={isValid} handleSave={handleSave} />} />
        </Body>
    );
};
