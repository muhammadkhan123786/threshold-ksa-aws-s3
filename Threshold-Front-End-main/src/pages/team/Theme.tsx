import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const TeamListBody = styled.div.attrs({
    className: 'flex flex-col w-full',
})``;

export const TeamBody = styled.div.attrs({ className: 'flex flex-col justify-start items-center' })`
    height: 100%;
    padding: 30px;
    gap: 50px;

    > *:nth-child(2) {
        width: 100%;
    }
`;

export const AvatarSection = styled.div.attrs({
    className: 'grid w-full',
})`
    grid-template-columns: 15% auto 15%;
    grid-template-rows: 1fr 1fr;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;

export const Avatar = styled(DefaultImage)`
    grid-row: span 2;
    width: 120px;
    aspect-ratio: 1;
    border-radius: 100%;
    margin: auto;
`;

export const Name = styled(DefaultText)`
    text-align: start;
    margin-top: auto;
    font-size: 30px;
    font-weight: bold;
`;

export const AddButton = styled(DefaultButton)<{ $isTable: boolean }>`
    margin: auto;
    grid-row: ${(props) => (props.$isTable ? 'span 1' : 'span 2')};
    font-size: ${(props) => (props.$isTable ? '15px' : '20px')};
    padding: 10px;
`;
export const Button = styled(DefaultButton)<{ $isTable: boolean }>`
    margin: auto;
    grid-row: ${(props) => (props.$isTable ? 'span 1' : 'span 2')};
    font-size: ${(props) => (props.$isTable ? '15px' : '20px')};
    width: 100%;
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
export const Title = styled(DefaultText)`
    flex: 0 0 90%;
    text-align: start;
    font-size: 30px;
    font-weight: bold;
    margin-top: auto;
    @media (max-width: 768px) {
        flex: 0 0 0%;
    }
`;
export const Section = styled.section.attrs({
    className: 'flex w-full gap-8',
})`
    flex-direction: column;
    // margin-block: 30px;
    width: 95%;
    align-self: center;

    table {
        width: 100%;
    }

    th {
        font-weight: 500;
    }

    thead,
    td {
        text-align: center;
        background-color: #fff;
        text-transform: capitalize;
        font-size: 15px;
    }

    td > div {
        margin: auto;
    }

    thead {
        background-color: #f6fccf;
    }
`;
export const SectionDivider = styled.div.attrs({ className: 'w-full grid grid-cols-[75%_25%]' })``;
