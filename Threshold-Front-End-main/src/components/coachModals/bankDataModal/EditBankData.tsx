import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { Divider } from 'components/modal-windows';
import { arrayToSelectOptions } from 'libs/helpers';
import { Bank, useCreateBankDataSchema } from 'schemas/athlete/addAtheleteBank';
import { useFetchCoachDetailsById, useUpdateCoachBankData } from 'services/hooks/coachDetails';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { mappingOptionsToValues } from 'libs/helpers/selectionHelpers';
import { useBankDataSchema } from 'schemas';
import { SharedButton } from 'components/sharedButton';

interface EditBankDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditPLayerBankDataForm {
    iban: string;
    bank: any;
    accountHolder: string;
}

export const EditBankData: React.FC<EditBankDataModalProps> = ({
    isOpen,
    onClose,
    // coachDetails,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const {
        params: { sportId, id },
    } = router.getState();

    const validationSchema = useBankDataSchema();
    const { data, refetch } = useFetchCoachDetailsById(sportId, id);

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    });
    const { control, reset } = methods;

    const { mutate } = useUpdateCoachBankData(sportId, id, {
        onSuccess: (response: any) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: isSuccess ? trans('form.success') : trans('form.warning'),
                        subtitle: isSuccess
                            ? trans('player.bankDataUpdatedSuccess')
                            : response.message || trans('form.error_occurred'),
                    },
                }),
            );

            refetch();
            onClose();
            setIsLoading(false);
        },
        onError: (error: Error) => {
            setIsLoading(false);
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

    const handleSave: SubmitHandler<EditPLayerBankDataForm> = (_data) => {
        setIsLoading(true);
        const mappedData: EditPLayerBankDataForm = {
            iban: _data.iban,
            bank: _data.bank.value,
            accountHolder: _data.accountHolder,
        };
        mutate(mappedData);
    };

    useEffect(() => {
        if (data) {
            const bankOptions = arrayToSelectOptions({
                array: Bank,
                isEnum: true,
                trans: trans,
                transSuffix: 'bank.',
            });

            const selectedBank: any = bankOptions.find(
                (option) => option.value === data?.bankDetails?.bank,
            );

            reset({
                iban: data?.bankDetails?.iban || '',
                bank: selectedBank?.value || null,
                accountHolder: data?.bankDetails?.accountHolder || '',
            });
            methods.clearErrors();
        }
    }, [data, reset]);

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                title={trans('player.Edit.bankData')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.iban')} />
                        <Controller
                            name="iban"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Theme.Input
                                        {...field}
                                        placeholder={trans('player.Edit.iban')}
                                    />
                                    {fieldState.error && (
                                        <span style={{ color: 'red' }}>
                                            {fieldState.error.message}
                                        </span>
                                    )}
                                </>
                            )}
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('player.Edit.bank')}
                            content={
                                <MultiSelectController
                                    control={control}
                                    name="bank"
                                    options={arrayToSelectOptions({ array: Bank })}
                                    transSuffix="bank."
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.accountHolder')} />
                        <Controller
                            name="accountHolder"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Theme.Input
                                        {...field}
                                        placeholder={trans('player.Edit.accountHolder')}
                                    />
                                    {fieldState.error && (
                                        <span style={{ color: 'red' }}>
                                            {fieldState.error.message}
                                        </span>
                                    )}
                                </>
                            )}
                        />
                    </Theme.InputsWrapper>
                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        {/* <SharedButton
                            variant="secondary"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            <>
                                {isLoading ? (
                                    <SaveLoaderButton
                                        spinnerColor="#C0D330"
                                        trackColor={'#C0D330'}
                                    />
                                ) : (
                                    <>
                                        <img
                                            src="/assets/icons/add-icon-colored.svg"
                                            height={20}
                                            width={20}
                                            alt="Save Icon"
                                        />
                                        {trans('form.save')}
                                    </>
                                )}
                            </>
                        </SharedButton> */}
                        <SharedButton type="button" onClick={methods.handleSubmit(handleSave)}>
                            {isLoading ? <SaveLoaderButton /> : trans('button.save')}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
