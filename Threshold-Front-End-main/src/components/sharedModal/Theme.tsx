import { media } from 'libs/Theme/breakpoints';
import Modal from 'react-modal';
import styled from 'styled-components';

export const StyledModal = styled(Modal)<{ customHeight?: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);

    &.modal-content {
        position: relative;
        max-width: 900px;
        width: 90%;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        outline: none;

        @media (max-width: 576px) {
            padding: 16px;
        }

        max-height: 90vh;
        overflow-y: auto;

        ${({ customHeight }) =>
            customHeight &&
            `
            height: ${customHeight};
        `}
    }
`;

export const ModalWrapper = styled.div.attrs({
    className: 'w-full flex flex-col',
})`
    background: #fafafa;
    padding: 20px 30px;
    height: 100%;
    @media ${media.sm} {
        padding: 20px 8px;
    }
`;

export const ModalHeader = styled.div.attrs({
    className: 'flex justify-between items-center',
})``;

export const Title = styled.h2.attrs({
    className: 'text-lg font-semibold text-gray-800',
})``;

export const CloseButton = styled.button.attrs({
    className: 'text-gray-500 hover:text-red-500 transition duration-200',
})`
    background: none;
    border: none;
    cursor: pointer;
`;

export const ModalContent = styled.div.attrs({
    className: 'flex-1 space-y-4',
})`
    overflow-y: auto;
    padding: 10px 0;
`;

export const ModalFooter = styled.div.attrs({
    className: 'mt-4 flex justify-end items-center',
})``;
