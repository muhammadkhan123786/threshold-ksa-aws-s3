import React, { Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import { useLocales } from 'hooks/locales';
import { Body, Divider } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { InputController } from 'components/input';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { useCreateBankDataSchema, useUpdateBankDataSchema } from 'schemas';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateBankData, useUpdateBankData } from 'services/hooks';
import { setModalContent } from 'store/controlsSlice';
import { useQueryClient } from '@tanstack/react-query';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { Bank } from 'schemas/athlete/addAtheleteBank';

interface BankDataFormData {
    iban: string;
    bank: string;
    accountHolder: string;
}

interface BankDataFormProps {
    id?: string;
    defaultValues?: BankDataFormData;
    handleCancel: () => void;
    handleSave?: (data: BankDataFormData) => void;
}

export const BankDataForm: React.FC<
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

    const createSchema = useCreateBankDataSchema();
    const updateSchema = useUpdateBankDataSchema();

    const {
        formState: { isValid, touchedFields },
        getValues,
        control,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(defaultValues ? updateSchema : createSchema),
        defaultValues: defaultValues || {},
    });

    const updateBankDataMutation = useUpdateBankData(athleteId);
    const createBankDataMutation = useCreateBankData(athleteId);
    const queryClient = useQueryClient();
    const handleFormSave = async () => {
        const formData: BankDataFormData = {
            iban: getValues('iban'),
            bank: getValues('bank')?.value,
            accountHolder: getValues('accountHolder'),
        };

        const mutation = defaultValues?.iban ? updateBankDataMutation : createBankDataMutation;

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
                                    ? trans('bank_data.updated_successfully')
                                    : trans('bank_data.created_successfully')
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
        () => !!watch('iban') && !!watch('bank') && !!watch('accountHolder'),
        [watch('iban'), watch('bank'), watch('accountHolder')],
    );

    return (
        <Body>
            <FormRow
                title={trans('athlete.ibanNumber')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'iban',
                            placeholder: trans('athlete.ibanNumber'),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('athlete.bankName')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'bank',
                            options: arrayToSelectOptions({ array: Bank }),
                            transSuffix: 'bank.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.accountOwner')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'accountHolder',
                            placeholder: trans('athlete.EnteraccountOwner'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid && selectIsValid}
                        handleSave={handleFormSave}
                        handleCancel={handleCancel}
                        saveText={isModal ? trans('form.save') : trans('form.save')}
                        cancelText={isModal ? trans('form.cancel') : trans('form.cancel')}
                    />
                }
            />
        </Body>
    );
};
