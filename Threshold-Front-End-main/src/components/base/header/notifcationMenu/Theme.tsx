import styled from 'styled-components';

export const Body = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 15px;
`;

export const NotificationIcon = styled.div<{ badgeNumber: number }>`
    position: relative;
    cursor: pointer;
    width: 24px;
    height: 24px;

    img {
        width: 100%;
        height: 100%;
    }

    &::after {
        content: '${(props) => props.badgeNumber}';
        display: ${(props) => (props.badgeNumber > 0 ? 'block' : 'none')};
        position: absolute;
        top: -5px;
        right: -5px;
        background: red;
        color: white;
        border-radius: 50%;
        padding: 0 5px;
        font-size: 12px;
    }
`;

export const NotificationMenuContainer = styled.div`
    position: absolute;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    min-width: 300px;
    min-height: 200px;
    max-height: 450px;
    overflow: auto;
    z-index: 1000;
`;

export const NotificationHeader = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
    user-select: none;
    padding: 10px;
`;

export const NotificationItem = styled.div<{ seen?: boolean }>`
    padding: 8px 0;
    border-bottom: 1px solid #ccc;
    background-color: ${({ seen }) => (seen ? 'white' : '#e0efff')};
    padding: 16px;

    &:last-child {
        border-bottom: none;
    }
`;
