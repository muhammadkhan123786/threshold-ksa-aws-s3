import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const Body = styled.form`
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 96%;
    margin: 0px 20px;
    transition: all 0.3s ease;
`;
export const UsersNumberTable = styled.p`
    color: #2020204d;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    justify-content: center;
    padding: 5px;
    align-items: center;
    @media ${media.md} {
        font-size: 12px;
        justify-content: flex-start;
    }
`;
export const ButtonsWrapper = styled.button`
    min-width: 132px;
    margin: 10px 10px;
    width: auto;
    background-color: #c0d330;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;

    &:hover {
        background-color: #c0d330;
    }

    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;
export const StatusBar = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    margin: 16px 5px;

    @media ${media.xs} {
        flex-direction: column;
    }
    p {
        @media ${media.xs} {
            align-self: flex-end;
        }
    }
`;
export const ButtonIcon = styled.img`
    height: 16px;
    width: 16px;
    margin: 5px;
`;
export const YearGoalComponent = styled.div`
    border: 1px solid black;
    display: flex;
    min-height: 110px;
    border-radius: 8px;
    justify-content: space-between;
    align-items: center;

    @media ${media.xs} {
        flex-direction: column;
    }
`;
export const ButtonWrapper = styled.div`
    padding: 24px 10px;
    display: flex;

    @media ${media.xs} {
        order: 2;
    }
`;
export const ButtonRedirect = styled.button`
    justify-content: space-around;
    align-items: center;
    border: 1px solid;
    padding: 8px 12px;
    border-radius: 10px;
    width: 100%;
    max-width: 150px;
    display: flex;
    font-size: 14px;
    color: #20240399;
    opacity: 0.5;
    font-weight: 600;
`;
export const GoalTitleWrapper = styled.div`
    padding: 24px 10px;
    display: flex;
    flex-direction: column;
    text-align: center;
    color: #141400;
`;
export const GoaloftheYearText = styled.span`
    display: flex;
    font-size: 24px;
    font-weight: 600;
    justify-content: center;
    align-items: center;
    margin: auto;
`;
export const SmallTextSpan = styled.span`
    font-size: 14px;
    font-weight: 600;
    opacity: 0.5;
`;
export const ButtonOpenModal = styled.button`
    margin: 5px;
`;
export const EmptyDiv = styled.div`
    @media ${media.sm} {
        display: none;
    }
`;
export const TableWrapper = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    margin: 20px;
    table-layout: fixed;
    overflow-x: none;
    -webkit-overflow-scrolling: none;
    @media (max-width: 1200px) {
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
`;
