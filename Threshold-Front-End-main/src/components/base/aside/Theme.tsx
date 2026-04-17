import styled, { css } from 'styled-components';
import { Image as DefaultImage } from 'components';

export const Container = styled.div<{ isRTL: boolean; $menuOpen?: boolean }>`
    display: flex;
    flex-direction: column;
    z-index: 1005;
    display: flex;
    ${({ isRTL }) => (isRTL ? 'direction: rtl;' : 'direction: ltr;')}
    color: #000;
    transition: width 0.1s linear;
    position: relative;
    height: 100vh;
    position: fixed;
    background-color: #fff;
    user-select: none;

    ${({ $menuOpen }) =>
        $menuOpen
            ? css`
                  padding-inline: 16px;
                  width: 350px;
                  max-width: 220px;
              `
            : css`
                  width: 80px;
                  padding-inline: 8px;
              `};

    @media (max-width: 768px) {
        ${({ $menuOpen }) =>
            $menuOpen
                ? css`
                      padding-inline: 12px;
                      width: 70vw;
                      min-width: 200px;
                  `
                : css`
                      width: 80px;
                      padding-inline: 4px;
                  `};
    }
`;

export const Body = styled.aside<{ menuOpen?: boolean; isRTL: boolean }>`
    width: 100%;
    height: 100%;
    max-height: 100vh;
    color: #000;
    overflow-y: auto;
    transition: width 0.1s linear;
    display: flex;
    flex-direction: column;

    > *:not(:last-child) {
        padding: 10px;
        margin-top: 10px;
    }
`;

export const Logo = styled(DefaultImage)`
    justify-content: start;
    align-items: start;
    cursor: pointer;
    margin-inline-end: auto;
`;
