import { media } from 'libs/Theme/breakpoints';
import styled, { css } from 'styled-components';

export const BreadcrumbContainer = styled.nav`
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #2024034d;
    margin-top: 26px;
`;

export const BreadcrumbList = styled.ol`
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Space between items */
`;

export const BreadcrumbItemWrapper = styled.li`
    display: flex;
    align-items: center;
`;

export const BreadcrumbLink = styled.button`
    color: #2024034d;

    @media ${media.sm} {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        border: none;
        background: none;
        cursor: pointer;
    }

    @media ${media.xs} {
        max-width: 80px;
    }
`;

export const BreadcrumbText = styled.span`
    font-weight: 600;
`;

export const Separator = styled.span<{ isRTL?: boolean }>`
    font-size: 16px;
    margin: 0 8px;
    color: #2024034d;
    ${({ isRTL }) => {
        if (isRTL) {
            return css`
                transform: scaleX(-1);
            `;
        }
        return css``;
    }}
`;

export const LastBreadcrumbText = styled.span`
    color: #20240399;
    font-weight: 600;

    @media ${media.sm} {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
    }
    @media ${media.xs} {
        max-width: 80px;
    }
`;
