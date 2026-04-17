import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { Body, Divider } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { InputController } from 'components/input';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import {
    useCreateClothingDataSchema,
    useUpdateClothingDataSchema,
} from 'schemas/athlete/addAtheleteBank'; // Adjust import as necessary
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateClothingData, useUpdateClothingData } from 'services/hooks';
import { setModalContent } from 'store/controlsSlice';
import { useQueryClient } from '@tanstack/react-query';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { ClothingSize, ShoeSizes } from 'libs/enums/athlete';

interface ClothingDataFormData {
    tShirtSize?: string;
    pantSize?: string;
    shoeSize?: string;
    driFitSize?: string;
}

interface ClothingDataFormProps {
    id?: string;
    defaultValues?: ClothingDataFormData;
    handleCancel: () => void;
    handleSave?: (data: ClothingDataFormData) => void;
}

export const ClothingDataForm: React.FC<
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
        handleCancel,
        handleSave,
        id: athleteId,
        setAthleteData,
    } = props;
    const dispatch = useDispatch();

    const createSchema = useCreateClothingDataSchema();
    const updateSchema = useUpdateClothingDataSchema();

    const {
        formState: { isValid },
        getValues,
        control,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(defaultValues ? updateSchema : createSchema),
        defaultValues: defaultValues || {},
    });

    const updateClothingDataMutation = useUpdateClothingData(athleteId);
    const createClothingDataMutation = useCreateClothingData(athleteId);
    const queryClient = useQueryClient();

    const handleFormSave = async () => {
        const formData: ClothingDataFormData = {
            tShirtSize: getValues('tShirtSize')?.value,
            pantSize: getValues('pantSize')?.value,
            shoeSize: getValues('shoeSize')?.value,
            driFitSize: getValues('driFitSize')?.value,
        };

        const mutation =
            defaultValues?.tShirtSize ||
            defaultValues?.pantSize ||
            defaultValues?.shoeSize ||
            defaultValues?.driFitSize
                ? updateClothingDataMutation
                : createClothingDataMutation;

        mutation.mutate(formData, {
            onSuccess: (response) => {
                const isSuccess = [201, 200].includes(response.status);
                queryClient.invalidateQueries({ queryKey: ['athleteDetails'] });

                dispatch(
                    setModalContent({
                        modalContent: {
                            type: isSuccess ? 'success' : 'warning',
                            title: isSuccess ? trans('form.success') : trans('form.warning'),
                            subtitle: isSuccess
                                ? defaultValues
                                    ? trans('clothing_data.updated_successfully')
                                    : trans('clothing_data.created_successfully')
                                : response.message || trans('form.error_occurred'),
                        },
                    }),
                );

                if (handleSave) {
                    handleSave(formData);
                }
            },
            onError: (error: Error) => {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: trans('form.warning'),
                            subtitle: error.message || trans('form.error_occurred'),
                        },
                    }),
                );
            },
        });
    };

    const selectIsValid = useMemo(
        () =>
            !!watch('tShirtSize') ||
            !!watch('pantSize') ||
            !!watch('shoeSize') ||
            !!watch('driFitSize'),
        [watch('tShirtSize'), watch('pantSize'), watch('shoeSize'), watch('driFitSize')],
    );

    return (
        <Body>
            <FormRow
                title={trans('athlete.tshirtSize')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'tShirtSize',
                            options: arrayToSelectOptions({ array: ClothingSize }),
                            // transSuffix: 'bank.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.pantSize')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'pantSize',
                            options: arrayToSelectOptions({ array: ClothingSize }),
                            // transSuffix: 'bank.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.shoesSize')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'shoeSize',
                            options: arrayToSelectOptions({ array: ShoeSizes }),
                            // transSuffix: 'bank.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.driFit')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'driFitSize',
                            options: arrayToSelectOptions({ array: ClothingSize }),
                            // transSuffix: 'bank.',
                            menuPlacement: 'top',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                content={
                    <ButtonsControls
                        isValid={selectIsValid}
                        handleSave={handleFormSave}
                        handleCancel={handleCancel}
                        saveText={isModal ? trans('form.save') : trans('home.contacts.submit')}
                        cancelText={isModal ? trans('form.cancel') : trans('form.cancel')}
                    />
                }
            />
        </Body>
    );
};
