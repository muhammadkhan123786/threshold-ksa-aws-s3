import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;

    @media ${media.xs} {
        padding-right: 20px;
    }
`;

export const HeaderWrapper = styled.div``;

export const CardsWrapper = styled.div`
    display: flex;
    gap: 16px;
    justify-content: space-between;
    flex-wrap: wrap;
`;

export const Card = styled.div`
    border: 1px solid rgba(32, 32, 32, 0.08);
    box-shadow: 0px 0px 4px 0px rgba(32, 32, 32, 0.08);
    border-radius: 8px;
    padding: 16px;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    justify-content: space-between;
    flex: 1;
    background-color: white;
`;

export const FlexWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const FlexColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CardTitle = styled.p`
    color: #202403d9;
    font-weight: 500;
`;

export const CardCount = styled.p`
    color: #141400;
    font-weight: 600;
    font-size: 32px;
`;

export const CardIconWrapper = styled.div`
    background-color: hsla(67, 84.6%, 7.6%, 0.05);
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const CardTail = styled.div`
    display: flex;
    justify-content: space-between;
    color: #2024034d;
`;

export const ChartsSectionWrapper = styled.div``;

export const TabsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 20px;
`;

export const Tabs = styled.button`
    font-size: 14px;
    font-weight: bold;
    color: #8f8f8f;
    background: none;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;

    &.active {
        color: #d4d000;
        border-bottom: 2px solid #d4d000;
    }

    &:hover {
        color: #c0c000;
    }

    @media (max-width: 768px) {
        font-size: 12px;
        padding: 8px 10px;
    }
`;

export const TabContent = styled.div`
    /* padding: 20px; */
    /* background-color: #fff; */
    /* border-radius: 8px; */
    /* box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); */
`;

export const ChartHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`;

export const DateNavigator = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const DateText = styled.span`
    font-size: 14px;
    color: #666;
`;

export const ArrowButton = styled.button`
    font-size: 20px;
    padding: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #666;

    &:hover {
        color: #333;
    }
`;

export const Container = styled.div`
    width: 100%;
`;

export const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
`;

export const FilterButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

export const FilterButton = styled.button<{ isActive: boolean }>`
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: ${(props) => (props.isActive ? '#9FD359' : 'inherit')};
    cursor: pointer;
    font-size: 0.9rem;
`;

export const DateTimeControls = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
`;

export const TimeframeContainer = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

export const ChartContainer = styled.div`
    height: 300px;
    width: 100%;
    padding: 10px;
    min-height: 200px;
    max-height: 400px;
`;
export const MissionProgressContainer = styled.div`
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
        margin-bottom: 16px;
    }

    h3 {
        font-size: 18px;
        margin: 0 0 8px 0;

        @media (max-width: 768px) {
            font-size: 16px;
        }
    }

    p {
        margin: 0;
        color: #666;
        font-size: 14px;

        @media (max-width: 768px) {
            font-size: 13px;
        }
    }
`;

export const ProgressSection = styled.div`
    display: flex;
    gap: 24px;

    @media (max-width: 576px) {
        flex-direction: column;
        align-items: center;
        gap: 32px;
    }
`;

export const CircularProgress = styled.div`
    position: relative;
    width: 160px;
    height: 80px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 140px;
        height: 70px;
    }
`;

export const ProgressValue = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 32px;
    font-weight: 700;
    color: #202020;
    margin-top: 20px;
    @media (max-width: 768px) {
        font-size: 24px;
    }
`;

export const ProcessText = styled.p`
    margin: 0;
    color: #666;
    font-size: 14px;
    text-align: center;
    margin-top: 8px;
`;

export const SessionsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    width: 100%;

    @media (max-width: 576px) {
        gap: 8px;
    }
`;

export const SessionItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    @media (max-width: 768px) {
        gap: 8px;
    }

    span {
        min-width: 120px;
        font-size: 14px;

        @media (max-width: 768px) {
            min-width: 100px;
            font-size: 13px;
        }

        @media (max-width: 576px) {
            min-width: 80px;
        }
    }
`;

export const ProgressBar = styled.div<{ progress: number }>`
    flex: 1;
    height: 8px;
    background: rgba(234, 236, 240, 1);
    border-radius: 4px;
    overflow: hidden;

    &::after {
        content: '';
        display: block;
        height: 100%;
        width: ${(props) => props.progress}%;
        background: rgba(210, 225, 128, 1);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
`;

export const Value = styled.span`
    color: #666;
    font-size: 14px;
    min-width: 70px;
    text-align: right;

    @media (max-width: 768px) {
        min-width: 60px;
        font-size: 13px;
    }

    @media (max-width: 576px) {
        min-width: 50px;
    }
`;

export const SubGoalTitle = styled.p`
    color: rgba(32, 36, 3, 0.85);
    font-size: 16px;
    font-weight: 500;
`;

export const ProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

export const Divider = styled.div`
    width: 1px;
    background-color: rgba(234, 236, 240, 1);
`;

export const SubGoalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    @media (max-width: 576px) {
        gap: 8px;
    }
`;

export const DateRangeContainer = styled.div`
    display: flex;
    gap: 8px;

    @media (max-width: 576px) {
        flex-direction: column;
        gap: 4px;
    }

    p {
        font-size: 14px;
        margin: 0;

        @media (max-width: 768px) {
            font-size: 13px;
        }
    }
`;

export const WarningBadge = styled.div`
    display: flex;
    gap: 8px;
    background-color: rgba(255, 192, 0, 0.08);
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 500;
`;

export const WarningText = styled.p`
    color: rgba(255, 192, 0, 1);
`;

export const WarningSubText = styled.p`
    color: rgba(32, 36, 3, 0.3);
`;

export const ProgressValueSpan = styled.span`
    color: rgba(32, 36, 3, 0.3);
`;
