import styled from 'styled-components';
import { Image as DefaultImage, Text as DefaultText } from 'components';

export const Body = styled.div.attrs({
    className: 'w-full flex flex-col',
})`
    grid-column: span 3;
`;

export const TableWrapper = styled.table.attrs({
    className: 'w-full table-auto',
})``;

export const TableColumnGroup = styled.colgroup``;

export const TableColumn = styled.col``;

export const TableHeader = styled.thead`
    background-color: #f6fccf;
    text-align: start;
`;

export const TableHead = styled.th`
    border-top: 1px solid #d8d4d4;
    border-bottom: 1px solid #d8d4d4;
    padding: 8px;
    text-transform: uppercase;
    text-align: start;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    text-align: start;
    text-wrap: nowrap;
`;

export const TableData = styled.td`
    border-top: 1px solid #d8d4d4;
    border-bottom: 1px solid #d8d4d4;
    padding: 10px;
    text-align: start !important;
    text-wrap: nowrap;
`;

export const EmptyTableWrapper = styled.div.attrs({
    className: 'flex flex-col justify-center items-center gap-2',
})`
    margin: auto;
    padding: 30px;
`;

export const EmptyTableIcon = styled(DefaultImage)`
    width: 30px;
    aspect-ratio: 1 / 1;
`;

export const EmptyTableText = styled(DefaultText)``;

export const Wrapper = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const TableContainer = styled.div`
    min-width: 100%;
`;

export const Table = styled.table`
    width: 100%;
    min-width: 750px; // Minimum width to prevent content from becoming too cramped
`;

export const Description = styled.div`
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 1024px) {
        max-width: 200px;
    }

    @media (max-width: 768px) {
        max-width: 150px;
    }
`;
