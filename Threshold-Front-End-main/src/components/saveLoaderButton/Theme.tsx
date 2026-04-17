import styled from 'styled-components';

export const LoaderCSS = styled.div<{ spinnerColor?: string; trackColor?: string }>`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    border: 3px solid;
    border-color: ${({ trackColor }) => trackColor || '#fff'} transparent;
    animation: rotation 1s linear infinite;

    &::after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 3px solid;
        border-color: transparent ${({ spinnerColor }) => spinnerColor || '#fff'};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        animation: rotationBack 0.5s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes rotationBack {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }
`;
