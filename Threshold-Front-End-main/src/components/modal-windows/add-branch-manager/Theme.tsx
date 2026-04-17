import styled from 'styled-components';

export const UploadText = styled.p.attrs({
    className: 'text-center',
})`
    font-size: 17px;

    & span {
        color: #c0d330;
        font-weight: 500;
    }
`;

export const ErrorBox = styled.div`
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    padding: 16px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-size: 14px;
`;
