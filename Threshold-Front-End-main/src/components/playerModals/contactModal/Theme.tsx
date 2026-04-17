import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const InputsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    transition: all 0.5s ease;
    margin-top: 20px;
`;
export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    background-color: white;

    &::placeholder {
        color: #bbb;
    }
`;
export const Body = styled.form.attrs({ className: 'flex flex-col' })`
    padding: 10px 30px;
    background-color: white;
    width: 100%;
    margin: auto;
`;
export const LineHR = styled.hr`
    color: black;
    font-size: 2px;
    margin: 20px 0px;
`;
export const InputMultiElemintsWrapperRight = styled.div`
    display: flex;
    align-items: end;
    justify-items: end;
    justify-content: end;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    transition: all 0.3s ease;
`;
export const SubmitButton = styled.button`
    margin-top: 20px;
    width: 25%;
    background-color: white;
    color: #c0d330;
    padding: 10px;
    border: 1px solid #c0d330;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;

    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;
export const ErrorText = styled.div`
    color: #d9534f;
    font-size: 12px;
    margin-top: 5px;
    font-weight: 400;
    line-height: 1.4;
    text-align: left;
`;
export const EvenWrapper = styled.div`
    display: flex;
    gap: 24px;
    @media ${media.sm} {
        flex-direction: column;
        gap: 0px;
    }
`;
