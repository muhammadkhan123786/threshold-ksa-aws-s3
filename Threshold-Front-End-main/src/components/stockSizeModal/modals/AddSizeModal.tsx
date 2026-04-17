import React from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useAddStockSizeClothe } from '../../../services/hooks/clothe/useAddStockSizeClothe';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'react-router5';
import { useFetchSizeClothes } from 'services/hooks/clothe/useFetchSizeClothes';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddNewSizeSchema } from 'schemas/clothes/useAddNewSizeSchema';
import { InputController } from 'components/input';
import { LabelInput } from 'components/labelInput';
import { SharedButton } from 'components/sharedButton';
import { extractErrorMessage } from 'services/clients/middleware/extractErrorMessage';

interface AddSizeModalProps {
    isOpen: boolean;
    onCloseSize: () => void;
    dataFromTable: any;
    categoryId: string;
}

interface AddSizeFormData {
    newSize: string;
    requiredQuantity: number | null;
}

export const AddSizeModal: React.FC<AddSizeModalProps> = ({
    isOpen,
    onCloseSize,
    dataFromTable,
    categoryId,
}) => {
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const schema = useAddNewSizeSchema();
    const { refetch } = useFetchSizeClothes(sportId);
    const { trans } = useLocales();
    const methods = useForm<AddSizeFormData>({
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const addStockSizeMutation = useAddStockSizeClothe();
    const handleSave: SubmitHandler<AddSizeFormData> = async (data) => {
        try {
            const formData = {
                categoryId: dataFromTable || categoryId,
                size: data.newSize,
                requiredQuantity: 1,
            };
            await addStockSizeMutation.mutateAsync(formData);
            toast.success(trans('size.size_added_successfully'), {
                autoClose: 1500,
                onClose: () => {
                    onCloseSize();
                },
            });
            methods.reset();
            refetch();
        } catch (error: any) {
            // const errorMessage = extractErrorMessage(error);
            methods.setError('newSize', {
                type: 'manual',
                message: trans('size.already.exists'),
            });
            // toast.error(errorMessage, {
            //     autoClose: 3000,
            // });
        }
    };

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onCloseSize}
                title={trans('add.new.size.modal')}
            >
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('clothes.modal.enter.size')} />
                        <Controller
                            control={methods.control}
                            name="newSize"
                            render={({ field }) => (
                                <>
                                    <InputController
                                        {...field}
                                        control={methods.control}
                                        placeholder={trans('clothes.modal.ex.size')}
                                    />
                                </>
                            )}
                        />
                    </Theme.InputsWrapper>
                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton
                            variant="secondary"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            <img
                                src="/assets/icons/add-icon-colored.svg"
                                height={20}
                                width={20}
                                alt="Save Icon"
                            />
                            {trans('modal.add.size')}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
