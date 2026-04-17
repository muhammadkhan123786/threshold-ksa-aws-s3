import React, { useState, useMemo } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';

interface TableProps {
    columns: {
        key: string;
        label: string;
        width?: string;
        sortable?: boolean;
    }[];
    data: { [key: string]: any }[];
    renderRow?: (row: { [key: string]: any }) => React.ReactNode;
    loading?: boolean;
    numberRow?: number;
}

export const Table: React.FC<TableProps> = ({
    columns,
    data,
    renderRow,
    loading,
    numberRow = 10,
}) => {
    const { trans } = useLocales();
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortedData = useMemo(() => {
        if (!sortColumn) return data;

        const column = columns.find((col) => col.key === sortColumn);
        if (!column || !column.sortable) return data;

        const sorted = [...data].sort((a, b) => {
            const aValue = a[sortColumn] ?? '';
            const bValue = b[sortColumn] ?? '';

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
        });

        return sorted;
    }, [data, sortColumn, sortDirection, columns]);

    const handleSort = (columnKey: string, sortable?: boolean) => {
        if (!sortable) return;

        if (sortColumn === columnKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    if (loading) {
        return (
            <Theme.TableWrapper>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <Theme.TableHeader key={column.key} style={{ width: column.width }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {column.label}
                                </div>
                            </Theme.TableHeader>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: numberRow }).map((_, rowIndex) => (
                        <Theme.SkeletonRow key={rowIndex}>
                            {columns.map((column) => (
                                <Theme.SkeletonCell
                                    key={column.key}
                                    style={{ width: column.width }}
                                >
                                    <Theme.SkeletonCellSpan
                                        style={{ width: '100%', height: '50px' }}
                                    />
                                </Theme.SkeletonCell>
                            ))}
                        </Theme.SkeletonRow>
                    ))}
                </tbody>
            </Theme.TableWrapper>
        );
    }

    return (
        <Theme.TableWrapper>
            <thead>
                <tr>
                    {columns?.map((column) => (
                        <Theme.TableHeader
                            key={column.key}
                            onClick={() => handleSort(column.key, column.sortable)}
                            style={{
                                cursor: column.sortable ? 'pointer' : 'default',
                                width: column.width,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {column.label}
                                {column.sortable && sortColumn === column.key && (
                                    <img
                                        src={
                                            sortDirection === 'asc'
                                                ? '/assets/icons/side-down-icon.svg'
                                                : '/assets/icons/side-up-icon.svg'
                                        }
                                        alt={`Sort ${sortDirection}`}
                                        style={{ marginLeft: '8px', width: '16px', height: '16px' }}
                                    />
                                )}
                            </div>
                        </Theme.TableHeader>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData?.length > 0 ? (
                    sortedData?.map((row, index) =>
                        renderRow ? (
                            <React.Fragment key={index}>{renderRow(row)}</React.Fragment>
                        ) : (
                            <tr key={index}>
                                {columns.map((column) => (
                                    <Theme.TableCell
                                        key={column.key}
                                        style={{ width: column.width }}
                                    >
                                        {row[column.key]}
                                    </Theme.TableCell>
                                ))}
                            </tr>
                        ),
                    )
                ) : (
                    <tr>
                        <Theme.TableCellNoData colSpan={columns.length}>
                            <Theme.TableCellNoDataDiv>
                                <img
                                    src="/assets/icons/table-no-data-icon.svg"
                                    alt="edit"
                                    height={200}
                                    width={200}
                                />
                                <Theme.SpanNoData>
                                    {trans('the.data.list.is.empty')}
                                </Theme.SpanNoData>
                            </Theme.TableCellNoDataDiv>
                        </Theme.TableCellNoData>
                    </tr>
                )}
            </tbody>
        </Theme.TableWrapper>
    );
};
