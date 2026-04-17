import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { arrayToSelectOptions } from 'libs/helpers';
import { Relationship } from 'libs/enums';
import { InputDateController } from 'components/inputDate';
import { useFetchContactInfoById, useUpdateContact } from 'services/hooks/managerDetails';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContactSchema } from 'schemas';
import { InputController } from 'components/input';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { SharedButton } from 'components/sharedButton';

interface EditContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactInfo: any;
}

interface EditContactForm {
    nationalId: string;
    nationalIdExpiration: string;
    phone: string;
    emergencyPhone: string;
    relationship: any;
}

export const EditContact: React.FC<EditContactModalProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { modalContent } = useSelector(selectControls);
    const {
        params: { academyId, id },
    } = router.getState();

    const methods = useForm<EditContactForm>({
        mode: 'all',
        resolver: yupResolver(useContactSchema()) as any,
    });
    const { control, reset } = methods;
    const { data, refetch } = useFetchContactInfoById(academyId, id);
    const { mutate } = useUpdateContact(academyId, id, {
        onSuccess: (response) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('player.contactDataUpdatedSuccess')
                            : response.message || trans('form.error_occurred'),
                    },
                }),
            );
            onClose();
            refetch();
            setIsLoading(false);
        },
        onError: (error) => {
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

    const handleSave: SubmitHandler<EditContactForm> = (_data) => {
        setIsLoading(true);
        const contactData = {
            nationalId: _data.nationalId,
            nationalIdExpiration: _data.nationalIdExpiration,
            phone: _data.phone,
            emergencyPhone: _data.emergencyPhone,
            relationship: _data.relationship?.value || _data.relationship,
        };
        mutate(contactData);
    };

    useEffect(() => {
        if (data) {
            const relationshipOptions = arrayToSelectOptions({
                array: Relationship,
                isEnum: true,
                trans: trans,
                transSuffix: 'form.editAthleteProfile.',
            });

            const selectedRelationshipOptions = relationshipOptions.find(
                (option) => option.value === data?.payload?.relationship,
            );

            reset({
                nationalId: data?.payload?.nationalId || '',
                nationalIdExpiration: data?.payload?.nationalIdExpirationDate || '',
                phone: data?.payload?.phone || '',
                emergencyPhone: data?.payload?.emergencyPhone || '',
                relationship: selectedRelationshipOptions?.value || undefined,
            });
        }
    }, [data, reset, trans]);
    useEffect(() => {
        if (isOpen) {
            // methods.reset();
            methods.clearErrors();
        }
    }, [isOpen, methods]);
    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                customHeight="100%"
                title={trans('player.Edit.contactData')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    {/* Phone Number Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('coach.profile.Edit.phoneNumber')} />
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputController
                                        {...field}
                                        control={control}
                                        placeholder={trans('coach.profile.Edit.phoneNumber')}
                                    />
                                </>
                            )}
                        />
                    </Theme.InputsWrapper>
                    <Theme.EvenWrapper>
                        {/* Emergency Phone Number Input */}
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('coach.profile.Edit.urgentPhoneNumber')} />
                            <Controller
                                name="emergencyPhone"
                                control={methods.control}
                                render={({ field }) => (
                                    <InputController
                                        {...field}
                                        control={methods.control}
                                        placeholder={trans('coach.profile.Edit.urgentPhoneNumber')}
                                    />
                                )}
                            />
                        </Theme.InputsWrapper>
                        {/* relationship */}
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.contactRelationship')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'relationship',
                                            options: arrayToSelectOptions({ array: Relationship }),
                                            transSuffix: 'form.editAthleteProfile.',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>

                    <Theme.EvenWrapper>
                        {/* National Id Number Input */}
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('coach.profile.Edit.nationalId')} />
                            <Controller
                                name="nationalId"
                                control={methods.control}
                                render={({ field }) => (
                                    <InputController
                                        {...field}
                                        control={methods.control}
                                        placeholder={trans('coach.profile.Edit.nationalId')}
                                    />
                                )}
                            />
                        </Theme.InputsWrapper>

                        {/* National Id Expiration Date Input */}
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('coach.profile.Edit.nationalIdExpiration')} />
                            <Controller
                                name="nationalIdExpiration"
                                control={methods.control}
                                render={({ field }) => (
                                    <InputDateController
                                        {...field}
                                        control={methods.control}
                                        placeholder={trans(
                                            'coach.profile.Edit.nationalIdExpiration',
                                        )}
                                    />
                                )}
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>

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
