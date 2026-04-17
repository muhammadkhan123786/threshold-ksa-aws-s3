import React, { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { Divider } from 'components/modal-windows';
import { useGetAthletes } from 'hooks';
import { Relationship } from 'libs/enums';
import {
    useCreatePlayerContact,
    useUpdatePlayerContact,
} from 'services/hooks/players/useEditPlayerContact';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { useFetchAthleteDetailsById } from 'services/hooks/players/useFetchAthleteDetailsById';
import { useEditPlayerContactSchema } from 'schemas/player/useEditPlayerContactSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputController } from 'components/input';
import { SharedButton } from 'components/sharedButton';

interface EditPlayerContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditPlayerContactForm {
    name: any;
    relation: any;
    phoneNumber: any;
    nationalNumber: any;
}

export const EditPlayerContact: React.FC<EditPlayerContactModalProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();

    const { data: athlete } = useGetAthletes<any>({
        id: id || '',
        idType: 'athlete',
        dependents: [modalContent],
    });
    const { data, refetch } = useFetchAthleteDetailsById(id);
    const schema = useEditPlayerContactSchema();
    const methods = useForm<EditPlayerContactForm>({ mode: 'all', resolver: yupResolver(schema) });

    const { control, reset } = methods;

    const { mutate: updatePlayerContact } = useUpdatePlayerContact(id);
    const { mutate: createPlayerContact } = useCreatePlayerContact(id);

    // Memoize the relation options
    const relationOptions = useMemo(
        () =>
            arrayToSelectOptions({
                array: Relationship,
                trans,
                transSuffix: 'form.editAthleteProfile.',
            }),
        [trans],
    );

    // Reset form with athlete data when modal opens or athlete data changes
    useEffect(() => {
        if (athlete) {
            const selectedRelation = relationOptions.find(
                (option) => option.value === athlete?.emergencyContact?.relationship,
            );
            methods.reset({
                name: athlete?.emergencyContact?.name || '',
                relation: selectedRelation?.value || null,
                phoneNumber: athlete?.emergencyContact?.phoneNumber || '',
                nationalNumber: athlete?.emergencyContact?.nationalNumber || '',
            });
        }
    }, [athlete, reset, relationOptions]);

    const handleSave: SubmitHandler<EditPlayerContactForm> = async (data) => {
        setIsLoading(true);
        const contactData = {
            name: data.name,
            relation: data.relation.value || data.relation,
            phoneNumber: data.phoneNumber,
            nationalNumber: data.nationalNumber,
        };

        try {
            // Decide whether to call create or update based on existing data
            const mutation = athlete?.emergencyContact ? updatePlayerContact : createPlayerContact;
            await mutation(contactData);
            refetch();
            refetch();
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: athlete?.emergencyContact
                            ? trans('player.contactDataUpdatedSuccess')
                            : trans('player.contactDataCreatedSuccess'),
                    },
                }),
            );
            onClose();
            methods.reset();
        } catch (error: any) {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message,
                    },
                }),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                title={trans('player.Edit.contactData')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.EvenWrapper>
                        {/* Name Input */}
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('player.Edit.name')} />
                            <Controller
                                name="name"
                                control={methods.control}
                                render={({ field }) => (
                                    <InputController
                                        {...field}
                                        control={methods.control}
                                        placeholder={trans('player.Edit.name')}
                                    />
                                )}
                            />
                        </Theme.InputsWrapper>

                        {/* Relation Input */}
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{ display: 'block', color: '#7d7d7d' }}
                                title={trans('player.Edit.relation')}
                                content={
                                    <MultiSelectController
                                        control={control}
                                        name="relation"
                                        options={relationOptions}
                                        transSuffix="form.editAthleteProfile."
                                    />
                                }
                            />
                            <Divider />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.EvenWrapper>
                        {/* Phone Number Input */}
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('player.Edit.phoneNumber')} />
                            <Controller
                                name="phoneNumber"
                                control={methods.control}
                                render={({ field }) => (
                                    <InputController
                                        {...field}
                                        control={control}
                                        placeholder={trans('player.Edit.phoneNumber')}
                                    />
                                )}
                            />
                        </Theme.InputsWrapper>

                        {/* National Number Input */}
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('player.Edit.nationalNumber')} />
                            <Controller
                                name="nationalNumber"
                                control={methods.control}
                                render={({ field }) => (
                                    <InputController
                                        {...field}
                                        control={methods.control}
                                        placeholder={trans('player.Edit.nationalNumber')}
                                    />
                                )}
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>

                    <Theme.LineHR />
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
