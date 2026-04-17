import styled from 'styled-components';
import { Image as DefaultImage, Text as DefaultText } from 'components';
import { media } from 'libs/Theme/breakpoints';

export const Body = styled.header.attrs({ className: 'fixed flex justify-end' })`
    background-color: #000;
    color: #7d7d7d;
    padding: 0 60px;
    width: 80vw;
    height: 72px;
    z-index: 1000;
    display: flex;
    width: 100%;
    gap: 30px;
    background-color: #fff;
    box-shadow: 2px 2px 4px rgba(32, 32, 32, 0.04);
    user-select: none;
    justify-content: space-between;
    @media ${media.sm} {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
        height: 100px;
        gap: 0px;
    }
    @media (max-width: 600px) {
        height: 60px;
        justify-content: center;
    }
`;

export const NotificationIcon = styled(DefaultImage).attrs({
    className: 'my-auto ms-auto me-[50px]',
})`
    width: 20px;
`;

export const AvatarWrapper = styled.div.attrs({
    className: 'grid  grid-cols-[auto_auto] my-auto gap-x-[20px] cursor-pointer',
})``;

export const Avatar = styled(DefaultImage)`
    margin: auto;
    grid-row: span 2;
    width: 40px;
    height: 40px;
    border-radius: 100px;
`;

export const AvatarRole = styled(DefaultText)`
    margin-right: auto;
    opacity: 0.5;
`;

export const CBody = styled.div`
    order: 1;
    @media ${media.sm} {
        order: 2;
        margin-bottom: 8px;
    }
`;

export const UserBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    order: 2;
    @media ${media.sm} {
        order: 1;
    }
`;
export const Logo = styled(DefaultImage)`
    justify-content: start;
    align-items: start;
    cursor: pointer;
    margin-inline-end: auto;
    padding: 10px;
    font-size: 20px;
`;
