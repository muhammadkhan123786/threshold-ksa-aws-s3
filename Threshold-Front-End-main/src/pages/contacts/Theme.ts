import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText } from 'components';

export const Body = styled.form.attrs({
    className: 'w-full flex flex-col items-center pt-[50px] gap-[20px] px-[25%]',
})`
    @media (max-width: 768px) {
        padding-left: 0;
        padding-right: 0%;
    }
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
