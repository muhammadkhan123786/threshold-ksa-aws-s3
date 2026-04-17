import * as Theme from './Theme';
import { Divider } from 'components/modal-windows';
import { ModalContentType } from 'libs/types';
import { ReactNode } from 'react';
import { BodyWrapper } from '../modal-windows/Theme';

interface Props {
    modalContent: ModalContentType;
    children: ReactNode;
}

export const FormContent = ({ children, modalContent }: Props) => {
    return (
        <>
            <Theme.Title variant="h3" value={modalContent.title} />
            {modalContent.subtitle ? (
                <Theme.Subtitle variant="p" value={modalContent?.subtitle || ''} />
            ) : (
                <div></div>
            )}
            <Divider />
            <BodyWrapper>{children}</BodyWrapper>
        </>
    );
};
