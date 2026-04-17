import styled from 'styled-components';

export const Wrapper = styled.div`
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Label = styled.label`
    font-weight: 500;
    font-size: 14px;
    display: block;
    margin-bottom: 5px;
    color: #20240399;
`;

export const OptionsContainer = styled.div`
    display: flex;
    gap: 15px;
`;

export const Option = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    input[type='radio'] {
        margin-right: 5px;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
`;

export const ErrorMessage = styled.span`
    color: red;
    font-size: 12px;
    margin-top: 5px;
`;
