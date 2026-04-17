import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const CoachListBody = styled.div.attrs({
    className: 'flex flex-col w-full',
})``;

export const CoachDetailsBody = styled.div`
    padding: 24px 30px;
    gap: 50px;
    // border: 1px solid red;
`;

export const HeaderWrapper = styled.div`
    border: 1px solid blue;
    display: flex;
    justify-content: space-between;
`;

export const TabsContainer = styled.div`
    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
    margin-top: 96px;
`;

export const TabsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap; // Allow tabs to wrap on small screens
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 20px;
`;

export const Tabs = styled.button`
    font-size: 14px; // Smaller font size for mobile
    font-weight: bold;
    color: #8f8f8f;
    background: none;
    border: none;
    padding: 10px 15px; // Adjust padding for better spacing on mobile
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1; // Make tabs take equal space on small screens

    &.active {
        color: #d4d000;
        border-bottom: 2px solid #d4d000;
    }

    &:hover {
        color: #c0c000;
    }

    // Add media query for mobile responsiveness
    @media (max-width: 768px) {
        font-size: 12px; // Adjust font size for smaller screens
        padding: 8px 10px; // Adjust padding for smaller screens
    }
`;

export const TabContent = styled.div`
    /* padding: 20px; */
    /* background-color: #fff; */
    /* border-radius: 8px; */
    /* box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); */
`;
