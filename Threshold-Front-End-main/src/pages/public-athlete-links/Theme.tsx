import styled from 'styled-components';
import { Button, Text as DefaultText } from 'components';

export const Body = styled.div.attrs({
    className: 'flex flex-col w-full gap-10',
})``;

export const HeaderWrapper = styled.div.attrs({
    className: 'flex w-full h-fulll',
})`
    grid-template-columns: 80% 20%;
    row-gap: 10px;
`;

export const Title = styled(DefaultText)`
    font-size: 40px;
    text-align: start;
    font-weight: 600;
`;

export const TableContainer = styled.div.attrs({
    className: 'flex w-full h-full w-full min-h-[500px]',
})``;

export const AddButton = styled(Button).attrs({
    className: 'w-fit',
})`
    box-shadow: 0px 0px 7px 3px #d8d4d4;
    font-size: 14px;
    padding: 0px 10px;

    margin-inline-start: auto;
`;
