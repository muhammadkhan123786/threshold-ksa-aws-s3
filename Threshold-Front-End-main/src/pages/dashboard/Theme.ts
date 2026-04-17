import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div.attrs({
    className: 'flex flex-col w-full gap-10',
})``;

export const HeaderWrapper = styled.div.attrs({
    className: 'flex flex-col',
})`
    grid-template-columns: 80% 20%;
    row-gap: 10px;
`;

export const Title = styled(DefaultText)`
    font-size: 40px;
    text-align: start;
    font-weight: 600;
`;

export const Subtitle = styled(DefaultText)``;

export const FiltersButton = styled(DefaultButton).attrs({
    className: 'flex justify-center items-center gap-3',
})`
    width: fit-content;
    background-color: white;
    padding: 0px 20px;
    border: 1px solid #d0d5dd;
    text-transform: capitalize;
    font-weight: 500;
    margin: auto;

    &:hover {
        background-color: #f3f3f3;
    }
`;

export const FiltersText = styled(DefaultText)`
    color: black;
`;

export const FiltersIcon = styled(DefaultImage)``;

export const ActiveAthletesWrapper = styled.div.attrs({
    className: 'flex flex-col justify-center items-center gap-2',
})`
    background-color: #00edaf;
    width: 400px;
    aspect-ratio: 3 / 1;
    border-radius: 15px;
    color: white;
`;

export const InActiveAthletesWrapper = styled.div.attrs({
    className: 'flex flex-col justify-center items-center gap-2',
})`
    background-color: #ff6347;
    width: 400px;
    aspect-ratio: 3 / 1;
    border-radius: 15px;
    color: white;
`;

export const ActivePhrase = styled(DefaultText)`
    font-size: 20px;
    font-weight: 500;
`;

export const ActiveCounter = styled(DefaultText)`
    font-size: 30px;
    font-weight: 700;
`;

export const TableContainer = styled.div.attrs({
    className: 'grid w-full',
})`
    grid-template-columns: 12% auto 20%;
    grid-template-rows: 1fr;
    gap: 20px;

    table {
        grid-column: span 3;
    }

    colgroup {
        & col {
            width: auto;
        }

        & col:first-child {
            width: 10%;
        }

        & col:nth-last-child(2) {
            width: 10%;
        }

        & col:last-child {
            width: 5%;
        }
    }

    thead {
        background-color: #f3f3f3;
    }
`;

export const ActiveBarBody = styled.div`
    > div {
        margin-inline-end: 20px;
    }
`;
