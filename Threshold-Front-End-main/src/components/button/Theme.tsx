import styled from 'styled-components';

export const Body = styled.div``;

export const Button = styled.button.attrs({
    className: 'uppercase',
})`
    height: 50px;
    background-color: #c0d330;
    border: none;
    color: white;
    text-align: center;
    font-size: 20px;
    margin: 10px 0;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    font-weight: bold;

    &:hover {
        background-color: #000;
    }

    &:focus {
        outline: none;
    }

    &:active {
        transform: scale(0.98);
    }

    &:disabled {
        opacity: 0.5;
        user-select: none;
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;
