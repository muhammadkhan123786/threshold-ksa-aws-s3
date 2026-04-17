import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const PersonInfoElement = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
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

export const TableRow = styled.tr`
    cursor: pointer;
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
    border-bottom: 1px solid #ddd;
    background-color: #c0d33014;
    opacity: 50%;
    text-align: justify;
    white-space: nowrap;
    @media ${media.sm} {
        font-size: 10px;
    }
`;

export const TableCell = styled.td`
    text-align: justify;
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    color: #555;
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    @media ${media.sm} {
        font-size: 10px;
        padding: 10px 12px;
    }
`;

export const StatusBar = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #f4f4f4;
    margin: 20px;

    @media ${media.sm} {
        flex-direction: column;
        padding: 0 10px;
        gap: 0px;
        height: 100px;
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
    @media ${media.md} {
        font-size: 12px;
        justify-content: flex-start;
    }
`;

export const ButtonIcon = styled.img`
    height: 16px;
    width: 16px;
    margin: 5px;
`;
export const ResponsiveTableContainer = styled.div`
    width: 100%;
    overflow-x: none;
    -webkit-overflow-scrolling: none;
    @media (max-width: 1200px) {
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    & > * {
        min-width: 100%;
    }

    & > * {
        min-width: max(100%, 900px);
    }
`;

export const TableWrapper = styled.div`
    width: 100%;
    padding: 16px;
    border-radius: 8px;

    @media (max-width: 950px) {
        padding: 16px 0;
    }
`;

export const Wrapper = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const TableContainer = styled.div`
    min-width: 100%;
`;

export const Table = styled.table`
    width: 100%;
    min-width: 750px;
`;

export const Description = styled.div`
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 1024px) {
        max-width: 200px;
    }

    @media (max-width: 768px) {
        max-width: 150px;
    }
`;
