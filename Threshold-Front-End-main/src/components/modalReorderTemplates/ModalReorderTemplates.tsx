/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import { SharedModal } from '../sharedModal';
import { WarningModal } from '../warningModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { LabelInput } from 'components/labelInput';
import { Controller, useForm } from 'react-hook-form';

interface ModalReorderTemplatesProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode; // Add this line
}
interface Template {
    order: number;
    id: string;
    content: string;
    technique: string;
    meters: string;
}
interface FormData {
    name: string;
}

export const ModalReorderTemplates: React.FC<ModalReorderTemplatesProps> = ({
    isOpen,
    onClose,
}) => {
    const { trans } = useLocales();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const initialTemplates: Template[] = [
        { order: 1, id: '1', content: 'Curl-up', technique: '1 technique', meters: '100 meters' },
        {
            order: 2,
            id: '2',
            content: 'Trunk-lift',
            technique: '1 technique',
            meters: '100 meters',
        },
        { order: 3, id: '3', content: 'Push up', technique: '1 technique', meters: '100 meters' },
        {
            order: 4,
            id: '4',
            content: 'Sit and Reach',
            technique: 'Stretch technique',
            meters: '0 meters',
        },
        {
            order: 5,
            id: '5',
            content: 'Pacer Test',
            technique: 'Cardio endurance',
            meters: '200 meters',
        },
        {
            order: 6,
            id: '6',
            content: 'Plank Hold',
            technique: 'Core strength',
            meters: '0 meters',
        },
        {
            order: 7,
            id: '7',
            content: 'Shuttle Run',
            technique: 'Agility drill',
            meters: '50 meters',
        },
        {
            order: 8,
            id: '8',
            content: 'Lunges',
            technique: 'Lower body strength',
            meters: '20 meters',
        },
        {
            order: 9,
            id: '9',
            content: 'Side Plank',
            technique: 'Oblique focus',
            meters: '0 meters',
        },
        {
            order: 10,
            id: '10',
            content: 'Standing Broad Jump',
            technique: 'Power technique',
            meters: '5 meters',
        },
        {
            order: 11,
            id: '11',
            content: 'Mountain Climbers',
            technique: 'Cardio drill',
            meters: '0 meters',
        },
        {
            order: 12,
            id: '12',
            content: 'Jump Rope',
            technique: 'Coordination drill',
            meters: '150 meters',
        },
        {
            order: 13,
            id: '13',
            content: 'Burpees',
            technique: 'Full-body workout',
            meters: '0 meters',
        },
        {
            order: 14,
            id: '14',
            content: 'Wall Sit',
            technique: 'Leg endurance',
            meters: '0 meters',
        },
        {
            order: 15,
            id: '15',
            content: 'High Knees',
            technique: 'Warm-up drill',
            meters: '30 meters',
        },
        {
            order: 16,
            id: '16',
            content: 'Sprint Intervals',
            technique: 'Speed training',
            meters: '300 meters',
        },
        {
            order: 17,
            id: '17',
            content: 'Dead Hang',
            technique: 'Grip strength',
            meters: '0 meters',
        },
        {
            order: 18,
            id: '18',
            content: 'Pull-ups',
            technique: 'Upper body strength',
            meters: '0 meters',
        },
        {
            order: 19,
            id: '19',
            content: 'Box Jumps',
            technique: 'Explosive power',
            meters: '0 meters',
        },
        {
            order: 20,
            id: '20',
            content: 'Farmers Walk',
            technique: 'Strength and grip',
            meters: '50 meters',
        },
    ];

    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isReordered, setIsReordered] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            const newTemplates = [...templates];
            const draggedItem = newTemplates[draggedIndex];
            newTemplates.splice(draggedIndex, 1);
            newTemplates.splice(index, 0, draggedItem);
            setTemplates(newTemplates);
            setDraggedIndex(index);
            setIsReordered(true);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSaveReorder = () => {
        setIsReordered(false);
        onClose();
    };

    const handleModalClose = () => {
        if (isReordered) {
            // setIsReordered(false);
            setShowWarning(true);
        } else {
            onClose();
        }
    };

    const handleDiscardChanges = () => {
        setShowWarning(false);
        setIsReordered(false);
        onClose();
    };

    return (
        <>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={handleModalClose}
                title={trans('edit.session.template')}
            >
                <Theme.LineHR />
                <Theme.Body onSubmit={handleSubmit(handleSaveReorder)}>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('edit.session.templateName')} />
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Theme.Input
                                    {...field}
                                    placeholder={trans('edit.session.templateIput')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>
                    <Theme.LineHR />
                    <Theme.ModalContainer>
                        <LabelInput label={trans('edit.session.templateList')} />
                        <Theme.ListContainer>
                            {templates.map((template, index) => (
                                <Theme.ListItem
                                    key={template.id}
                                    data-id={template.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <Theme.InputMultiElemintsWrapperLeft>
                                        <img
                                            src="/assets/icons/drag-icon.svg"
                                            height={20}
                                            width={20}
                                            alt="Drag Icon"
                                        />
                                        <Theme.SpanContant>{template.content}</Theme.SpanContant>
                                        <Theme.SpanTecnique>
                                            {template.technique}
                                        </Theme.SpanTecnique>
                                    </Theme.InputMultiElemintsWrapperLeft>
                                    <Theme.InputMultiElemintsWrapperRight>
                                        <Theme.SpanMeters>{template.meters}</Theme.SpanMeters>
                                        <img
                                            src="/assets/icons/cansel-icon.svg"
                                            height={20}
                                            width={20}
                                            alt="Add Icon"
                                        />
                                    </Theme.InputMultiElemintsWrapperRight>
                                </Theme.ListItem>
                            ))}
                        </Theme.ListContainer>
                    </Theme.ModalContainer>
                    <Theme.InputMultiElemintsWrapperRight>
                        <Theme.SubmitButton type="submit">
                            <img
                                src="/assets/icons/save-icon.svg"
                                height={20}
                                width={20}
                                alt="Save Icon"
                            />
                            {trans('save.reoder.modal')}
                        </Theme.SubmitButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>

            {showWarning && (
                <WarningModal isOpen={showWarning} onClose={() => setShowWarning(false)}>
                    <Theme.ImageAndMassagesElemintsWrapper>
                        <img
                            src="/assets/icons/warning-image.svg"
                            height={96}
                            width={96}
                            alt="Warning Image"
                        />
                        <Theme.Warningh2>{trans('unsaved.changes.warningMassage')}</Theme.Warningh2>
                        <Theme.WarningPara>
                            {trans('unsaved.changes.textWarning')}
                        </Theme.WarningPara>
                    </Theme.ImageAndMassagesElemintsWrapper>
                    <Theme.ButtonsElemintsWrapper>
                        <Theme.BackButtonFromWarning onClick={() => setShowWarning(false)}>
                            {trans('back.continue.warning')}
                        </Theme.BackButtonFromWarning>
                        <Theme.DiscardButtonWarning type="button" onClick={handleDiscardChanges}>
                            <img
                                src="/assets/icons/cancel-icon-non.svg"
                                height={20}
                                width={20}
                                alt="Cansel Icon"
                            />
                            {trans('discard.changes.warning')}
                        </Theme.DiscardButtonWarning>
                    </Theme.ButtonsElemintsWrapper>
                </WarningModal>
            )}
        </>
    );
};
