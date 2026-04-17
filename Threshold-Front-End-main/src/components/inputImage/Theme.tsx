import styled from 'styled-components';

export const FileInputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    padding: 8px 12px;
    width: 100%;
    cursor: pointer;

    &:hover {
        border-color: #a8a8a8;
    }
`;

export const FileInputLabel = styled.label`
    cursor: pointer;
    flex: 1;
    color: #6c757d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const HiddenFileInput = styled.input`
    display: none;
`;

export const Label = styled.label`
    font-size: 14px;
    color: #20240399;
    font-weight: 500;
`;

export const UploaderWrapper = styled.div.attrs({
    className: 'flex flex-col gap-3 justify-center items-center',
})`
    padding: 20px 0px;
    background-color: #fff;
    border: 1px solid #cdc9e299;
    border-radius: 15px;

    & label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
`;
