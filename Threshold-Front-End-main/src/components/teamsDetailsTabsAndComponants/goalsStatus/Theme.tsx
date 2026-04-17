import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const Body = styled.form`
    padding: 15px;
    background-color: white;
    width: 100%;
`;
export const Weak = styled.ul`
    list-style-type: disc;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media ${media.sm} {
        flex-direction: column;
        gap: 16px;
        margin-bottom: 8px;
    }
`;
export const MonthTitle = styled.ol`
    list-style-type: decimal;
    font-size: 18px;
    font-weight: 500;
`;
export const ButtonOpenModal = styled.button`
    margin: 5px;
`;
export const WeekItem = styled.li`
    list-style-type: disc;
    display: flex;
    flex-direction: row;
    gap: 8px;
    font-size: 12px;

    @media ${media.sm} {
        justify-content: space-between;
    }
`;

export const WeekTitle = styled.li`
    font-weight: bold;
    color: #333;
    padding: 5px 5px;
    border-radius: 8px;
`;

export const WeekDescription = styled.span`
    font-size: 12px;
    font-weight: 500;
    padding: 0px 2px;
`;

export const WeekDetails = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #2024034d;
    padding: 0px 2px;
`;
export const DataItem = styled.div`
    padding: 5px 5px;
    height: fit-content;
    border-radius: 8px;
    background-color: #03985514;
`;

export const ProgressBar = styled.div`
    margin-top: 10px;
    width: 200px;
`;

export const ProgressTrack = styled.div`
    background-color: #e0e0e0;
    height: 10px;
    border-radius: 5px;
    width: 100%;
`;

export const ProgressFill = styled.div`
    background-color: #d2e180;
    height: 100%;
    border-radius: 5px;
    transition: width 0.3s ease;
`;

export const ProgressText = styled.span`
    margin-top: 5px;
    font-size: 12px;
    color: #333;
    text-align: right;
    display: flex;
    justify-content: space-between;
`;
