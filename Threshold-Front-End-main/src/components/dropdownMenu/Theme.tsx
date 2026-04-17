import styled from 'styled-components';

export const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
`;

export const StyledDropdownMenu = styled.div`
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 8px 0;
    min-width: 200px;
    text-align: center;
`;

export const DropdownItem = styled.div`
    padding: 8px 12px;
    text-align: center;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
`;
