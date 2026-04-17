import styled from 'styled-components';
import { Button as DefaultButton } from 'components';

export const UpdateButton = styled(DefaultButton)`
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #c0d330;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    &:hover {
        color: #fcfcfd;
        background-color: #000;
    }
`;

export const DocumentBox = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    width: 400px;
`;

export const DocumentInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const DocumentType = styled.div`
    font-weight: bold;
    font-size: 16px;
`;

export const LastUpdate = styled.div`
    font-size: 12px;
    color: #777;
`;

export const Actions = styled.div`
    display: flex;
    gap: 10px;
`;

export const ActionIcon = styled.div`
    font-size: 16px;
    color: #555;
    cursor: pointer;

    &:hover {
        color: #000;
    }
`;

export const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
`;

export const OverlayText = styled.p`
    font-size: 1.5rem;
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
`;

export const documentsContainer = styled.button`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 20px;
    flex-direction: row;
    border: 2px dashed #ccc;
    border-radius: 7px;
    min-height: 100px;
    width: 100%;
    justify-content: center;
    flex-direction: column;
`;

export const Body = styled.div`
    width: 100%;
    display: flex;
    margin-block: 10px;
    position: relative;
    justify-content: center;
    align-items: center;
    border: 1px dashed #ccc;
    padding: 10px;
    flex-direction: row;
`;

export const ProgressBar = styled.div`
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 10px;
    margin: 10px 0;
`;

export const Progress = styled.div`
    background-color: #76c7c0;
    height: 100%;
    transition: width 0.3s ease;
`;

export const HintContainer = styled.div`
    margin-top: 20px;
    padding: 20px 25px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
`;

export const MainMessage = styled.h3`
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
    text-align: start;
    color: #4a4a4a;
`;

export const Divider = styled.hr`
    border: 0;
    height: 1px;
    background: #ddd;
    margin: 10px 0;
`;

export const HintList = styled.ul`
    list-style-type: none;
    padding-left: 0;
    margin: 0;
    color: #555;
    font-size: 14px;
`;

export const HintItem = styled.li`
    position: relative;
    margin-bottom: 12px;
    padding-left: 30px;
    color: #3c3c3c;
    font-weight: 600;
    &:before {
        content: '✔';
        position: absolute;
        left: 0;
        top: 0;
        color: #c0d330; /* Primary accent color */
        font-size: 18px;
        font-weight: bold;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

export const UploadIcon = styled.img`
    width: 50px;
    aspect-ratio: 1 / 1;

    border-radius: 100%;
`;
