import styled, { css } from 'styled-components';
import { Image as DefaultImage, Text as DefaultText } from 'components';

export const Tab = styled.div.attrs({
    className: 'flex justify-start items-center gap-3',
})<{ $isActive: boolean; $last?: boolean; $isButton: boolean; $menuOpen?: boolean }>`
    transition: 0.3s ease-in-out;
    border-radius: 8px;
    background-color: ${(props) =>
        props.$isActive && props.$isButton ? '#C0D33030' : 'transparent'};
    margin-top: ${(props) => (props.$last ? '100px' : '0px')};
    cursor: ${(props) => (props.$isButton ? 'pointer' : 'auto')};
    width: ${(props) => (props.$isButton ? '100%' : 'fit-content')};

    margin-top: 10px;

    ${({ $menuOpen }) =>
        $menuOpen
            ? css`
                  padding: 10px;
              `
            : css`
                  justify-content: center;
                  align-items: center;
              `};

    &:hover {
        background-color: ${(props) => (props.$isButton ? '#C0D33030' : 'transparent')};
    }
`;

export const TabIcon = styled(DefaultImage)<{ menuOpen?: boolean }>`
    width: 25px;
    height: 25px;
    overflow: hidden;
    filter: invert(1) brightness(0);
`;

export const TabText = styled(DefaultText)`
    font-weight: bold;
    color: rgba(32, 32, 32, 0.85);
    word-wrap: break-word;
`;
