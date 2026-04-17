import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    CellContext,
} from '@tanstack/react-table';
import { useLocales } from 'hooks/locales';
import { PublicLink } from 'libs/types';
import * as Theme from './Theme';
import * as TableTheme from '../table/Theme';
import { useVirtualizer } from '@tanstack/react-virtual';
import { toast } from 'react-toastify';

interface Props {
    links: PublicLink[];
}

export const PublicAthleteLinksTable: React.FC<Props> = ({ links: initialLinks }) => {
    const { trans, formatDate } = useLocales();
    const [links, setLinks] = useState<PublicLink[]>(initialLinks);
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLinks(initialLinks);
    }, [initialLinks]);

    const handleCopyLink = (academyId: string) => {
        const link = `${window.location.origin}/public/athlete/${academyId}`;
        navigator.clipboard.writeText(link).then(() => {
            toast.success(trans('links.linkCopied'));
        });
    };

    const columns = useMemo<ColumnDef<PublicLink, unknown>[]>(
        () => [
            {
                accessorKey: 'id',
                header: trans('links.id'),
                meta: { columnStyle: { flex: 1 } },
                cell: (info: CellContext<PublicLink, unknown>) => info.row.original.id,
            },
            {
                accessorKey: 'academy.name',
                header: trans('links.academy'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<PublicLink, unknown>) => info.row.original.academy.name,
            },
            {
                accessorKey: 'expirationDate',
                header: trans('links.expirationDate'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<PublicLink, unknown>) =>
                    formatDate(info.row.original.expirationDate),
            },
            {
                accessorKey: 'limitNumber',
                header: trans('links.limitNumber'),
                meta: { columnStyle: { flex: 1 } },
                cell: (info: CellContext<PublicLink, unknown>) => info.row.original.limitNumber,
            },
            {
                accessorKey: 'accesses',
                header: trans('links.limitNumber'),
                meta: { columnStyle: { flex: 1 } },
                cell: (info: CellContext<PublicLink, unknown>) =>
                    (info.row.original as any).accesses?.length,
            },
            {
                accessorKey: 'isActive',
                header: trans('links.status'),
                meta: { columnStyle: { flex: 1 } },
                cell: (info: CellContext<PublicLink, unknown>) =>
                    info.row.original.isActive ? trans('links.active') : trans('links.inactive'),
            },
            {
                accessorKey: 'copyLink',
                header: trans('links.copyLink'),
                meta: { columnStyle: { flex: 1 } },
                cell: (info: CellContext<PublicLink, unknown>) => (
                    <Theme.Button
                        onClick={() => handleCopyLink(info.row.original.academy.id)}
                        $isTable
                    >
                        {trans('links.copy')}
                    </Theme.Button>
                ),
            },
        ],
        [trans],
    );

    const data = useMemo(() => links, [links]);

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const rowVirtualizer = useVirtualizer({
        count: table.getRowModel().rows?.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70,
    });

    const hasVirtualItems = rowVirtualizer.getVirtualItems()?.length > 0;

    return (
        <Theme.TableBody hasVirtualItems={hasVirtualItems}>
            <Theme.TableContent
                className="flex flex-col min-w-full divide-y divide-gray-200 select-none text-start truncate"
                ref={parentRef}
                hasVirtualItems={hasVirtualItems}
            >
                <div className="bg-gray-50 sticky top-0 z-20">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <div key={headerGroup.id} className="flex">
                            {headerGroup.headers.map((header) => (
                                <div
                                    key={header.id}
                                    className="px-6 py-2 font-bold border-t border-b border-[#e5e7eb] bg-[#f3f3f3] tracking-wider text-start"
                                    style={(header.column.columnDef as any)?.meta?.columnStyle}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div
                    className="bg-white divide-y divide-gray-200"
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = table.getRowModel().rows[virtualRow.index];
                        return (
                            <div
                                key={row.id}
                                className="flex w-full items-center"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <div
                                        key={cell.id}
                                        className="px-6 py-4 text-start whitespace-nowrap truncate text-ellipsis"
                                        style={(cell.column.columnDef as any)?.meta?.columnStyle}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        );
                    })}

                    {!hasVirtualItems && (
                        <TableTheme.EmptyTableWrapper>
                            <TableTheme.EmptyTableIcon
                                src="/assets/icons/clock-icon.png"
                                alt="clock"
                            />
                            <TableTheme.EmptyTableText
                                variant="p"
                                value={trans('home.dashboard.empty')}
                            />
                        </TableTheme.EmptyTableWrapper>
                    )}
                </div>
            </Theme.TableContent>
        </Theme.TableBody>
    );
};
