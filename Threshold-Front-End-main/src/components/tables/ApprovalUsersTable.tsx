import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    CellContext,
} from '@tanstack/react-table';
import { useLocales } from 'hooks/locales';
import { User } from 'libs/types';
import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { toggleApprovalStatus } from 'services/apis/auth';
import { ThreeDots } from 'react-loader-spinner';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as TableTheme from '../table/Theme';
import { ApprovalUser } from 'libs/types/auth';

interface Props {
    items: ApprovalUser[];
}

export const ApprovalUsersTable: React.FC<Props> = ({ items: initialItems }) => {
    const dispatch = useDispatch<any>();
    const { trans } = useLocales();
    const [loading, setLoading] = useState<string | null>(null);
    const [users, setUsers] =
        useState<(User & { id: string; isApproved: boolean })[]>(initialItems);
    const parentRef = useRef<HTMLDivElement>(null);

    const handleToggleApproval = useCallback(
        async (id: string) => {
            setLoading(id);
            try {
                const response = await dispatch(toggleApprovalStatus(id)({}));
                const updatedUser = response.payload?.data?.payload;

                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
                );
            } catch (error) {
                console.error('Error toggling approval status:', error);
            } finally {
                setLoading(null);
            }
        },
        [dispatch],
    );

    useEffect(() => {
        setUsers(initialItems);
    }, [initialItems]);

    const columns = useMemo<ColumnDef<User & { id: string }, unknown>[]>(
        () => [
            {
                accessorKey: 'username',
                header: trans('home.userList.name'),
                meta: { columnStyle: { flex: 1.5 } },
            },
            {
                accessorKey: 'email',
                header: trans('home.userList.email'),
                meta: { columnStyle: { flex: 2.5 } },
            },
            {
                accessorKey: 'createdAt',
                header: trans('home.userList.createdAt'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<User & { id: string }, unknown>) =>
                    new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                accessorKey: 'isApproved',
                header: trans('home.userList.approvalStatus'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<User & { id: string }, unknown>) =>
                    info.getValue() ? trans('approved') : trans('notApproved'),
            },
            {
                accessorKey: 'actions',
                header: trans('home.userList.actions'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<User & { id: string }, unknown>) => (
                    <button
                        onClick={() => handleToggleApproval(info.row.original.id)}
                        className={`text-blue-500 hover:text-blue-700 ${
                            loading === info.row.original.id ? 'cursor-not-allowed' : ''
                        }`}
                        disabled={loading === info.row.original.id}
                    >
                        {loading === info.row.original.id ? (
                            <ThreeDots color="#000" height={20} width={20} />
                        ) : (info.row.original as any).isApproved ? (
                            trans('disapprove')
                        ) : (
                            trans('approve')
                        )}
                    </button>
                ),
            },
        ],
        [trans, loading, handleToggleApproval],
    );

    const data = useMemo(() => users, [users]);

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
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
                                        className="px-6 py-2 font-bold border-t border-b border-[#e5e7eb] bg-[#f3f3f3] tracking-wider text-start"
                                        style={(header.column.columnDef as any)?.meta?.columnStyle}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
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
