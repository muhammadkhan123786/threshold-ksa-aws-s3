import React, { useState, useMemo } from 'react';
import {
    TableWrapper,
    Table,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableCell,
    EmptyRow,
} from './Theme';

interface Column<T> {
    key: string;
    header: string;
    cell: (item: T) => React.ReactNode;
    width?: string;
    sortable?: boolean;
    sortFunction?: (a: T, b: T) => number;
}

interface SharedTableProps<T> {
    data: T[];
    columns: Column<T>[];
    emptyMessage?: string;
}

const SharedTable = <T,>({
    data,
    columns,
    emptyMessage = 'No data available',
}: SharedTableProps<T>) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortedData = useMemo(() => {
        if (!sortColumn) return data;

        const column = columns.find((col) => col.key === sortColumn);
        if (!column || !column.sortable) return data;

        const sorted = [...data].sort((a, b) => {
            if (column.sortFunction) {
                return column.sortFunction(a, b) * (sortDirection === 'asc' ? 1 : -1);
            }

            const aValue = (a as any)[sortColumn];
            const bValue = (b as any)[sortColumn];
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [data, sortColumn, sortDirection, columns]);

    const handleSort = (columnKey: string, sortable: boolean | undefined) => {
        if (!sortable) return;

        if (sortColumn === columnKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    return (
        <TableWrapper>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHeaderCell
                                key={column.key}
                                style={{ width: column.width || 'auto' }}
                                onClick={() => handleSort(column.key, column.sortable)}
                                className={column.sortable ? 'cursor-pointer' : ''}
                            >
                                <div className="flex items-center">
                                    {column.header}
                                    {column.sortable && sortColumn === column.key && (
                                        <img
                                            src={
                                                sortDirection === 'asc'
                                                    ? '/assets/icons/side-down-icon.svg'
                                                    : '/assets/icons/side-up-icon.svg'
                                            }
                                            alt={`Sort ${sortDirection}`}
                                            width={16}
                                            height={16}
                                            className="ms-[16px]"
                                        />
                                    )}
                                </div>
                            </TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHeader>

                <tbody>
                    {sortedData.length > 0 ? (
                        sortedData.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>{column.cell(row)}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <EmptyRow>
                            <TableCell colSpan={columns.length}>{emptyMessage}</TableCell>
                        </EmptyRow>
                    )}
                </tbody>
            </Table>
        </TableWrapper>
    );
};

export { SharedTable };
