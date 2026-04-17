import styled from 'styled-components';
import { Text as DefaultText, Button as DefaultButton } from 'components';

export const Body = styled.div.attrs({
    className: 'w-full flex flex-col justify-start items-center h-full p-[32px]',
})`
    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const Title = styled(DefaultText)`
    text-transform: capitalize;
    font-size: 18px;
    font-weight: 600;

    @media (max-width: 768px) {
        font-size: 16px;
    }
`;

export const SubTitle = styled(DefaultText)`
    text-transform: capitalize;
    font-size: 14px;
    font-weight: 600;
    color: #475467;
    margin-top: 0;

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

export const Header = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    width: 100%;
    margin-bottom: 18px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;

    @media (max-width: 768px) {
        margin-bottom: 12px;
        padding-bottom: 12px;
    }
`;

export const Content = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    flex-wrap: wrap;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    padding: 24px;

    @media (max-width: 768px) {
        padding: 16px;
        border: none;
        border-radius: 0;
    }
`;

export const InputsWrapper = styled.div.attrs({
    className: 'flex justify-between gap-5 w-full',
})`
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
    }
`;

export const SaveButton = styled(DefaultButton)`
    font-size: 18px;
    padding: 0 50px;
    margin: 0;
    box-shadow: 0px 0px 7px 3px #d8d4d4;
    margin-block: 20px;
    margin-inline-start: auto;

    @media (max-width: 768px) {
        font-size: 16px;
        padding: 0 30px;
        margin-block: 15px;
        width: 100%;
    }
`;
