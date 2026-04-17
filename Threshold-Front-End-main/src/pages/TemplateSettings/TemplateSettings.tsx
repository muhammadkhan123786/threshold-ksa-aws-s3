import React, { useState, useRef } from 'react';
import {
    TemplateSettingsForm,
    TemplateSettingsFormRef,
} from '../../components/TemplateSettingsForm';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { ModalReorderTemplates } from '../../components/modalReorderTemplates';
import { useForm } from 'react-hook-form';
import { SharedButton } from 'components/sharedButton';

export const TemplateSettings: React.FC = () => {
    const { trans } = useLocales();
    const [formInstances, setFormInstances] = useState<number[]>([0]);
    const formRefs = useRef<React.RefObject<TemplateSettingsFormRef>[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (formRefs.current.length !== formInstances.length) {
        formRefs.current = Array(formInstances.length)
            .fill(null)
            .map((_, i) => formRefs.current[i] || React.createRef());
    }

    const handleAddPhase = () => {
        setFormInstances((prevInstances) => [...prevInstances, prevInstances.length]);
    };

    const handleViewTemplate = () => {
        setIsModalOpen(true);
    };

    const { control } = useForm();

    const handleSubmitAllForms = async () => {
        const allData: Record<string, any>[] = [];
        for (let index = 0; index < formRefs.current.length; index++) {
            const ref = formRefs.current[index];
            if (ref?.current) {
                try {
                    const formData = await ref.current.submitForm();
                    allData.push({ formIndex: index, ...formData });
                } catch (error) {
                    console.error(`Validation error in form ${index}:`, error);
                }
            }
        }
    };

    return (
        <>
            <ModalReorderTemplates isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <Theme.NavigationWrapper>
                <Theme.CreateSessionTitle>
                    {trans('templateSettings.button.template')}
                </Theme.CreateSessionTitle>
                <Theme.NavigationButton onClick={handleViewTemplate}>
                    {trans('templateSettings.button.editTemplate')}
                    <img src="/assets/icons/edit.svg" alt="Arrow Icon" />
                </Theme.NavigationButton>
            </Theme.NavigationWrapper>
            <Theme.Body>
                {formInstances.map((instance, index) => (
                    <TemplateSettingsForm key={instance} ref={formRefs.current[index]} />
                ))}
                <Theme.AddPhaseButton onClick={handleAddPhase}>
                    {trans('templateSettings.button.addPhase')}
                    <img
                        src="/assets/icons/add-icon-colored.svg"
                        height={20}
                        width={20}
                        alt="Add Icon"
                    />
                </Theme.AddPhaseButton>
                <SharedButton onClick={handleSubmitAllForms}>{trans('button.submit')}</SharedButton>
            </Theme.Body>
        </>
    );
};
