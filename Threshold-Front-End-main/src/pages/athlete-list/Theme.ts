import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div.attrs({
    className: 'flex flex-col w-full',
})``;

export const HeadBoxesWrapper = styled.div.attrs({
    className: 'flex justify-between items-center w-full',
})`
    @media (max-width: 767px) {
        flex-direction: column;
        row-gap: 20px;
    }
`;

export const HeadBoxContainer = styled.div.attrs({ className: 'grid grid-cols-2' })`
    grid-template-rows: 1fr 2fr;
    border: 2px solid #c0d330;
    height: 100%;
    width: 30%;
    padding: 20px;
    gap: 20px;
    font-size: 20px;
    border-radius: 6px;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

export const HeadBoxTitle = styled(DefaultText)`
    margin: auto 0;
    grid-column: span 2;
    height: fit-content;
    font-weight: bold;
`;

export const HeadBoxIcon = styled(DefaultImage)`
    margin: auto 0;
    width: 50px;
`;

export const HeadBoxNumber = styled(DefaultText)`
    margin: auto;
`;
