import React, { useState, useEffect } from 'react';
import { SharedModal } from '../sharedModal';
import { WarningModal } from '../warningModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { Controller, useForm } from 'react-hook-form';
import { useFetchFieldsStockClothes } from 'services/hooks/clothe/useFetchFieldsStockClothes';
import { useEditCreateStockItems } from 'services/hooks/clothe/useEditCreateStockItems';
import { Loader } from 'components/loader';
import { LabelInput } from 'components/labelInput';
import { useFetchStockClothesStatus } from 'services/hooks/clothe/useFetchStockClothesStatus';
import { useRouter } from 'react-router5';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface SizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    athleteId: string;
    userDataRow: any;
}

interface StockDataItem {
    categoryId: string;
    size: string;
    quantity: number;
}

export const SizeModal: React.FC<SizeModalProps> = ({
    isOpen,
    onClose,
    athleteId,
    userDataRow,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { control, handleSubmit, reset, getValues } = useForm();
    const [isReordered, setIsReordered] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [userNameDeliverTo, setUserNameDeliverTo] = useState(userDataRow?.name);
    const { data, isLoading, isError } = useFetchFieldsStockClothes(athleteId);
    const [originalData, setOriginalData] = useState<any[]>([]);
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const { refetch } = useFetchStockClothesStatus(sportId, 1, 10);
    const { mutate: saveStockData } = useEditCreateStockItems({
        onSuccess: () => {
            refetch();
            reset();
            onClose();
        },
        onError: (error) => {
            onClose();
            console.error('Failed to update stock data:', error);
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
    useEffect(() => {
        if (data) {
            try {
                setOriginalData(data);
            } catch (error) {
                console.error('Error setting original data:', error);
            }
        }
    }, [data]);

    const handleSaveReorder = async (formData: any) => {
        setIsSaveLoading(true);
        try {
            const stockData: StockDataItem[] = Object.keys(formData)
                .map((categoryId) => {
                    const originalItem = originalData.find(
                        (item: any) => item.categoryId === categoryId,
                    );
                    const newQuantity = parseInt(formData[categoryId], 10) || 0;

                    if (originalItem && originalItem.quantity !== newQuantity) {
                        return {
                            categoryId,
                            size: originalItem.size,
                            quantity: newQuantity,
                        };
                    }

                    return null;
                })
                .filter((item): item is StockDataItem => item !== null);

            if (stockData.length === 0) {
                return;
            }

            await saveStockData({
                athleteId,
                stockData,
            });
            refetch();
            setIsReordered(false);
            setIsSaveLoading(false);
        } catch (error) {
            console.error('Error saving reorder:', error);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: trans('form.error_occurred'),
                    },
                }),
            );
            setIsSaveLoading(false);
        }
    };

    const handleModalClose = () => {
        try {
            if (isReordered) {
                setShowWarning(true);
            } else {
                onClose();
                reset();
            }
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (isError || (!data && data === undefined)) {
        return <></>;
    }

    return (
        <>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={handleModalClose}
                title={`${trans('deliver.to')}--${userDataRow?.name}`}
            >
                <Theme.LineHR />
                <Theme.Body onSubmit={handleSubmit(handleSaveReorder)}>
                    {data.map((item: any) => (
                        <Theme.InputsWrapper key={item.categoryId}>
                            <LabelInput label={`${item.categoryName}-${item.size}`} />
                            <Controller
                                name={item.categoryId}
                                control={control}
                                defaultValue={0}
                                render={({ field }) => {
                                    const matchingRequirement = userDataRow.requirements.find(
                                        (req: any) =>
                                            req.size === `${item.categoryName}: ${item.size}`,
                                    );
                                    return (
                                        <Theme.Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            max={
                                                matchingRequirement
                                                    ? matchingRequirement.shortage
                                                    : undefined
                                            }
                                            placeholder={`${item.categoryName}`}
                                        />
                                    );
                                }}
                            />
                        </Theme.InputsWrapper>
                    ))}
                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton type="button" onClick={handleSubmit(handleSaveReorder)}>
                            {isSaveLoading ? <SaveLoaderButton /> : trans('button.save')}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </>
    );
};
