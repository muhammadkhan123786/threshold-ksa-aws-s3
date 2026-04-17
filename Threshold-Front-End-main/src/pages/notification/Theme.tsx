import styled from 'styled-components';

export const Body = styled.form.attrs({ className: 'flex flex-col justify-start items-start' })`
    padding: 30px;
    background-color: white;
`;

export const Title = styled.p`
    text-transform: capitalize;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
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
    background: white;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const NotificationHeader = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
    user-select: none;
    padding: 10px;
`;

export const NotificationItemWrapper = styled.div<{ seen?: boolean }>`
    background-color: ${({ seen }) => (seen ? '#fafafa' : '#e0efff')};
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 16px;
    width: 100%;
    height: 212px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    &:not(:first-child) {
        margin-top: 20px;
    }
    &:last-child {
        border-bottom: none;
    }
`;

export const AvatarWrapper = styled.div`
    display: flex;
    margin-inline-end: 11px;
    border-radius: 100%;
    width: 52px;
    height: 52px;
    background-color: #f044381a;

    justify-content: center;
    align-items: center;
    > img {
        width: 24px;
        height: 24px;
    }
`;

export const TitleAvatarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;

    align-items: center;
`;

export const TitleWrapper = styled.div`
    display: flex;
    width: 100%;
`;
export const TitleStatus = styled.div`
    margin-inline-start: auto;
    color: #ff1f00;
    font-weight: 600;
`;

export const NotificationTitleWrapper = styled.div``;
export const NotificationItemTitle = styled.p`
    font-size: 18px;
    font-weight: 600;
`;

export const NotificationItemDate = styled.p`
    font-size: 18px;
    font-weight: 600;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #667085;
`;
export const NotificationItemBody = styled.p`
    font-style: normal;
    font-size: 16px;
    line-height: 20px;
    color: #475467;
    margin-top: 16px;
`;
