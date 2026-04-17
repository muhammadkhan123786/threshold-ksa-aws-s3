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
        width: inherit;
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

export const AthletesList = styled.div.attrs({
    className:
        'grid grid-cols-[20%_20%_auto] my-[30px] gap-y-[20px] gap-x-[30px] p-[0px_80px_0px_0px]',
})``;

export const ListHeader = styled.div.attrs({ className: 'font-[600] text-[18px]' })``;

export const CardList = styled.div.attrs({
    className: 'flex w-full flex-col',
})`
    border-block: 2px solid #ccc;

    padding-block: 40px;
`;

export const Alert = styled.div`
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
    font-size: 16px;
`;

export const AlertStrong = styled.strong`
    font-weight: bold;
`;

export const Section = styled.div.attrs({
    className: 'flex w-full justify-center items-center',
})``;

export const TitleSection = styled.div.attrs({
    className: 'text-[21px] font-medium truncate capitalize text-ellipsis h-full',
})`
    flex: 1;
    min-width: 100px;
`;

export const FieldSection = styled.div.attrs({
    className: 'flex justify-start items-center w-full',
})``;

export const Footer = styled.div`
    display: flex;
    background-color: #f4f4f5;
    position: sticky;
    bottom: 0;
    border-radius: 6px;
    padding: 30px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
`;
