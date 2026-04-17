import styled, { css } from 'styled-components';

export const Body = styled.label<any>`
    ${({ $show }: { $show: string }) => {
        if ($show)
            return css`
                visibility: visible;
            `;

        return css`
            visibility: hidden;
        `;
    }}

    font-weight: 500;
    color: #20240399;
`;
