import styled from 'styled-components';

interface ButtonProps {
    variant?: 'primary' | 'secondary';
}

export const SharedButton = styled.button<ButtonProps>`
    margin-top: 20px;
    width: 100%;
    max-width: 230px;
    background-color: ${(props) => (props.variant === 'primary' ? '#c0d330' : '')};
    color: ${(props) => (props.variant === 'primary' ? 'white' : '#c0d330')};
    padding: 10px;
    border: ${(props) => (props.variant === 'primary' ? 'none' : '1px solid #c0d330')};
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: ${(props) => (props.variant === 'primary' ? 'center' : 'space-around')};
    align-items: center;
    gap: ${(props) => (props.variant === 'primary' ? '8px' : '0')};
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;

    &:hover {
        background-color: ${(props) => (props.variant === 'primary' ? '#a8bb28' : '')};
    }

    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }

    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;
