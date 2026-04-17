import styled, { css } from 'styled-components';

export const Body = styled.p<any>`
    ${({ $show }: { $show: string }) => {
        if ($show)
            return css`
                visibility: visible;
            `;

        return css`
            visibility: hidden;
        `;
    }}

    color:red;
    min-height: 30px;
    font-size: 14px !important;
    font-weight: 500 !important;
`;
