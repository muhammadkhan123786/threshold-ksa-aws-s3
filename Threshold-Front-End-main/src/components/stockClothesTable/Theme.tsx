import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

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
    font-size: 14px;
    font-weight: 600;
    width: auto;
    background-color: #f4f4f4;
    color: #c0d330;
    border: 1px solid #c0d330;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;
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
export const UsersNumberTable = styled.p`
    color: #2020204d;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    justify-content: center;
    padding: 5px;
    align-items: center;
    padding: 20px;
    @media ${media.md} {
        font-size: 12px;
        justify-content: flex-start;
    }
`;
export const Li = styled.li`
    font-size: 14px;
    font-weight: 600;
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
export const ParaPurchaseHistory = styled.p`
    display: flex;
    font-size: 14px;
    color: #000000;
    margin: 4px 0;
    line-height: 1.5;
    justify-content: center;
    align-items: center;
`;
export const ParaAndButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;
export const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    button {
        padding: 5px 10px;
        margin: 0 5px;
        cursor: pointer;
        border: none;
        background-color: #f0f0f0;
        border-radius: 4px;

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    span {
        margin: 0 10px;
    }
`;
export const PaginationWrapperButton = styled.div`
    display: flex;
`;
