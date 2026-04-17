import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div`
    margin: 40px 32px;
`;

export const TitleSpan = styled.span`
    font-weight: 600;
    font-size: 40px;
    color: #c0d330;
`;

export const SendButton = styled(DefaultButton)`
    font-size: 18px;
    padding: 0 20px;
    margin: 0;
    box-shadow: 0px 0px 7px 3px #d8d4d4;
`;

export const OrTxtBody = styled.div``;

export const CallButton = styled(DefaultButton)`
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
`;

export const Image = styled(DefaultImage).attrs({
    className: 'w-[150px] h-auto rounded-full',
})`
    margin: 0px 40px;
`;
