import React, { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { ClothingSize, ShoeSizes } from 'libs/enums/athlete';
import { useFetchAthleteDetailsById } from 'services/hooks';
import {
    useUpdatePlayerClothingData,
    useCreatePlayerClothingData,
} from 'services/hooks/players/useEditPlayerClothes';
import { useUpdateClothingDataSchema } from 'schemas/player/useUpdateClothingDataSchema';
import { FormRow } from 'components/modal-windows/FormRow';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface EditClothesProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditClothesForm {
    tShirtSize: any;
    pantSize: any;
    shoeSize: any;
    driFitSize: any;
}

export const EditClothes: React.FC<EditClothesProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const {
        params: { id },
    } = router.getState();

    const validationSchema = useUpdateClothingDataSchema();
    const { data: athlete, refetch } = useFetchAthleteDetailsById(id || '');
    const methods = useForm<EditClothesForm>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    });

    const { control, reset } = methods;

    const { mutate: updatePlayerClothingData } = useUpdatePlayerClothingData(id, {
        onSuccess: (response) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('player.clothingDataUpdatedSuccess')
                            : response.message || trans('form.error_occurred'),
                    },
                }),
            );
            if (isSuccess) {
                refetch();
                onClose();
            }
        },
        onError: (error) => {
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

    const { mutate: createPlayerClothingData } = useCreatePlayerClothingData(id, {
        onSuccess: (response) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('player.clothingDataCreatedSuccess')
                            : response.message || trans('form.error_occurred'),
                    },
                }),
            );
            if (isSuccess) {
                onClose();
                setIsLoading(false);
            }
        },
        onError: (error) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message || trans('form.error_occurred'),
                    },
                }),
            );
            setIsLoading(false);
        },
    });

    // Pre-fill the form when athlete data is fetched
    useEffect(() => {
        if (athlete) {
            reset({
                tShirtSize: athlete?.athleteClothing?.tShirtSize || null,
                pantSize: athlete?.athleteClothing?.pantSize || null,
                shoeSize: athlete?.athleteClothing?.shoeSize || null,
                driFitSize: athlete?.athleteClothing?.driFitSize || null,
            });
        }
    }, [athlete, reset]);

    const handleSave: SubmitHandler<EditClothesForm> = (data) => {
        setIsLoading(true);
        const clothingData = {
            tShirtSize: data.tShirtSize?.value || data.tShirtSize,
            pantSize: data.pantSize?.value || data.pantSize,
            shoeSize: data.shoeSize?.value || data.shoeSize,
            driFitSize: data.driFitSize?.value || data.driFitSize,
        };

        const mutation = athlete?.athleteClothing
            ? updatePlayerClothingData
            : createPlayerClothingData;
        mutation(clothingData);
    };

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                title={trans('player.Edit.clothingData')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.EvenWrapper>
                        {/* T-Shirt Size */}
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                                title={trans('label.tShirtSize')}
                                content={
                                    <MultiSelectController
                                        control={control}
                                        name="tShirtSize"
                                        options={arrayToSelectOptions({ array: ClothingSize })}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>

                        {/* Pant Size */}
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                                title={trans('label.pantSize')}
                                content={
                                    <MultiSelectController
                                        control={control}
                                        name="pantSize"
                                        options={arrayToSelectOptions({ array: ClothingSize })}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.EvenWrapper>
                        {/* Shoe Size */}
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                                title={trans('label.shoeSize')}
                                content={
                                    <MultiSelectController
                                        control={control}
                                        name="shoeSize"
                                        options={arrayToSelectOptions({ array: ShoeSizes })}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>

                        {/* Dri-Fit Size */}
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                                title={trans('label.driFitSize')}
                                content={
                                    <MultiSelectController
                                        control={control}
                                        name="driFitSize"
                                        options={arrayToSelectOptions({ array: ClothingSize })}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>

                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton
                            variant="secondary"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            {isLoading ? (
                                <SaveLoaderButton spinnerColor="#C0D330" trackColor="#C0D330" />
                            ) : (
                                trans('form.save')
                            )}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
