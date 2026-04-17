import React, { useState } from 'react';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'react-router5';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { InputDateController } from 'components/inputDate';
import { LabelInput } from 'components/labelInput';
import { InputController } from 'components/input';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateEventType } from 'libs/enums/athlete';
import { arrayToSelectOptions } from 'libs/helpers';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EventModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const { trans } = useLocales();
    const router = useRouter();
    const {
        params: { sportId },
    } = router.getState();
    const handleModalClose = () => {
        onClose();
    };
    const {
        control,
        handleSubmit,
        reset,

        formState: { errors },
    } = useForm({
        mode: 'all',
        // resolver: yupResolver(teamsSchema),
    });
    const handleSave = () => {
        console.log('send a request');
    };

    return (
        <>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={handleModalClose}
                title={`${trans('labels.create.event')}`}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.EvenWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                                title={trans('label.create.event.type')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'type',
                                            options: arrayToSelectOptions({
                                                array: CreateEventType,
                                            }),
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', display: 'block', color: '#7d7d7d' }}
                                title={trans('labels.create.event.date')}
                                content={
                                    <InputDateController
                                        {...{
                                            control,
                                            name: 'date',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.FullWidthInputsWrapperTwoInputs>
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('labels.create.event.title')} />
                            <Controller
                                control={control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputController
                                            {...field}
                                            control={control}
                                            type="name"
                                            placeholder={trans('labels.placeholder.event.title')}
                                        />
                                    </>
                                )}
                            />
                        </Theme.InputsWrapper>
                    </Theme.FullWidthInputsWrapperTwoInputs>

                    <Theme.EvenWrapper>
                        <InputController
                            {...{
                                control,
                                name: 'description',
                                label: trans('create.event.description'),
                                placeholder: trans('labels.placeholder.event.description'),
                            }}
                            isMultiline={true}
                            rows={1}
                        />
                    </Theme.EvenWrapper>
                </Theme.Body>
                <Theme.FooterButtonsWrapper>
                    <SharedButton onClick={handleSubmit(handleSave)}>
                        <>{isSubmittingForm ? <SaveLoaderButton /> : trans('button.save')}</>
                    </SharedButton>
                </Theme.FooterButtonsWrapper>
            </SharedModal>
        </>
    );
};
