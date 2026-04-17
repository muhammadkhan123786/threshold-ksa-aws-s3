import styled from 'styled-components';
import {
    Button as DefaultButton,
    Text as DefaultText,
    Image as DefaultImage,
    Loader,
} from 'components';
import { HTMLAttributes } from 'react';

interface StyledDivProps extends HTMLAttributes<HTMLDivElement> {
    hasVirtualItems: boolean;
}

export const LoadingIndicator = styled(Loader)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
`;

export const Pagination = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
    gap: 10px;

    button {
        padding: 8px 12px;
        border: 1px solid #c0d330;
        background-color: #f6fccf;
        cursor: pointer;
        &:hover {
            background-color: #c0d330;
            color: #fff;
        }
    }

    .active {
        background-color: #c0d330;
        color: #fff;
        font-weight: bold;
    }
`;

export const CardBody = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > * {
        justify-content: center;
        align-items: center;
        width: 100%;
    }
`;

export const CardHeaderRow = styled.div`
    height: 91px;
    background-color: #f7f7f7;
    display: flex;
    border-block: 1px solid #d5d4dc;
    padding: 22px;
    justify-content: start;
    align-items: center;
`;
export const CardHeaderCol = styled.div`
    margin-inline: 20px;
`;

export const CardRow = styled.div`
    display: flex;
    height: 67px;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    padding-inline: 10px;
`;

export const CardCol = styled.div`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const CardHeader = styled.div`
    display: flex;
    width: 100%;
    background-color: #f6fccf;
    text-align: start;
    font-size: 14px;
    font-weight: 500;
    padding-inline: 10px;
`;

export const CardHead = styled.div`
    border-top: 1px solid #d8d4d4;
    border-bottom: 1px solid #d8d4d4;
    padding: 8px;
    text-transform: uppercase;
    text-align: start;
    flex: 1;
`;
export const MoreIcon = styled(DefaultImage)`
    width: 20px;
    aspect-ratio: 1;
`;

export const TableDataColumn = styled.div.attrs({ className: 'flex flex-col' })``;

export const TableDataText = styled(DefaultText)``;

export const AvatarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; // Ensure no content is hidden
    width: 100px; // Adjust as needed
    height: 100px; // Adjust as needed
    @media (max-width: 768px) {
        width: 80px; // Adjust size for smaller screens
        height: 80px; // Adjust size for smaller screens
    }
`;

export const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin: auto;
    @media (max-width: 768px) {
        width: 80px; // Adjust size for smaller screens
        height: 80px; // Adjust size for smaller screens
    }
`;

export const ViewMoreLink = styled.button``;

export const Button = styled(DefaultButton)<{ $isTable?: boolean }>`
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

export const Section = styled.section.attrs({
    className: 'flex w-full gap-8',
})`
    flex-direction: column;
    margin-block: 30px;
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

export const ScrollWrapper = styled.div`
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
`;

// Adjust your TableWrapper to make it more mobile-friendly
export const TableWrapper = styled.div`
    width: 100%;
    overflow-x: auto; /* Make sure the table can scroll if content overflows */
    display: block; /* Ensure the table doesn't shrink */
    box-shadow: 0px 0px 1px 1px #c0d330;
    border: 1.5px solid #c0d330;
    border-radius: 15px;
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

export const TableContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`;

export const TableBody = styled.div<StyledDivProps>`
    grid-column: span 3;
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 100%;
    background: white;
    height: ${(props) => (props.hasVirtualItems ? '500px' : '150px')};
    border: 1px solid #ccc;
`;

export const TableContent = styled.div<StyledDivProps>`
    width: 95%;
    overflow: ${(props) => (props.hasVirtualItems ? 'auto' : 'unset')};
    &.scrollable {
        scrollbar-width: thin;
        scrollbar-color: #c0d330 #f3f3f3;
    }

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f3f3f3;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #c0d330;
        border-radius: 10px;
        border: 2px solid #f3f3f3;
    }
`;

export const EmptyTableIcon = styled(DefaultImage)`
    width: 30px;
    aspect-ratio: 1 / 1;
`;

export const EmptyTableWrapper = styled.div.attrs({
    className: 'flex flex-col justify-center items-center gap-2',
})`
    margin: auto;
    padding: 30px;
`;

export const EmptyTableText = styled(DefaultText)``;

export const TableResWrapper = styled.table.attrs({
    className: 'w-full table-auto',
})``;
export const TableHeaderWrapper = styled.thead.attrs({
    className: 'bg-gray-50 bg-gray-50 sticky top-0 z-20',
})``;
export const TableResBody = styled.tbody.attrs({
    className: '',
})``;
export const TableRow = styled.tr.attrs({
    className: '',
})``;
export const TableCell = styled.td.attrs({
    className: 'px-6 py-4 ',
})`
    text-wrap: nowrap;
`;
export const TableCellEmpty = styled.td.attrs({
    className: 'text-center py-4',
})``;
export const TableCellData = styled.th.attrs({
    className: 'px-6 py-3 font-semibold text-left',
})``;
export const TableCellButton = styled.button.attrs({
    className: 'flex items-center w-full',
})`
    text-wrap: nowrap;
`;
