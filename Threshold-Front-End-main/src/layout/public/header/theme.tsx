import { Image } from 'components';
import styled from 'styled-components';

export const Body = styled.div`
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 50;
    padding: 20px;

    background-color: #000;
`;

export const LocaleButtonContainer = styled.button`
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border: 2px solid #c0d330;
    border-radius: 30px;
    background: transparent;
    cursor: pointer;
    font-size: 1rem;
    color: #c0d330;
    transition: background-color 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    img {
        margin-left: 0.5rem;
    }
`;

export const LocaleButtonText = styled.span`
    margin-left: 0.5rem;
`;

export const Logo = styled.img`
    width: 120px;
    height: auto;
    justify-content: start;
    align-items: start;

    margin-inline-end: auto;
`;
