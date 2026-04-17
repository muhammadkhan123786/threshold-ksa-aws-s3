import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const ClothesNeededWrapper = styled.div`
    padding: 20px;
    width: 40%;
    margin: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media ${media.sm} {
        width: 100%;
    }
`;

export const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    p {
        font-size: 18px;
        font-weight: 600;
    }
`;

export const DownloadButton = styled.button`
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;

    img {
        width: 16px;
        height: 16px;
    }
`;

export const ClothesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const ClothesItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
`;

export const ItemName = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #333;
`;

export const Sizes = styled.span`
    font-size: 14px;
    color: #555;
`;
export const Separator = styled.hr`
    border: none;
    height: 1px;
    background-color: #eaecf0;
    margin: 8px 0;
`;
export const SpanSummarizedNum = styled.span`
    color: #039855;
    font-weight: 500;
    padding: 0px 5px;
`;
export const SpanSummarizedSize = styled.span`
    color: #202020d9;
    font-weight: 500;
`;
