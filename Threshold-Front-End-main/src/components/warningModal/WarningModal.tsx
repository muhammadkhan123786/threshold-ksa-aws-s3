import React, { useState } from 'react';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
interface ModalReorderTemplatesProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}
export const WarningModal: React.FC<ModalReorderTemplatesProps> = ({
    isOpen,
    onClose,
    children,
}) => {
    const { trans } = useLocales();
    return (
        <SharedModal isOpen={isOpen} onRequestClose={onClose} title={trans('')}>
            {children}
        </SharedModal>
    );
};
