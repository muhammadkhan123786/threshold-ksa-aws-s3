import React, { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { useEditBankDataSchema } from 'schemas/player/useEditBankDataSchema';
import { useFetchAthleteDetailsById } from 'services/hooks';
import {
    useUpdatePlayerBankData,
    useCreatePlayerBankData,
} from 'services/hooks/players/useEditPlayerBankData';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { Bank } from 'schemas/athlete/addAtheleteBank';
import { InputController } from 'components/input';
import { SharedButton } from 'components/sharedButton';

interface EditPlayerBankDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditPlayerBankDataForm {
    iban: string;
    bank: any;
    accountHolder: string;
}

export const EditPlayerBankData: React.FC<EditPlayerBankDataModalProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const {
        params: { id },
    } = router.getState();

    const validationSchema = useEditBankDataSchema();
    const { data: athlete, refetch } = useFetchAthleteDetailsById(id);
    const methods = useForm<EditPlayerBankDataForm>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    });
    const { control, reset } = methods;
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: updateBankDataMutation } = useUpdatePlayerBankData(id || '');
    const { mutate: createBankDataMutation } = useCreatePlayerBankData(id || '');

    const bankOptions = useMemo(
        () => arrayToSelectOptions({ array: Bank, trans, transSuffix: 'bank.' }),
        [trans],
    );
    useEffect(() => {
        if (athlete) {
            const selectedBank = bankOptions.find(
                (option) => option.value === athlete?.bankDetails?.bank,
            );
            reset({
                iban: athlete?.bankDetails?.iban || '',
                bank: selectedBank?.value || null,
                accountHolder: athlete?.bankDetails?.accountHolder || '',
            });
        }
    }, [athlete, reset, bankOptions]);

    const handleSave: SubmitHandler<EditPlayerBankDataForm> = (data) => {
        setIsLoading(true);
        const mappedData: EditPlayerBankDataForm = {
            iban: data.iban,
            bank: data.bank.value || data.bank,
            accountHolder: data.accountHolder,
        };

        const isCreate = !athlete?.bankDetails;
        const mutation = isCreate ? createBankDataMutation : updateBankDataMutation;

        mutation(mappedData, {
            onSuccess: (response: any) => {
                const isSuccess = [200, 201].includes(response.status);
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: isSuccess ? 'success' : 'warning',
                            title: isSuccess ? trans('form.success') : trans('form.warning'),
                            subtitle: isSuccess
                                ? trans('player.bankDataUpdatedSuccess')
                                : response.message || trans('form.error_occurred'),
                        },
                    }),
                );
                if (isSuccess) {
                    refetch();
                    onClose();
                }
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
        setIsLoading(false);
    };

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
                            control={methods.control}
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={methods.control}
                                    placeholder={trans('player.Edit.iban')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.bank')} />
                        <Controller
                            name="bank"
                            control={methods.control}
                            render={({ field, fieldState }) => (
                                <MultiSelectController
                                    control={methods.control}
                                    name="bank"
                                    options={bankOptions}
                                    transSuffix="bank."
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.accountHolder')} />
                        <Controller
                            name="accountHolder"
                            control={methods.control}
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('player.Edit.accountHolder')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>
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
