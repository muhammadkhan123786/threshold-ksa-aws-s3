import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    CellContext,
    SortingState,
} from '@tanstack/react-table';
import { useLocales } from 'hooks/locales';
import { controlsSlice } from 'store';
import { useDispatch } from 'react-redux';
import { router } from 'routers';
import * as Theme from './Theme';
import { ActiveTab } from 'libs/enums';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as TableTheme from '../table/Theme';
import { Branch } from 'libs/types/branch';

interface Props {
    branches: Branch[];
}

export const BranchesTable: React.FC<Props> = ({ branches: initialBranches }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();

    const [branches, setBranches] = useState<Branch[]>(initialBranches || []);
    const parentRef = useRef<HTMLDivElement>(null);
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleViewMore = (id: string, name: string) => {
        dispatch(
            controlsSlice.actions.setBreadCrumps({
                breadCrumps: [ActiveTab.BRANCH_LIST, trans('b.branch.details')],
            }),
        );
        router.navigate('branch', { id }, { replace: true });
    };

    const columns = useMemo<ColumnDef<Branch, unknown>[]>(
        () => [
            {
                accessorKey: 'name',
                header: trans('home.branchesList.name'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Branch, unknown>) => <>{info.row.original.name}</>,
                sortingFn: 'alphanumeric',
            },
            {
                accessorKey: 'description',
                header: trans('home.branchesList.description'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Branch, unknown>) => (
                    <>{info.row.original.description || trans('common.notAvailable')}</>
                ),
                sortingFn: 'alphanumeric',
            },
            {
                accessorKey: 'athletes',
                header: trans('home.branchesList.athletes'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Branch, unknown>) => (
                    <>{info.row.original.athletes?.length || 0}</>
                ),
            },
            {
                accessorKey: 'coaches',
                header: trans('home.branchesList.coaches'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Branch, unknown>) => (
                    <>{info.row.original.coaches?.length || 0}</>
                ),
            },
            {
                accessorKey: 'teams',
                header: trans('home.branchesList.teams'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Branch, unknown>) => (
                    <>{info.row.original.teams?.length || 0}</>
                ),
            },
            {
                accessorKey: 'viewMore',
                header: '',
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Branch, unknown>) => (
                    <Theme.ViewMoreLink
                        onClick={() => handleViewMore(info.row.original.id, info.row.original.name)}
                    >
                        {trans('home.branchesList.viewMore')}
                    </Theme.ViewMoreLink>
                ),
            },
        ],
        [trans],
    );

    const data = useMemo(() => branches, [branches]);

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 34,
        overscan: 20,
    });

    const hasVirtualItems = virtualizer.getVirtualItems()?.length > 0;

    return (
        <Theme.TableBody hasVirtualItems={hasVirtualItems}>
            <Theme.TableContent
                className="flex flex-col min-w-full divide-y divide-gray-200 select-none text-start truncate"
                ref={parentRef}
                hasVirtualItems={hasVirtualItems}
            >
                <Theme.TableResWrapper>
                    <Theme.TableHeaderWrapper>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Theme.TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Theme.TableCellData
                                        key={header.id}
                                        className="px-6 py-3 font-semibold border-b border-gray-300 text-left"
                                        style={(header.column.columnDef as any)?.meta?.columnStyle}
                                    >
                                        <Theme.TableCellButton
                                            className="flex items-center w-full"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </Theme.TableCellButton>
                                    </Theme.TableCellData>
                                ))}
                            </Theme.TableRow>
                        ))}
                    </Theme.TableHeaderWrapper>
                    <Theme.TableResBody>
                        {virtualizer.getVirtualItems().map((virtualRow, index) => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr
                                    key={row.id}
                                    style={{
                                        textAlign: 'justify',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${
                                            virtualRow.start - index * virtualRow.size
                                        }px)`,
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Theme.TableCell
                                            key={cell.id}
                                            className="px-6 py-4 "
                                            style={
                                                (cell.column.columnDef as any)?.meta?.columnStyle
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </Theme.TableCell>
                                    ))}
                                </tr>
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
                    </Theme.TableResBody>
                </Theme.TableResWrapper>
            </Theme.TableContent>
        </Theme.TableBody>
    );
};
