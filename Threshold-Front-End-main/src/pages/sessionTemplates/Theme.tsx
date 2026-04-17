import styled from 'styled-components';

export const NavigationWrapper = styled.div`
    font-family: 'IBM Plex Sans Arabic', 'sans-serif';
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
    width: 96%;
    margin: 20px;
    font-size: 14px;
`;

export const NavigationButton = styled.button`
    margin-top: 20px;
    width: 190px;
    max-height: 190px;
    min-width: 190px;
    color: #c0d330;
    font-size: 14px;
    padding: 10px;
    border: 1px solid #c0d330;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;
`;
export const CreateSessionTitle = styled.p`
    font-weight: 600;
    opacity: 50%;
    color: #202020;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
`;
