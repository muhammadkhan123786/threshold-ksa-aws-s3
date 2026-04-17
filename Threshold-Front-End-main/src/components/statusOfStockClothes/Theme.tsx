import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const ClothesCardsWrapper = styled.div`
    display: flex;
    // flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    padding: 20px;
    width: 100%;

    @media ${media.md} {
        flex-direction: column;
    }
`;

export const ClothesCard = styled.div`
    flex: 1;
    min-width: 275px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;

    img {
        width: 56px;
        height: 56px;
        object-fit: cover;
        margin-bottom: 10px;
    }
`;

export const ItemName = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #20202099;
    margin-bottom: 5px;
`;

export const TotalStock = styled.span`
    font-size: 24px;
    font-weight: 600;
    color: #555;
    margin: 5px 0;
`;

export const Sizes = styled.div`
    font-size: 14px;
    color: #555;
    font-weight: 500;
    display: flex;
    flex-wrap: wrap-reverse;
    gap: 10px;
    margin-top: 8px;
    span {
        display: flex;
        align-items: center;
        gap: 3px;
    }
`;

export const Number = styled.span`
    color: #039855;
    font-weight: bold;
`;

export const OutOfStockMessage = styled.span`
    font-size: 18px;
    color: red;
    font-weight: 600;
    width: 210px;
`;

export const LineHR = styled.hr`
    border: none;
    height: 1px;
    background-color: #eaecf0;
    width: 100%;
    opacity: 60%;
`;
export const ShowMore = styled.span`
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
    color: #039855;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
        color: #00ff8c;
    }
`;
