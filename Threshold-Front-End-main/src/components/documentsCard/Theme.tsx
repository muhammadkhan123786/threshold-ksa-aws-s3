import styled from 'styled-components';

export const CardContainer = styled.div`
    width: 350px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
    margin: 16px;
    font-family: Arial, sans-serif;
    position: relative;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Title = styled.h3`
    font-size: 16px;
    margin: 0;
    color: #333;
`;

export const PrintButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    background: #c0d330;
    color: white;
    border: none;
    border-radius: 8px;
    width: 55x;
    height: 35px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 8px 16px;
`;

export const Content = styled.div`
    padding: 16px;
    text-align: center;
    position: relative;
`;

export const Footer = styled.div`
    padding: 10px;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #777;
    background-color: #f9f9f9;
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;

export const ActionButton = styled.button<{ delete?: boolean }>`
    // background-color: ${(props) => (props.delete ? '#f44336' : '#4caf50')};
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
`;

export const ActionIcon = styled.div`
    cursor: pointer;
    display: inline-block;
    font-size: 20px;
    margin: 0 8px;
    color: #4caf50;
`;

export const DocumentImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 8px;
`;
