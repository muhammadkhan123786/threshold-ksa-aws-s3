import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div`
    margin: 40px 32px;
`;
export const TitleWrapper = styled.div`
    p {
        margin-top: 24px;
        color: #202403d9;
    }
`;
export const TitlePara = styled.span`
    font-weight: 600;
    font-size: 40px;
    color: #141400;
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
export const FormWrapper = styled.div`
    border: 1px solid #20202014;
    border-radius: 8px;
    padding: 24px;
    background-color: #fff;
    margin-top: 40px;
    margin-bottom: 40px;
`;

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

export const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const SuccessSentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
export const Image = styled(DefaultImage).attrs({
    className: 'w-[150px] h-auto rounded-full',
})`
    margin: 0px 40px;
`;

export const Logo = styled(DefaultImage)`
    margin-bottom: 24px;
`;

export const HeadTitle = styled.p`
    font-weight: 600px;
    font-size: 40px;
    color: #141400;
    margin-bottom: 24px;
`;

export const SubTitle = styled.p`
    font-weight: 400;
    font-size: 16px;
    color: #202403d9;
    margin-bottom: 40px;
`;
