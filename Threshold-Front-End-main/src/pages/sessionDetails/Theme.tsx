import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div`
    height: 100%;
    padding: 30px;
    gap: 50px;
    // border: 1px solid red;
`;

export const LeftWrapper = styled.div`
    width: 30%;
    height: 600px;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;

    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #c0d330 #f3f3f3;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f3f3f3;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #c0d330;
        border-radius: 10px;
        border: 2px solid #f3f3f3;
    }
`;

export const RightWrapper = styled.div`
    width: 78%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
export const TitleSpan = styled.div`
    color: #c0d330;
    margin: 18px 10px 0px 20px !important;
    font-weight: 600;
    font-size: 18px;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th,
    td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #f9f9f9;
    }

    td input {
        width: 100%;
        padding: 5px;
    }
`;

export const Wrapper = styled.div`
    display: flex;
    gap: 20px;
    margin: 20px;
`;
