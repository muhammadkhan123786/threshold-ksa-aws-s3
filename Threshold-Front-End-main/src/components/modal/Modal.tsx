import * as Theme from './Theme';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectControls } from 'store';
import { FormContent } from './index';
import { useRouter } from 'react-router5';
import { useModalForm } from 'hooks/helpers';

interface ModalProps {}

export const Modal: React.FC<ModalProps & React.HTMLAttributes<HTMLDivElement>> = ({ ...rest }) => {
    const { modalContent } = useSelector(selectControls);
    const router = useRouter();
    const {
        params: { id },
    } = router.getState();

    const { modalMapping } = useModalForm({ id });

    const isAlert = ['success', 'warning', 'info'].includes(modalContent.type);

    return (
        <Theme.Body {...rest}>
            <Theme.Blur />
            <Theme.Content $isAlert={isAlert}>
                {isAlert ? (
                    modalMapping[modalContent.type]
                ) : (
                    <FormContent modalContent={modalContent}>
                        {modalMapping[modalContent.type]}
                    </FormContent>
                )}
            </Theme.Content>
        </Theme.Body>
    );
};
