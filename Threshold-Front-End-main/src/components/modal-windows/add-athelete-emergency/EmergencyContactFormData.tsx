import React, { Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import { useLocales } from 'hooks/locales';
import { Body, Divider } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { InputController } from 'components/input';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateEmergencyContact, useUpdateEmergencyContact } from 'services/hooks';
import { setModalContent } from 'store/controlsSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateEmergencyContactSchema } from 'schemas/athlete/addAtheleteBank';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { Relationship } from 'libs/enums';

interface EmergencyContactFormData {
    name: string;
    relation: string;
    phoneNumber: string;
    nationalNumber: string;
}

interface EmergencyContactFormProps {
    id?: string;
    defaultValues?: EmergencyContactFormData;
    handleCancel: () => void;
    handleSave?: (data: EmergencyContactFormData) => void;
}

export const EmergencyContactForm: React.FC<
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

    const createSchema = useCreateEmergencyContactSchema();
    const updateSchema = useCreateEmergencyContactSchema();

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

    const updateEmergencyContactMutation = useUpdateEmergencyContact(athleteId);
    const createEmergencyContactMutation = useCreateEmergencyContact(athleteId);
    const queryClient = useQueryClient();

    const handleFormSave = async () => {
        const formData: EmergencyContactFormData = {
            name: getValues('name'),
            relation: getValues('relation')?.value,
            phoneNumber: getValues('phoneNumber'),
            nationalNumber: getValues('nationalNumber'),
        };

        const mutation = defaultValues?.name
            ? updateEmergencyContactMutation
            : createEmergencyContactMutation;

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
                                    ? trans('emergency_contact.updated_successfully')
                                    : trans('emergency_contact.created_successfully')
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
        () =>
            !!watch('name') &&
            !!watch('relation') &&
            !!watch('phoneNumber') &&
            !!watch('nationalNumber'),
        [watch('name'), watch('relation'), watch('phoneNumber'), watch('nationalNumber')],
    );

    return (
        <Body>
            <FormRow
                title={trans('form.editAthleteProfile.name')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'name',
                            placeholder: trans('form.enterUsername'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editAthleteProfile.relationship')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'relation',
                            options: arrayToSelectOptions({ array: Relationship }),
                            transSuffix: 'form.editAthleteProfile.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editAthleteProfile.contactNumber')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'phoneNumber',
                            placeholder: trans('form.addBranchManager.contactNumberPlaceholder'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.personal.nationalNumber')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'nationalNumber',
                            placeholder: trans('form.addBranchManager.ninTitle'),
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
                        cancelText={isModal ? trans('form.cancel') : 'form.cancel'}
                    />
                }
            />
        </Body>
    );
};
