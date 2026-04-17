import styled from 'styled-components';

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: white;
    flex-wrap: wrap;
    user-select: none;
    padding: 10px;

    @media (max-width: 768px) {
        padding: 5px;
    }
`;

export const HeaderBody = styled.div`
    display: flex;
    width: 100%;
    background: #000;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const CellBody = styled.div`
    display: flex;
    width: 100%;
    overflow-x: auto;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    @media (max-width: 768px) {
        width: auto;
    }
`;

export const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    font-size: 18px;
    color: #666;
    background-color: #f2f2f2;

    @media (max-width: 768px) {
        height: 80px;
        font-size: 16px;
    }
`;

export const NoDataMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    font-size: 18px;
    color: #000;
    background-color: #f2f2f2;

    @media (max-width: 768px) {
        height: 80px;
        font-size: 16px;
    }
`;

export const ErrorMessage = styled.div`
    color: red;
    font-weight: bold;
    text-align: center;
    padding: 20px;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;
