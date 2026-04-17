import React from 'react';
import Modal from 'react-modal';
import * as Theme from './Theme';

Modal.setAppElement('#root');
interface SharedModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    title: string;
    children: React.ReactNode;
    footerContent?: React.ReactNode;
    customHeight?: string;
    className?: string;
}

export const SharedModal: React.FC<SharedModalProps> = ({
    isOpen,
    onRequestClose,
    title,
    children,
    footerContent,
    customHeight,
    className,
}) => {
    return (
        <Theme.StyledModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName={`modal-overlay ${className}`}
            className={`modal-content ${className}`}
            customHeight={customHeight}
        >
            <Theme.ModalWrapper>
                <Theme.ModalHeader>
                    <Theme.Title>{title}</Theme.Title>
                    <Theme.CloseButton onClick={onRequestClose}>✕</Theme.CloseButton>
                </Theme.ModalHeader>
                <Theme.ModalContent>{children}</Theme.ModalContent>
                {footerContent && <Theme.ModalFooter>{footerContent}</Theme.ModalFooter>}
            </Theme.ModalWrapper>
        </Theme.StyledModal>
    );
};
