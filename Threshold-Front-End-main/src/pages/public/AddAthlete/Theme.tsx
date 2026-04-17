import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.form.attrs({ className: 'flex flex-col justify-start items-start' })`
    padding: 30px;
    width: 100%;
`;

export const TableTitle = styled(DefaultText)`
    text-transform: capitalize;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
`;

export const TableTabsWrapper = styled.div.attrs({
    className: 'flex justify-start items-center',
})`
    gap: 30px;
`;

export const TableTab = styled.div<{ $isActive: boolean }>`
    font-size: 20px;
    position: relative;
    background-color: transparent;
    color: ${(props) => (props.$isActive ? '#c0d330' : '#667085')};
    min-width: fit-content;
    font-weight: normal;
    margin: 0;
    text-transform: none;
    font-weight: 500;

    &::after {
        content: '';
        transition: 0.3s ease-in-out;
        position: absolute;
        opacity: ${(props) => (props.$isActive ? 1 : 0)};
        width: 100%;
        height: 3px;
        background-color: #c0d330;
        bottom: -15px;
        left: 0px;
    }

    &:hover {
        background-color: transparent;
    }
`;

export const TableUnderline = styled.div`
    height: 1px;
    width: 100%;
    background-color: #cdc9e2;
    margin-top: 13px;
    opacity: 0.6;
`;

export const ContentWrapper = styled.div.attrs({ className: 'flex' })`
    position: relative;
    padding: 50px 0px 50px 0px;
    gap: 10px;
    width: 70vw;
    height: fit-content;
    overflow-x: hidden;
`;

export const Slider = styled.div.attrs({ className: 'flex' })<{ activeTab: number }>`
    transition: left 0.5s ease;
    position: relative;
    top: 0;
    left: ${(props) => props.activeTab * -80}vw;
    flex-wrap: nowrap;

    & > div {
        width: 80vw;
    }
`;

export const ButtonsContainer = styled.div.attrs({ className: 'flex justify-end gap-5 w-full' })``;

export const Save = styled(DefaultButton)`
    font-size: 18px;
    padding: 0 20px;
    box-shadow: 0px 0px 7px 3px #d8d4d4;
`;

export const Cancel = styled(DefaultButton)`
    font-size: 18px;
    padding: 0 20px;
    color: black;
    background-color: #fcfcfd;
    box-shadow: 0px 0px 7px 3px #d8d4d4;

    &:hover {
        color: #fcfcfd;
        background-color: #c0d330;
    }
`;

export const NameInputsWrapper = styled.div.attrs({
    className: 'flex justify-between gap-5 w-full',
})``;

export const AvatarWrapper = styled.div.attrs({
    className: 'grid w-full',
})`
    grid-template-columns: 80px auto;
    gap: 20px;
`;

export const Avatar = styled(DefaultImage).attrs({
    className: '',
})`
    width: 80px;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
`;

export const UploadText = styled.p.attrs({
    className: 'text-center',
})`
    font-size: 17px;

    & span {
        color: #c0d330;
        font-weight: 500;
        margin-inline-end: 10px;
    }
`;
