import styled from 'styled-components';

/* ==============
   Table Wrapper
============== */
export const TableWrapper = styled.div`
    width: 100%;
    border: 1px solid #c0d330;
    border-radius: 12px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    user-select: none;
`;

/* ==============
   Table Layout
============== */
export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

/* Table Header */
export const TableHeader = styled.thead`
    background-color: #f9fbe9;
    border-bottom: 2px solid #c0d330;
`;

export const TableHeaderCell = styled.th`
    padding: 12px 16px;
    text-align: start;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    text-transform: capitalize;
    white-space: nowrap;
`;

/* Table Rows */
export const TableRow = styled.tr`
    &:hover {
        background-color: #f9fafb;
    }
`;

/* Table Cell */
export const TableCell = styled.td`
    padding: 12px 16px;
    font-size: 14px;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
`;

/* Empty Row */
export const EmptyRow = styled.tr`
    height: 60px;
    text-align: center;
    font-size: 14px;
    color: #9ca3af;
`;

/* ==============
   Reusable Styles
============== */

/* Avatar and Player */
export const AvatarContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const AvatarImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
`;

export const PlayerDetails = styled.div`
    display: flex;
    flex-direction: column;
    color: #4b5563;

    .name {
        font-weight: 600;
        color: #333;
    }

    .id {
        font-size: 12px;
        color: #9ca3af;
    }
`;

/* Badge Component */
export const Badge = styled.span<{ bgColor?: string; textColor?: string }>`
    display: inline-block;
    padding: 4px 8px;
    background-color: ${({ bgColor }) => bgColor || '#ffe3f3'};
    color: ${({ textColor }) => textColor || '#d63384'};
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
`;

/* Status Text */
export const StatusText = styled.span<{ color?: string }>`
    color: ${({ color }) => color || '#28a745'};
    font-weight: 600;
    font-size: 14px;
`;

/* Sub Text */
export const SubText = styled.span`
    display: block;
    font-size: 12px;
    color: #6b7280;
`;

/* Action Button */
export const ActionButton = styled.button`
    color: #2b6cb0;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        color: #1e4b7d;
    }
`;

export const TablePageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: #f9fbf3;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
`;

export const TableTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #6b7280;
`;

export const AddButton = styled.button`
    background-color: #c0d330;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #a2b022;
    }

    &::before {
        content: '+ ';
    }
`;
