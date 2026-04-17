/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from 'react';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { AddSizeModal } from './modals';
import { LabelInput } from 'components/labelInput';
import { useFetchSizeClothes } from 'services/hooks/clothe/useFetchSizeClothes';
import { useAddStockClothes } from 'services/hooks/clothe/useAddStockClothes';
import { useUpdateStockClothes } from 'services/hooks/clothe/useUpdateStockClothes';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import { SizeInputGroup } from './componants/SizeInputGroup';
import { useRouter } from 'react-router5';
import { useFetchStockClothes } from 'services/hooks/clothe/useFetchStockClothes';
import { ToggleSwitch } from 'components/toggleSwitch';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface StockSizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    dataFromTable: any;
}

interface SizeOption {
    size: string;
    quantity: number;
}

interface FinalData {
    sportId: string;
    categoryId: string;
    measurementUnit: any;
    sizeOptions: SizeOption[];
}

function reverseFieldName(sanitizedName: string): string {
    return sanitizedName.replace(/_/g, ' ').replace(/p/g, '.');
}

export const StockSizeModal: React.FC<StockSizeModalProps> = ({
    isOpen,
    onClose,
    dataFromTable,
}) => {
    const { trans, isRTL } = useLocales();
    const dispatch = useDispatch();
    const [usEuDataFillter, setUsEuDataFillter] = useState<'US' | 'EU'>('US');
    const [dataToRender, setDataToRender] = useState();
    const [usSizeOptions, setUsSizeOptions] = useState([]);
    const [euSizeOptions, setEuSizeOptions] = useState([]);
    const [editOrAdd, setEditOrAdd] = useState('');
    const [activeTab, setActiveTab] = useState<null | string>(null);
    const [isAddSizeModalOpen, setIsAddSizeModalOpen] = useState(false);
    const [selectedSizeUnit, setSelectedSizeUnit] = useState<'US' | 'EU'>('EU');
    const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
    const [dataCategory, setDataCategory] = useState();
    const [categoryId, setCategoryId] = useState<string>('');
    const methods = useForm({
        mode: 'all',
    });
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const { data } = useFetchSizeClothes(sportId);
    const { refetch } = useFetchStockClothes(sportId, 1, 10);
    const addStockClothesMutation = useAddStockClothes();
    const updateStockClothesMutation = useUpdateStockClothes();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (dataFromTable?.id) {
            setEditOrAdd('edit');
            setActiveTab(dataFromTable.category.id);
            setDataCategory(dataFromTable?.category?.id);
        } else {
            setEditOrAdd('add');
            setActiveTab(null);
        }
    }, [dataFromTable]);

    useEffect(() => {
        if (dataFromTable?.sizeOptions) {
            const defaultValues = dataFromTable.sizeOptions.reduce(
                (acc: Record<string, any>, sizeOption: any) => {
                    acc[`${activeTab}-${sizeOption.size}`] = sizeOption.requiredQuantity;
                    return acc;
                },
                {},
            );
            methods.reset(defaultValues);
        }
    }, [dataFromTable, activeTab]);

    const handleTabSelect = (selectedCategoryId: string) => {
        setActiveTab(selectedCategoryId);
        setCategoryId(selectedCategoryId);
        methods.reset();
    };

    const handleSave: SubmitHandler<any> = async (formData) => {
        setIsLoading(true);
        const transformedSizeOptions = Object.entries(formData)
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => {
                const originalSize = reverseFieldName(key);
                return {
                    size: originalSize,
                    quantity: Number(value),
                };
            });

        const finalData: FinalData = {
            sportId: sportId,
            categoryId: activeTab as string,
            measurementUnit: selectedSizeUnit,
            sizeOptions: transformedSizeOptions,
        };

        if (!finalData.categoryId) {
            return;
        }
        const categoryData = data?.find((option: any) => option?.id === finalData.categoryId);
        if (!categoryData) {
            return;
        }

        try {
            let response;
            if (editOrAdd === 'add') {
                response = await addStockClothesMutation.mutateAsync(finalData);
            } else {
                const patchData = {
                    id: dataFromTable.id,
                    data: finalData,
                };
                response = await updateStockClothesMutation.mutateAsync(patchData);
            }
            const isSuccess = [201, 200].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans(
                                  editOrAdd === 'add'
                                      ? 'clothes.stock_added_successfully'
                                      : 'clothes.stock_updated_successfully',
                              )
                            : response.message || trans('form.error_occurred'),
                        redirect: {
                            path: 'home',
                            condition: isSuccess,
                        },
                    },
                }),
            );
            refetch();
            methods.reset();
            setActiveTab(null);
            setSelectedSizeUnit('EU');
            setIsLoading(false);
            onClose();
        } catch (err: any) {
            console.error('Error while sending data:', err);

            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: err.message || trans('form.error_occurred'),
                    },
                }),
            );
            handleCloseModal();
            onClose();
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        methods.reset();
        setActiveTab(null);
        setSelectedSizeUnit('EU');
        onClose();
    };

    const openAddSizeModal = () => {
        setIsAddSizeModalOpen(true); // Open the AddSizeModal without closing the StockSizeModal
    };

    const closeAddSizeModal = () => {
        setIsAddSizeModalOpen(false); // Close the AddSizeModal
    };

    const updateSizeOptions = (size: string, quantity: number) => {
        setSizeOptions((prev) => {
            const existingIndex = prev.findIndex((option) => option?.size === size);
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = { size, quantity };
                return updated;
            } else {
                return [...prev, { size, quantity }];
            }
        });
    };

    const selectedCategory = data?.find((option: any) => option?.id === activeTab);
    const shouldSetCustomHeight = selectedCategory?.sizeOptions?.length > 5;

    useEffect(() => {
        if (selectedCategory) {
            switch (selectedCategory.categoryName) {
                case 'Shoes':
                    const filteredUSData = selectedCategory.sizeOptions.filter((option: any) =>
                        option.size.includes('US'),
                    );
                    const filteredEUData = selectedCategory.sizeOptions.filter((option: any) =>
                        option.size.includes('EU'),
                    );
                    setUsSizeOptions(filteredUSData);
                    setEuSizeOptions(filteredEUData);
                    break;
                default:
                    setUsSizeOptions(selectedCategory.sizeOptions);
                    setEuSizeOptions(selectedCategory.sizeOptions);
                    break;
            }
        }
    }, [usEuDataFillter, selectedCategory]);

    const handleChangeTypeShose = () => {
        setUsEuDataFillter((prev) => (prev === 'US' ? 'EU' : 'US'));
    };

    const getSizeOptionsToRender = () => {
        return usEuDataFillter === 'US' ? usSizeOptions : euSizeOptions;
    };

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={handleCloseModal}
                title={trans(`modal.${editOrAdd}.clothes`)}
                customHeight={shouldSetCustomHeight ? '100%' : undefined}
            >
                <AddSizeModal
                    isOpen={isAddSizeModalOpen}
                    onCloseSize={closeAddSizeModal}
                    dataFromTable={dataCategory}
                    categoryId={categoryId}
                />
                <Theme.LineHR />
                <Theme.TabsWrapper>
                    <Theme.SelectWrapper>
                        <LabelInput label={trans('label.select.type')} />
                        <Theme.SelectInput
                            value={activeTab || ''}
                            onChange={(e) => handleTabSelect(e.target.value)}
                        >
                            <option value="" disabled>
                                {trans('clothes.select.type')}
                            </option>
                            {data?.map((option: any) => (
                                <option key={option?.id} value={option?.id}>
                                    {trans(`row.category.${option?.categoryName}`)}
                                </option>
                            ))}
                        </Theme.SelectInput>
                    </Theme.SelectWrapper>
                </Theme.TabsWrapper>

                <Theme.Body>
                    {activeTab && selectedCategory && (
                        <>
                            {selectedCategory.categoryName === 'Shoes' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <button
                                        type="button"
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor:
                                                usEuDataFillter === 'US' ? '#c0d330' : '#f0f0f0',
                                            color: usEuDataFillter === 'US' ? '#fff' : '#000',
                                            border: '1px solid #ccc',
                                            borderRadius:
                                                isRTL === true
                                                    ? '0px 12px 12px 0px'
                                                    : '12px 0px 0px 12px',
                                            cursor: 'pointer',
                                            outline: 'none',
                                        }}
                                        onClick={() => setUsEuDataFillter('US')}
                                    >
                                        <span
                                            style={{
                                                fontWeight: '600',
                                                opacity: 0.7,
                                            }}
                                        >
                                            US
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor:
                                                usEuDataFillter === 'EU' ? '#c0d330' : '#f0f0f0',
                                            color: usEuDataFillter === 'EU' ? '#fff' : '#000',
                                            border: '1px solid #ccc',
                                            borderRadius:
                                                isRTL === false
                                                    ? '0px 12px 12px 0px'
                                                    : '12px 0px 0px 12px',
                                            cursor: 'pointer',
                                            outline: 'none',
                                        }}
                                        onClick={() => setUsEuDataFillter('EU')}
                                    >
                                        <span
                                            style={{
                                                fontWeight: '600',
                                                opacity: 0.7,
                                            }}
                                        >
                                            EU
                                        </span>
                                    </button>
                                </div>
                            )}
                            <SizeInputGroup
                                key={selectedCategory?.id}
                                selectedOption={{
                                    ...selectedCategory,
                                    sizeOptions: getSizeOptionsToRender(),
                                }}
                                selectedSizeUnit={selectedSizeUnit}
                                dataFromTable={dataFromTable}
                                activeTab={activeTab}
                                trans={trans}
                                onSizeChange={updateSizeOptions}
                            />
                        </>
                    )}

                    {activeTab && (
                        <Theme.ParaButtonDiv>
                            <Theme.ParaButton type="button" onClick={openAddSizeModal}>
                                {trans('add.new.size')}
                            </Theme.ParaButton>
                        </Theme.ParaButtonDiv>
                    )}

                    <Theme.LineHR />
                </Theme.Body>
                <Theme.FooterButtonsWrapper>
                    {activeTab && (
                        // <SharedButton onClick={methods.handleSubmit(handleSave)}>
                        //     <img
                        //         src="/assets/icons/save-icon.svg"
                        //         height={20}
                        //         width={20}
                        //         alt="Save Icon"
                        //     />
                        //     {trans('clothes.save.modal')}
                        // </SharedButton>
                        <SharedButton type="button" onClick={methods.handleSubmit(handleSave)}>
                            {isLoading ? <SaveLoaderButton /> : trans('clothes.save.modal')}
                        </SharedButton>
                    )}
                </Theme.FooterButtonsWrapper>
            </SharedModal>
        </FormProvider>
    );
};
