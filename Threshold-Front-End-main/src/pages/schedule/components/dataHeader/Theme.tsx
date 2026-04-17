import styled from 'styled-components';

export const DateHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: white;
    border-bottom: 1px solid #ddd;
`;

export const MonthDisplay = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    > span {
        background-color: #f4f4f5;
        color: #18181b;
        margin-inline: 10px;
        min-width: 100px;
        font-size: 14px;
        padding: 5px;
        text-align: center;
    }
`;

export const NavigationButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 5px;
    color: #333;
    background-color: #f4f4f5;
    &:hover {
        color: #000;
    }
`;

export const DaysContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    overflow: hidden;
    margin-inline-start: 10px;
`;

export const Day = styled.div<{ active: boolean }>`
    font-size: 18px;
    color: ${({ active }) => (active ? 'white' : '#333')};
    background-color: ${({ active }) => (active ? '#e53935' : 'transparent')};
    padding: 5px 10px;
    border-radius: 50%;
    text-align: center;
    width: 56px;
    height: 56px;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: pointer;
    font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
`;
