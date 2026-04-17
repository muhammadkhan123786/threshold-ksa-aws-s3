import styled from 'styled-components';

export const FilterMenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10006;
    min-width: 350px;
    @media (max-width: 768px) {
        max-width: 360px;
        left: 15px !important;
    }
`;

export const FilterIcon = styled.img`
    width: 16px;
    height: 16px;
`;

export const FilterLabel = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
`;

export const FilterSelect = styled.select`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
`;

export const FilterInput = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
`;

export const ApplyButton = styled.button`
    background-color: #c0d330;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
    align-self: flex-end;
    font-weight: bold;
    &:hover {
        background-color: #a8bb2a;
    }
`;

export const FilterButton = styled.button.attrs<{ $hasActiveFilters: boolean }>({
    className: 'flex items-center justify-center gap-3',
})`
    padding: 10px 20px;
    margin-inline: 10px;
    color: #000;
    font-weight: bold;
    text-transform: none;
    font-size: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;

    &::after {
        content: '';
        display: ${({ $hasActiveFilters }) => ($hasActiveFilters ? 'block' : 'none')};
        position: absolute;
        top: 5px;
        right: 5px;
        width: 10px;
        height: 10px;
        background: red;
        border-radius: 50%;
    }
`;
export const Body = styled.div``;

export const ClearButton = styled.button`
    background-color: #f00;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
    align-self: flex-end;
    font-weight: bold;
    &:hover {
        background-color: #c00;
    }
`;

export const RangeBody = styled.div.attrs({
    className: 'flex w-full',
})`
    > *:first-child {
        margin-inline-end: 30px;
    }
`;
