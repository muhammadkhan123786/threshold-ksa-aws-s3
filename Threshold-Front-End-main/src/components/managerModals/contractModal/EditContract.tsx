import React, { useEffect, useState } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedButton } from 'components/sharedButton';
import { InputDateController } from 'components/inputDate';
import { useCreateContractCoachesSchema } from 'schemas/coaches/useCreateContractCoachesSchema';
import { useCreateManagerContract, useEditManagerContract } from 'services/hooks/managerDetails';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { InputPdfController } from 'components/inputFilesController';
import { ContractDuration, ContractStatus, ContractType } from 'libs/enums/contract';
import { useFetchManagerContractDetails } from 'services/hooks/managerDetails';

interface EditContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditContractForm {
    joinDate: any;
    type: any;
    contractDuration: any;
    status: any;
    contractFile?: any;
}

export const EditContract: React.FC<EditContactModalProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const {
        params: { academyId, id },
    } = router.getState();

    const { data: ContractData, refetch } = useFetchManagerContractDetails(academyId, id);
    const hasExistingContract = !!ContractData?.payload;
    const schema = useCreateContractCoachesSchema(hasExistingContract);
    const methods = useForm<EditContractForm>({
        mode: 'all',
        resolver: yupResolver(schema) as any,
    });
    console.log(ContractData, 'ContractData');
    const { control, reset } = methods;

    const { mutate: editManagerContract } = useEditManagerContract(academyId, id);
    const { mutate: createManagerContract } = useCreateManagerContract(academyId, id);

    const handleSave: SubmitHandler<EditContractForm> = async (data) => {
        setIsLoading(true);
        const contactData = {
            joinDate: data.joinDate.toISOString().replace('Z', '+02:00'),
            type: data.type?.value || data.type,
            contractDuration: data?.contractDuration?.value || data?.contractDuration,
            status: data?.status?.value || data.status,
            contractFile: data?.contractFile || null,
        };

        try {
            const mutation = ContractData?.payload ? editManagerContract : createManagerContract;

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
        if (ContractData?.payload) {
            const ContractTypeData = arrayToSelectOptions({
                array: ContractType,
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
                (option) => option.value === ContractData?.payload?.type,
            );
            const ContractDurationDataValue = ContractDurationData.find(
                (option) => option.value === ContractData?.payload?.contractDuration,
            );
            const ContractStatusDataValue = ContractStatusData.find(
                (option) => option.value === ContractData?.payload?.status,
            );
            methods.reset({
                joinDate: ContractData?.payload?.joinDate || '',
                type: ContractTypeDataValue?.value || '',
                contractDuration: ContractDurationDataValue?.value || '',
                status: ContractStatusDataValue?.value || '',
            });
        }
    }, [ContractData, reset]);

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                title={trans('form.editAthleteProfile.contract')}
                customHeight="100%"
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
                                                array: ContractType,
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
                        <SharedButton type="button" onClick={methods.handleSubmit(handleSave)}>
                            {isLoading ? <SaveLoaderButton /> : trans('button.save')}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
