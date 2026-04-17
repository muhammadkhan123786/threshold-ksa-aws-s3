import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    SharedModal,
    MultiSelectController,
    InputController,
    FilePickerController,
    Loader,
} from 'components';
import * as Theme from './theme';
import { Divider } from 'components/modal-windows';
import { useLocales } from 'hooks/locales';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClubInfo, useEditClub } from 'services/hooks';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { SharedButton } from 'components/sharedButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateClubSchema } from 'schemas/club/EditClubvalidationSchemas';

interface EditClubFormValues {
    name: string;
    registrationNumber: string;
    contactNumber: string;
    address: string;
    avatar?: File;
}

interface InitValue {
    id: string;
    name: string;
    registrationNumber: string;
    contactNumber: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    avatarUrl?: string;
}

export const EditClubModal = ({ initValue }: { initValue: InitValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { trans } = useLocales();
    const { academy } = useSelector(selectAcademy);
    const validationSchema = useUpdateClubSchema();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditClubFormValues>({
        defaultValues: initValue,
        resolver: yupResolver(validationSchema),
    });

    const { refetch } = useClubInfo(academy.id);

    const { mutate: editClub, isPending: isLoading } = useEditClub({
        onSuccess: (response) => {
            refetch();
            setIsOpen(false);
        },
        onError: (err) => {
            console.error('Error updating club:', err.message);
        },
    });

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        reset();
    };

    const handleFormSubmit = (data: EditClubFormValues) => {
        editClub({
            clubId: academy.id,
            name: data.name,
            registrationNumber: data.registrationNumber,
            contactNumber: data.contactNumber,
            address: data.address,
            avatar: data.avatar,
        });
    };

    return (
        <>
            <Theme.ButtonPrimary onClick={handleOpen}>
                {trans('club.editClub', 'Edit Club')}
            </Theme.ButtonPrimary>

            <SharedModal
                isOpen={isOpen}
                onRequestClose={handleClose}
                title={trans('club.editTitle', 'Edit Club')}
                footerContent={
                    <SharedButton onClick={handleSubmit(handleFormSubmit)}>
                        {isLoading ? <SaveLoaderButton /> : trans('button.save')}
                    </SharedButton>
                }
            >
                <Theme.Form>
                    <Theme.FieldRow>
                        <Theme.Field>
                            <Theme.Label>{trans('club.name', 'Club Name')}</Theme.Label>
                            <InputController
                                type="text"
                                {...{
                                    control,
                                    name: 'name',
                                    placeholder: trans('club.namePlaceholder', 'Write here..'),
                                }}
                            />
                        </Theme.Field>

                        <Theme.LogoInputWrapper>
                            <Theme.Label>{trans('club.logo', 'Club Logo')}</Theme.Label>
                            <FilePickerController
                                {...{
                                    control,
                                    name: 'avatar',
                                    placeholder: trans('club.logoPlaceholder', 'Write here..'),
                                }}
                            />
                        </Theme.LogoInputWrapper>
                    </Theme.FieldRow>
                    <Divider />

                    <Theme.EvenWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <Theme.Label>
                                {trans('club.registrationNumber', 'Commercial Registration Number')}
                            </Theme.Label>
                            <InputController
                                type="text"
                                {...{
                                    control,
                                    name: 'registrationNumber',
                                    placeholder: trans(
                                        'club.registrationPlaceholder',
                                        'Write here..',
                                    ),
                                }}
                            />
                        </Theme.FullWidthInputsWrapper>

                        <Theme.FullWidthInputsWrapper>
                            <Theme.Label>{trans('club.phoneNumbers', 'Phone Number')}</Theme.Label>
                            <InputController
                                type="text"
                                {...{
                                    control,
                                    name: 'contactNumber',
                                    placeholder: trans(
                                        'club.phonePlaceholder',
                                        'Insert at least 1 number',
                                    ),
                                }}
                            />
                        </Theme.FullWidthInputsWrapper>
                    </Theme.EvenWrapper>
                    <Divider />

                    <Theme.Field>
                        <Theme.Label>{trans('club.address', 'Address')}</Theme.Label>
                        <InputController
                            type="textarea"
                            {...{
                                control,
                                name: 'address',
                                placeholder: trans(
                                    'club.addressPlaceholder',
                                    'Write the full address',
                                ),
                            }}
                        />
                    </Theme.Field>
                </Theme.Form>
            </SharedModal>
        </>
    );
};
