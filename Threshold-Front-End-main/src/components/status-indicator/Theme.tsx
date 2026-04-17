import styled from 'styled-components';
import { Text as DefaultText } from 'components';

export const Body = styled.div<{
    $isActive: boolean;
    $activeColor: 'green';
    $inactiveColor: 'gray' | 'red';
}>`
    margin: unset !important;
    margin-inline-end: auto !important;

    width: fit-content;
    height: fit-content;
    border-radius: 18px;
    padding: 3px 10px 3px 25px;
    background-color: ${(props) =>
        props.$isActive ? '#cdffcd' : props.$inactiveColor === 'gray' ? '#f2f0f9' : '#ffcdd6'};
    font-size: 12px;
    color: ${(props) =>
        props.$isActive ? '#007f00' : props.$inactiveColor === 'gray' ? '#000' : '#c00632'};
    position: relative;

    &::before {
        content: '';
        position: absolute;
        width: 8px;
        aspect-ratio: 1;
        left: 8px;
        top: 0;
        transform: translateY(100%);
        border-radius: 100%;
        background-color: ${(props) =>
            props.$isActive ? '#007f00' : props.$inactiveColor === 'gray' ? '#000' : '#c00632'};
    }
`;

export const Text = styled(DefaultText)``;
