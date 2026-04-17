import styled from 'styled-components';
import { Button as DefaultButton, Image as DefaultImage } from 'components';

export const Body = styled.div.attrs({
    className: 'w-full flex flex-col justify-center items-center p-[50px] gap-[50px]',
})`
    @media (max-width: 768px) {
        padding: 0px;
    }
`;

export const Content = styled.form.attrs({
    className: 'w-full flex flex-col gap-[20px] bg-white p-[20px] rounded-lg border',
})``;

export const Image = styled(DefaultImage).attrs({
    className: 'w-[150px] h-auto rounded-full',
})``;

export const Button = styled(DefaultButton)``;
