import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const TableWrapper = styled.table`
    width: 100%;
    border-collapse: collapse;
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
    font-size: 14px;
`;
export const PersonInfoElement = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;
export const StatusBar = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #f4f4f4;
    border-bottom: 1px solid #ddd;
    margin: 20px;
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
export const ButtonIcon = styled.img`
    height: 16px;
    width: 16px;
    margin: 5px;
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
