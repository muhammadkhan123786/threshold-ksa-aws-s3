import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div.attrs({ className: 'flex flex-col justify-start items-center' })`
    height: 100%;
    padding: 30px;
    gap: 50px;
`;

export const AvatarSection = styled.div.attrs({
    className: 'flex w-full',
})`
    align-items: center;
    flex-wrap: wrap;
    @media (max-width: 768px) {
        width: inherit !important;
    }
`;

export const Avatar = styled(DefaultImage)`
    width: 120px;
    aspect-ratio: 1;
    border-radius: 100%;
`;

export const Name = styled(DefaultText)`
    text-align: start;
    font-size: 30px;
    font-weight: bold;
    margin-inline-start: 20px;
    margin-bottom: 20px;

    margin-inline-end: auto;
`;

export const SessionTitleSection = styled.div.attrs({
    className: 'mr-auto flex flex-wrap',
})``;

export const SessionTitle = styled.div.attrs({
    className: 'me-[30px] text-[18px] uppercase font-bold flex flex-wrap',
})``;

export const Button = styled(DefaultButton)`
    padding: 10px;
`;
