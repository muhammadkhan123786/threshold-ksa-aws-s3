import styled from 'styled-components';

export const Grid = styled.div.attrs({
    className: 'grid grid-cols-3 gap-4 mb-4',
})``;

export const Card = styled.div.attrs({
    className:
        'flex flex-col items-center justify-between border rounded-lg p-4 cursor-pointer hover:shadow-md transition',
})`
    border: 1px solid #e5e7eb;
`;

export const Icon = styled.img.attrs({
    className: 'w-12 h-12 mb-2',
})``;

export const ModalHeader = styled.div.attrs({
    className: 'flex justify-between items-center mb-4',
})``;

export const ModalTitle = styled.h2.attrs({
    className: 'text-lg font-semibold text-gray-800',
})``;

export const ModalFooter = styled.div.attrs({
    className: 'mt-4 flex justify-end items-center',
})``;

export const ErrorText = styled.span.attrs({
    className: 'text-red-500 text-sm',
})``;

export const Form = styled.div.attrs({
    className: 'flex flex-row gap-4',
})`
    > * {
        width: 50%;
        flex-direction: column;
    }
`;

export const Field = styled.div.attrs({
    className: 'flex flex-col',
})``;

export const Label = styled.label.attrs({
    className: 'text-gray-700 font-medium mb-2',
})``;

export const ButtonPrimary = styled.button`
    background-color: transparent;
    border: none;
    color: #202020;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
        color: #a4b228;
    }

    &::before {
        content: '+';
        font-size: 18px;
    }
`;

export const SubmitPrimary = styled.button`
    background: #c0d330;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 8px;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;

    font-weight: 500;

    padding: 8px 20px;

    &:hover {
        color: #a4b228;
    }

    &::before {
        content: '+ ';
        font-size: 18px;
    }
`;
