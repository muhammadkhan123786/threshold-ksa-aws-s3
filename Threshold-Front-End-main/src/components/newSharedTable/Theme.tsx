import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const TableWrapper = styled.table`
    /* width: 100%;
    border-collapse: collapse; */
    min-width: 100%;
    margin-top: 20px;
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    margin: 20px;
`;

export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }

    &:hover {
        background-color: #c0d33014;
    }
`;

export const TableHeader = styled.th`
    padding: 12px 16px;
    font-weight: bold;
    color: #333;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background-color: #c0d33014;
    opacity: 50%;
    text-align: justify;
`;

export const TableCell = styled.td`
    text-align: justify;
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    color: #555;
    font-size: 12px;
    font-weight: 400;
`;
export const TableCellNoData = styled.td`
    text-align: justify;
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    color: #555;
    font-size: 12px;
    font-weight: 400;
`;
export const PersonInfoElement = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;
export const TableCellNoDataDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const PersonImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
`;

export const PersonTextContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PersonName = styled.p`
    font-weight: bold;
    margin: 0;
`;

export const PersonAge = styled.p`
    font-size: 14px;
    color: #666;
`;
export const StatusBar = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #f4f4f4;
    border-bottom: 1px solid #ddd;
    margin: 20px;
`;

export const Button = styled.button`
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
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
export const NotDeliveredPara = styled.p`
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    @media ${media.md} {
        font-size: 12px;
        justify-content: flex-start;
    }
`;
export const UsersNumberTable = styled.p`
    color: #2020204d;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    justify-content: center;
    padding: 5px;
    align-items: center;
`;
export const ParaMissingClothes = styled.p`
    font-size: 14px;
    color: #000000;
    margin: 4px 0;
    line-height: 1.5;
`;
export const ClothesMissingWrapper = styled.div`
    display: flex;
`;
export const SpanPostion = styled.span`
    color: #25badc;
    padding: 5px;
    border-radius: 12px;
    background-color: #25badc0a;
    font-weight: 600;
`;
export const SpanContracter = styled.span`
    color: #039855;
    padding: 5px;
    font-size: 14px;
    border-radius: 12px;
    font-weight: 600;
`;
export const ButtonIcon = styled.img`
    height: 16px;
    width: 16px;
    margin: 5px;
`;
export const SpanNoData = styled.span`
    font-size: 32px;
    font-weight: 700;
    color: #141400;
    opacity: 0.4;
`;
export const SkeletonRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

export const SkeletonCell = styled.td`
    height: 75px;
    margin: 5px 0;
`;
export const SkeletonCellSpan = styled.span`
    display: block;
    height: 12px;
    background: linear-gradient(to right, #eee 20%, #ddd 50%, #eee 80%);
    background-size: 500px 100px;
    animation: moving-gradient 2.5s infinite linear;
    width: 60% !important;
    height: 30px;
    display: flex;
    justify-content: start;
    align-items: start;
    border-radius: 8px;
    @keyframes moving-gradient {
        0% {
            background-position: -250px 0;
        }
        100% {
            background-position: 250px 0;
        }
    }
`;
