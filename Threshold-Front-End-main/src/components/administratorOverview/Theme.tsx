import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const Body = styled.div`
    width: 99%;
    padding: 16px;
    background-color: #fff;
    @media (max-width: 768px) {
        padding: 8px;
    }
`;

export const EvenWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
`;

export const HeaderWrapper = styled.div`
    display: flex;
    gap: 24px;
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

export const ChartWrapper = styled.div`
    display: flex;
    gap: 24px;
    height: 300px;
    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
    }
`;

export const Chart = styled.div`
    width: 100%;
    min-height: 300px;
    @media (max-width: 768px) {
        min-height: 250px;
    }
`;

export const LabelWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
`;

export const CardsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const Card = styled.div`
    border: 1px solid rgba(32, 32, 32, 0.08);
    box-shadow: 0px 0px 4px 0px rgba(32, 32, 32, 0.08);
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    justify-content: space-between;
`;

export const CardTail = styled.div`
    display: flex;
    justify-content: space-between;
    color: #2024034d;
`;

export const FlexWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const FlexColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
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

export const CardTitle = styled.p`
    color: #202403d9;
    font-weight: 500;
`;

export const CardCount = styled.p`
    color: #141400;
    font-weight: 600;
    font-size: 32px;
`;

export const LegendCard = styled.div`
    display: flex;
    align-items: center;
    padding: 8px;
    margin: 4px 0;
    border-radius: 8px;
`;

export const TitleWrapper = styled.div`
    color: #20240399;
    display: flex;
    gap: 8px;
`;

export const ColorIndicator = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 8px;
    background-color: ${(props) => props.color};
    margin-right: 12px;
`;

export const Label = styled.div`
    font-size: 16px;
    color: #20240399;
`;

export const Count = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #20240399;
`;

export const ChartSection = styled.div`
    margin-top: 24px;
`;

export const ChartHeader = styled.div`
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
`;

export const ChartTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #202403;
`;

export const TeamsFilterWrapper = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

export const TeamButton = styled.button<{ isActive: boolean }>`
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    ${({ isActive }) =>
        isActive
            ? `
        background-color: hsla(67, 84.6%, 7.6%, 0.05);;
        color: rgba(192, 211, 48, 1);
    `
            : `
        background-color: transparent;
        color: #202403;
        &:hover {
            color: rgba(192, 211, 48, 1);
        }
    `}
`;

export const ChartContainer = styled.div`
    width: 100%;
    height: 300px;
    background-color: #fff;
    border: 1px solid rgba(32, 32, 32, 0.08);
    box-shadow: 0px 0px 4px 0px rgba(32, 32, 32, 0.08);
    border-radius: 8px;
    padding: 16px;

    @media (max-width: 768px) {
        height: 250px;
    }
`;
