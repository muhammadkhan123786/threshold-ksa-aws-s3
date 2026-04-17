import styled from 'styled-components';

export const FieldWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: #202020;
    margin-bottom: 8px;
`;

export const FilePickerContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #ffffff;
    border: 1px solid #dbddd0;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;

    &:hover {
        border-color: #c0d330;
    }
`;

export const FileInput = styled.input`
    display: none;
`;

export const DisplayBox = styled.div`
    flex: 1;
    font-size: 14px;
    color: #20202080;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
