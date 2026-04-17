import styled from 'styled-components';
import { Button } from 'components';
export const DrillContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    width: 100%;
    @media (max-width: 767px) {
        flex-direction: column;
        gap: 20px;
    }
`;

export const DrillImageBody = styled.div`
    width: 40%;
    height: auto;
    border-radius: 8px;
    height: 500px;
    border: 1px solid #e0e2e7;
    padding: 24px;
    background-color: white;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

export const DrillImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 5px;
    height: 100%;
    overflow: hidden;
    background-size: contain;
    border: 2px dashed #e0e2e7;
    background-color: #f9f9fc;
    padding: 0 10px;
    border-radius: 8px;
    max-width: 450px;
    margin-inline: auto;
`;

export const DrillDetails = styled.div`
    padding: 20px;
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: white;
    height: 100%;

    display: flex;
    flex-direction: column;
`;

export const DrillTitle = styled.h3`
    color: #555;
    font-size: 14px;
    font-weight: 500;
`;

export const DrillDescription = styled.p`
    margin: 10px 0;
    margin-inline-start: 10px;
    color: #555;
    font-size: 1rem;
`;

export const DrillInfoContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
`;

export const DrillInfoColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export const DrillInfoItem = styled.div`
    margin-bottom: 10px;
    font-size: 1rem;

    & > span {
        font-weight: bold;
    }

    &:before {
        content: '• ';
        color: #555;
        font-size: 1.5rem;
        vertical-align: middle;
    }
`;

export const RemoveDrillLink = styled(Button)`
    margin-top: auto;
    color: red;
    cursor: pointer;
    display: block;
    text-align: start;
    text-decoration: none;
    background-color: transparent;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-decoration-line: underline;
    color: #f5143c;
    width: fit-content;
    padding: 10px;
    &:hover {
        text-decoration: underline;
    }
`;

export const UpdateDrillLink = styled(Button)`
    margin-top: auto;
    color: red;
    cursor: pointer;
    display: block;
    text-align: start;
    text-decoration: none;
    background-color: transparent;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-decoration-line: underline;
    color: #c0d330;
    width: fit-content;
    padding: 10px;
    &:hover {
        text-decoration: underline;
    }
`;

export const SectionTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 14px;
`;

export const ImageTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
`;

export const Footer = styled.div`
    display: flex;
    margin-top: auto;
    width: 100%;
    > * {
        width: 50%;
    }
`;
