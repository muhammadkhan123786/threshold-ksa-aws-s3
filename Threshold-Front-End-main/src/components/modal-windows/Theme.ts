import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText } from 'components';

export const Body = styled.div.attrs({ className: ' w-full flex flex-col mt-[15px]' })``;

export const BodyWrapper = styled.div.attrs({ className: ' w-full max-h-[65vh]' })`
    overflow-y: auto;
`;

export const Divider = styled.div`
    height: 1px;
    width: 100%;
    background-color: #cdc9e2;
    opacity: 0.4;
    margin: 15px 0px 15px 0px;
`;

export const Row = styled.div<{ sub: true | undefined }>`
    display: grid;
    grid-template-columns: ${(props) => (props.sub ? '18% 18% 64%' : '36% 64%')};
    grid-template-rows: auto;
    width: 100%;
    margin: 10px 0 10px 0;

    @media (max-width: 768px) {
        grid-template-columns: 100%;
    }
`;

export const Title = styled(DefaultText)<{ sub: true | undefined }>`
    font-weight: 600;
    grid-column: ${(props) => (props.sub ? 'span 2' : 'span 1')};
    margin: ${(props) => (props.sub ? '10px 0px 20px 0px' : '0px')};
    margin-bottom: 8px;

    @media (max-width: 768px) {
        grid-column: span 1;
    }
`;

export const Subtitle = styled(DefaultText)``;

export const SubRowTitle = styled(DefaultText)`
    font-weight: 600;
    grid-column: 2 / 3;
    text-align: start;
    margin-top: 5px;

    @media (max-width: 768px) {
        grid-column: span 1;
    }
`;

export const Content = styled.div`
    grid-row: span 2;

    @media (max-width: 768px) {
        grid-row: span 1;
    }
`;

export const SubRowContent = styled.div`
    @media (max-width: 768px) {
        grid-column: span 1;
    }
`;

export const ButtonsContainer = styled.div.attrs({
    className: 'flex justify-end w-full gap-[20px]',
})`
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
    }
`;

export const Save = styled(DefaultButton)`
    font-size: 18px;
    padding: 0 20px;
    margin: 0;
    box-shadow: 0px 0px 7px 3px #d8d4d4;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const Cancel = styled(DefaultButton)`
    font-size: 18px;
    padding: 0 20px;
    margin: 0;
    color: black;
    background-color: #fcfcfd;
    box-shadow: 0px 0px 7px 3px #d8d4d4;
    @media (max-width: 768px) {
        width: 97%;
        align-self: center;
    }

    &:hover {
        color: #fcfcfd;
        background-color: #c0d330;
    }
`;

export const UploadText = styled.p.attrs({
    className: 'text-center',
})`
    font-size: 17px;

    & span {
        color: #c0d330;
        font-weight: 500;
    }
`;

export const NameInputsWrapper = styled.div.attrs({
    className: 'flex justify-between gap-5 w-full',
})``;
