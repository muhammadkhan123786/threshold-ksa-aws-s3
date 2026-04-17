import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const MoreIcon = styled(DefaultImage)`
    width: 20px;
    aspect-ratio: 1;
`;

export const TableDataColumn = styled.div.attrs({ className: 'flex flex-col' })``;

export const TableDataText = styled(DefaultText)``;

export const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin: auto;
`;

export const ViewMoreLink = styled.button``;

export const ButtonRes = styled(DefaultButton)<{ $isTable?: boolean }>`
    margin: auto;
    grid-row: ${(props) => (props.$isTable ? 'span 1' : 'span 2')};
    font-size: ${(props) => (props.$isTable ? '15px' : '20px')};
    width: 100%;
`;

export const Button = styled(DefaultButton)<{ $isTable?: boolean }>`
    margin-inline-start: auto;
    font-size: 15px;
    width: fit-content;
    padding: 10px 15px;
`;

export const Section = styled.section.attrs({
    className: 'grid w-full gap-8',
})`
    width: 95%;
    align-self: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

export const CardWrapper = styled.div`
    border-radius: 15px;
    display: flex;
    width: 100%;
    flex-direction: column;
`;

export const ButtonWrapper = styled.div.attrs({
    className: '',
})`
    display: flex;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;
export const TitleRes = styled(DefaultText)`
    flex: 0 0 90%;
    text-align: start;
    font-size: 30px;
    font-weight: bold;
    margin-top: auto;
    @media (max-width: 768px) {
        flex: 0 0 0%;
    }
`;
export const Title = styled(DefaultText)`
    text-align: start;
    font-size: 30px;
    font-weight: bold;
    margin-top: auto;
`;

export const EmptyMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border: 1.5px #c0d330 solid;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
    img {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
    }
    p {
        font-size: 16px;
        color: #666;
    }
`;

export const Header = styled.div``;
