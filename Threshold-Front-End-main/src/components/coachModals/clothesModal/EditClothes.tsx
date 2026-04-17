import React from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { useUpdatePlayerClothingData } from 'services/hooks/players/useEditPlayerClothes';
import { ClothingSize, ShoeSizes } from 'libs/enums/athlete';
import { useGetAthletes } from 'hooks';
import { useCreatePlayerClothingData } from 'services/hooks/players/useEditPlayerClothes';
import { useFetchAthleteDetailsById } from 'services/hooks';

interface EditClothesProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ClothingSizeOption {
    value: string;
    label: string;
}

interface EditClothesForm {
    tShirtSize: ClothingSizeOption;
    pantSize: ClothingSizeOption;
    shoeSize: ClothingSizeOption;
    driFitSize: ClothingSizeOption;
}

export const EditClothes: React.FC<EditClothesProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();

    const { data: athlete } = useGetAthletes<any>({
        id: id || '',
        idType: 'athlete',
        dependents: [modalContent],
    });
    const methods = useForm<EditClothesForm>({
        mode: 'all',
        defaultValues: {
            tShirtSize: athlete?.tShirtSize || { value: '', label: '' },
            pantSize: athlete?.pantSize || { value: '', label: '' },
            shoeSize: athlete?.shoeSize || { value: '', label: '' },
            driFitSize: athlete?.driFitSize || { value: '', label: '' },
        },
    });
    const { refetch } = useFetchAthleteDetailsById(id || '');
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

    const handleSave: SubmitHandler<EditClothesForm> = (data) => {
        const clothingData = {
            tShirtSize: data.tShirtSize.value,
            pantSize: data.pantSize.value,
            shoeSize: data.shoeSize.value,
            driFitSize: data.driFitSize.value,
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
                    {/* T-Shirt Size */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                            title={trans('label.tShirtSize')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control: methods.control,
                                        name: 'tShirtSize',
                                        options: arrayToSelectOptions({ array: ClothingSize }),
                                        menuPlacement: 'bottom',
                                    }}
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
                                    {...{
                                        control: methods.control,
                                        name: 'pantSize',
                                        options: arrayToSelectOptions({ array: ClothingSize }),
                                        menuPlacement: 'bottom',
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* Shoe Size */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                            title={trans('label.shoeSize')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control: methods.control,
                                        name: 'shoeSize',
                                        options: arrayToSelectOptions({ array: ShoeSizes }),
                                        menuPlacement: 'bottom',
                                    }}
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
                                    {...{
                                        control: methods.control,
                                        name: 'driFitSize',
                                        options: arrayToSelectOptions({ array: ClothingSize }),
                                        menuPlacement: 'bottom',
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <Theme.SubmitButton
                            type="button"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            <img
                                src="/assets/icons/add-icon-colored.svg"
                                height={20}
                                width={20}
                                alt="Save Icon"
                            />
                            {trans('player.Edit.saveClothingData')}
                        </Theme.SubmitButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
