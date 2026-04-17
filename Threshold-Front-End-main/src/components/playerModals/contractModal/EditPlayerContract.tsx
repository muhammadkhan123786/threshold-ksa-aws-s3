import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { addMonths, arrayToSelectOptions } from 'libs/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedButton } from 'components/sharedButton';
import { InputDateController } from 'components/inputDate';
import { useCreateContractPlayerSchema } from 'schemas/player/useCreateContractPlayerSchema';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { ContractDuration, ContractStatus, ContractTypePlayer } from 'libs/enums/contract';
import { InputPdfController } from 'components/inputFilesController';
import {
    useCreatePlayerContract,
    useEditPlayerContract,
} from 'services/hooks/players/useEditOrCreatePlayerContract';
import { useFetchPlayerContractDetails } from 'services/hooks/players/useFetchPlayerContractDetails';

interface EditPlayerContractModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditPlayerContractForm {
    joinDate: any;
    type: any;
    contractDuration: any;
    status: any;
    contractFile?: any;
}

export const EditPlayerContract: React.FC<EditPlayerContractModalProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [contractSelect, setContractSelect] = useState(true);
    const { modalContent } = useSelector(selectControls);
    const {
        params: { sportId, id },
    } = router.getState();

    const { data: PlayerContractData, refetch } = useFetchPlayerContractDetails(id);
    const schema = useCreateContractPlayerSchema();
    const methods = useForm<EditPlayerContractForm>({ mode: 'all', resolver: yupResolver(schema) });

    const { control, reset, watch } = methods;
    const contractTag = watch('type');
    useEffect(() => {
        if (watch('type')?.value === 'Full-Time') {
            setContractSelect(true);
        } else {
            setContractSelect(false);
        }
    }, [contractTag]);
    const { mutate: editPlayerContract } = useEditPlayerContract(id);
    const { mutate: createPlayerContract } = useCreatePlayerContract(id);
    const handleSave: SubmitHandler<EditPlayerContractForm> = async (data) => {
        setIsLoading(true);
        const contactData = {
            joinDate: data?.joinDate.toISOString().replace('Z', '+02:00'),
            type: data.type?.value || data?.type,
            contractDuration: data?.contractDuration?.value || data?.contractDuration,
            status: data?.status?.value || data?.status,
            contractFile: data?.contractFile,
        };

        try {
            const mutation = PlayerContractData?.payload
                ? editPlayerContract
                : createPlayerContract;
            // const mutation = createPlayerContract;

            await mutation(contactData, {
                onSuccess: (response) => {
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'success',
                                title: trans('form.success'),
                                subtitle: trans('player.contactDataCreatedSuccess'),
                            },
                        }),
                    );
                    refetch();
                    onClose();
                },
                onError: (error: any) => {
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'warning',
                                title: trans('form.warning'),
                                subtitle: error.message || trans('form.somethingWentWrong'),
                            },
                        }),
                    );
                },
                onSettled: () => {
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error('Error submitting contract:', error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (PlayerContractData?.payload) {
            const ContractTypeData = arrayToSelectOptions({
                array: ContractTypePlayer,
                isEnum: true,
                trans: trans,
                transSuffix: 'form.subscriptionManagement.periodSubscription.',
            });
            const ContractDurationData = arrayToSelectOptions({
                array: ContractDuration,
                isEnum: true,
                trans: trans,
                transSuffix: 'form.subscriptionManagement.periodSubscription.',
            });
            const ContractStatusData = arrayToSelectOptions({
                array: ContractStatus,
                isEnum: true,
                trans: trans,
                transSuffix: 'form.subscriptionManagement.periodSubscription.',
            });
            const ContractTypeDataValue = ContractTypeData.find(
                (option) => option.value === PlayerContractData?.payload?.type,
            );
            const ContractDurationDataValue = ContractDurationData.find(
                (option) => option.value === PlayerContractData?.payload?.contractDuration,
            );
            const ContractStatusDataValue = ContractStatusData.find(
                (option) => option.value === PlayerContractData?.payload?.status,
            );
            methods.reset({
                joinDate: PlayerContractData?.payload?.joinDate || '',
                type: ContractTypeDataValue?.value || '',
                contractDuration: ContractDurationDataValue?.value || '',
                status: ContractStatusDataValue?.value || '',
            });
        }
    }, [PlayerContractData, reset]);
    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                title={trans('form.editAthleteProfile.contract')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.EvenWrapper>
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{ display: 'block', color: '#7d7d7d' }}
                                title={trans('player.Edit.joinDate')}
                                content={
                                    <Controller
                                        name="joinDate"
                                        control={control}
                                        render={({ field }) => (
                                            <InputDateController {...field} control={control} />
                                        )}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.contractType')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'type',
                                            options: arrayToSelectOptions({
                                                array: ContractTypePlayer,
                                            }),
                                            transSuffix:
                                                'form.subscriptionManagement.plyercontract.',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>
                    {contractSelect && (
                        <Theme.EvenWrapper>
                            <Theme.InputsWrapper>
                                <FormRow
                                    style={{
                                        fontSize: '14px',
                                        color: '#777777',
                                        display: 'block',
                                    }}
                                    title={trans('label.contractDuration')}
                                    content={
                                        <MultiSelectController
                                            {...{
                                                control,
                                                name: 'contractDuration',
                                                options: arrayToSelectOptions({
                                                    array: ContractDuration,
                                                }),
                                                transSuffix:
                                                    'form.subscriptionManagement.periodSubscription.',
                                                menuPlacement: 'bottom',
                                            }}
                                        />
                                    }
                                />
                            </Theme.InputsWrapper>
                            <Theme.InputsWrapper>
                                <FormRow
                                    style={{
                                        fontSize: '14px',
                                        color: '#777777',
                                        display: 'block',
                                    }}
                                    title={trans('label.ContractStatus')}
                                    content={
                                        <MultiSelectController
                                            {...{
                                                control,
                                                name: 'status',
                                                options: arrayToSelectOptions({
                                                    array: ContractStatus,
                                                }),
                                                transSuffix:
                                                    'form.subscriptionManagement.periodSubscription.',
                                                menuPlacement: 'bottom',
                                            }}
                                        />
                                    }
                                />
                            </Theme.InputsWrapper>
                        </Theme.EvenWrapper>
                    )}
                    <Theme.InputsWrapper>
                        <InputPdfController
                            name="contractFile"
                            control={methods.control}
                            contents={
                                <Theme.UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>
                                    {trans('form.editAthleteProfile.uploadText2')}
                                    <br />
                                    {trans('form.editAthleteProfile.uploadText4')}
                                </Theme.UploadText>
                            }
                        />
                    </Theme.InputsWrapper>

                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton
                            variant="secondary"
                            onClick={() => {
                                methods.handleSubmit(handleSave)();
                            }}
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
