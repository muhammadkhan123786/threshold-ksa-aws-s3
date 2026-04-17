import styled from 'styled-components';

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); // Responsive grid
    gap: 16px;
    margin-top: 16px;
    max-height: 300px;
    overflow-y: scroll;
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); // Adjust for tablets
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); // Adjust for mobile
    }
`;

export const Card = styled.div<{ selected: boolean; disabled: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 2px solid ${({ selected }) => (selected ? '#c0d330' : '#e5e5e5')};
    border-radius: 8px;
    background-color: ${({ selected }) => (selected ? 'rgba(192, 211, 48, 0.2)' : '#fff')};
    cursor: pointer;
    transition:
        border-color 0.3s,
        background-color 0.3s;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    &:hover {
        border-color: #c0d330;
    }

    @media (max-width: 768px) {
        padding: 2px; // Adjust padding for smaller screens
    }
`;

export const Icon = styled.img`
    width: 48px;
    height: 48px;
    margin-bottom: 8px;

    @media (max-width: 768px) {
        width: 36px; // Adjust icon size for tablets
        height: 36px;
    }

    @media (max-width: 480px) {
        width: 24px; // Adjust icon size for mobile
        height: 24px;
    }
`;

export const Label = styled.span`
    font-size: 14px;
    color: #333;
    text-align: center;
    @media (max-width: 768px) {
        font-size: 12px; // Adjust font size for tablets
    }

    @media (max-width: 480px) {
        font-size: 10px; // Adjust font size for mobile
    }
`;
