import styled from 'styled-components';

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const PaginationButtonsWrapper = styled.div`
    display: flex;
    margin: 10px;
`;
export const NumberWrapper = styled.div`
    display: flex;
    padding: 10px;
    font-size: 16px;
    font-weight: 500;
`;
export const ButtonPagination = styled.div<{ disabled?: boolean }>`
    display: flex;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
export const PageButton = styled.button<{ isActive?: boolean }>`
    background-color: ${({ isActive }) => (isActive ? '#c0d330' : 'transparent')};
    color: ${({ isActive }) => (isActive ? '#FFFFFF' : '#000000')};
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${({ isActive }) => (isActive ? '#5F6913' : '#F0F0F0')};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;
