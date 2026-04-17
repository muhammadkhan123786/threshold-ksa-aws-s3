import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const TableTitle = styled(DefaultText)`
    text-transform: uppercase;
    font-size: 20px;
    margin: 50px 0 10px 0;
    font-weight: bold;
`;

export const TableContainer = styled.div.attrs({
    className: ' w-full',
})`
    border-radius: 10px;
    box-shadow: 0px 0px 10px 3px #cdc9e2;
    padding: 20px;

    thead {
        background-color: #f3f3f3;
    }
`;

export const TableFilteContainer = styled.div.attrs({
    className: '',
})`
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    margin-block-end: 20px;
    @media (max-width: 767px) {
        justify-content: center;
        flex-direction: column;
        display: flex;
        align-self: center;
        justify-content: center;
        align-items: center;
    }
`;

export const TableFilterSearchContainer = styled.div.attrs({
    className: '',
})`
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    @media (max-width: 767px) {
        flex-direction: column;
        display: flex;
        gap: 0px;
    }
`;
export const FilterWrapper = styled.div`
    display: flex;
    @media (max-width: 767px) {
        flex-direction: column;
        display: flex;
        gap: 0px;
    }
`;
export const FilterButton = styled(DefaultButton).attrs({
    className: 'flex items-center justify-center gap-3',
})`
    padding: 0 20px;
    margin-left: 20px;
    background-color: transparent;
    color: #000;
    font-weight: normal;
    text-transform: none;
    font-size: 23px;
    border: 1px solid #cdc9e2;
    &:hover {
        background-color: transparent;
    }
`;

export const FilterBody = styled.div`
    display: flex;
    width: 100%;
`;
export const FilterIcon = styled(DefaultImage)`
    width: 20px;
    height: 20px;
`;

export const SearchWrapper = styled.div.attrs({ className: 'flex items-center gap-3' })`
    background-color: #f3f3f3;
    padding: 17px 20px;
    border-radius: 10px;
    width: fit-content;
    height: fit-content;
    margin: auto 0;
    // margin-bottom: 20px;
`;

export const SearchBox = styled.input.attrs({ type: 'text' })`
    background-color: #f3f3f3;
    height: 20px;

    &:focus {
        border-color: transparent;
        outline: none;
    }
`;

export const SearchIcon = styled(DefaultImage)`
    height: 35%;
    aspect-ratio: 1;
`;

export const AddButton = styled(DefaultButton)`
    padding: 0 20px;
    margin-left: 20px;
    color: #fff;
    font-weight: normal;
    font-size: 20px;
    transition: background-color 0.3s ease;
    min-width: fit-content;
`;

export const Title = styled(DefaultText)`
    text-align: start;
    font-size: 30px;
    font-weight: bold;
    margin-top: auto;
    margin-bottom: 2rem;
`;

export const TableTabsWrapper = styled.div.attrs({
    className: 'flex justify-start items-center',
})`
    gap: 20px;
`;

export const TableTab = styled.button<{ $isActive: boolean }>`
    font-size: 20px;
    position: relative;
    background-color: transparent;
    color: #000;
    min-width: fit-content;
    font-weight: normal;
    margin: 0;
    text-transform: none;

    &::after {
        content: '';
        transition: 0.3s ease-in-out;
        position: absolute;
        opacity: ${(props) => (props.$isActive ? 1 : 0)};
        width: 100%;
        height: 3px;
        background-color: #000;
        bottom: -7px;
        left: 0px;
    }

    &:hover {
        background-color: transparent;
    }
`;

export const TableUnderline = styled.div`
    height: 1.5px;
    width: 100%;
    background-color: #cdc9e2;
    margin-top: 5px;
`;
