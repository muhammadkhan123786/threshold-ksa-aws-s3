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
import { Team } from 'libs/types';
import { useDispatch } from 'react-redux';
import { router } from 'routers';
import * as Theme from './Theme';
import { ActiveTab, UserRole } from 'libs/enums';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as TableTheme from '../table/Theme';
import { WithRole } from 'hooks/roles';

interface Props {
    teams: Team[] | any;
}

export const TeamsTable: React.FC<Props> = ({ teams: initialTeams }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();

    const [teams, setTeams] = useState<Team[]>(initialTeams || []);
    const parentRef = useRef<HTMLDivElement>(null);
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleViewMore = (id: string, name: string) => {
        dispatch(
            controlsSlice.actions.setBreadCrumps({
                breadCrumps: [ActiveTab.TEAM_LIST, 'Team Details'],
            }),
        );
        router.navigate('team', { id }, { replace: true });
    };

    useEffect(() => {
        setTeams(initialTeams);
    }, [initialTeams]);

    const columns = useMemo<ColumnDef<Team, unknown>[]>(
        () => [
            {
                accessorKey: 'logo',
                header: '',
                meta: { columnStyle: { width: '100px' } },
                cell: (info: CellContext<Team, unknown>) => (
                    <Theme.AvatarContainer>
                        <Theme.Avatar
                            src={info.row.original.logo || '/assets/images/logo-placeholder.jpg'}
                            alt="logo"
                        />
                    </Theme.AvatarContainer>
                ),
            },
            {
                accessorKey: 'name',
                header: trans('home.teamsList.name'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Team, unknown>) => <>{info.row.original.name}</>,
                sortingFn: 'alphanumeric',
            },
            {
                accessorKey: 'sport',
                header: trans('home.teamsList.sport'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Team, unknown>) => (
                    <>{trans(`sport.${info.row.original.sport}`, info.row.original.sport)}</>
                ),
                sortingFn: 'alphanumeric',
            },
            {
                accessorKey: 'viewMore',
                header: '',
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Team, unknown>) => (
                    <Theme.ViewMoreLink
                        onClick={() => handleViewMore(info.row.original.id, info.row.original.name)}
                    >
                        {trans('home.teamsList.viewMore')}
                    </Theme.ViewMoreLink>
                ),
            },
            {
                accessorKey: 'actions',
                header: '',
                meta: { columnStyle: { flex: 0.5 } },
                cell: (info: CellContext<Team, unknown>) => (
                    <WithRole allowRoles={[UserRole.ADMIN]}>
                        <Theme.MoreIcon src="/assets/icons/athlete-list-more-icon.png" alt="more" />
                    </WithRole>
                ),
            },
        ],
        [trans],
    );

    const data = useMemo(() => teams, [teams]);

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    // const table = useReactTable({
    //     data,
    //     columns,
    //     state: {
    //         sorting,
    //     },
    //     onSortingChange: setSorting,
    //     getCoreRowModel: getCoreRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     debugTable: true,
    // });

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
                className="min-w-full bg-white divide-y divide-gray-200 text-left"
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
                                    {' '}
                                    {/* Set a consistent row height */}
                                    {row.getVisibleCells().map((cell) => (
                                        <Theme.TableCell
                                            key={cell.id}
                                            className=" py-4 "
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
                            <Theme.TableRow>
                                <Theme.TableCellEmpty
                                    colSpan={table.getHeaderGroups()[0].headers.length}
                                    className="text-center py-4"
                                >
                                    <TableTheme.EmptyTableWrapper className="flex flex-col items-center justify-center">
                                        <TableTheme.EmptyTableIcon
                                            src="/assets/icons/clock-icon.png"
                                            alt="clock"
                                            className="w-12 h-12 mb-2"
                                        />
                                        <TableTheme.EmptyTableText
                                            variant="p"
                                            value={trans('home.dashboard.empty')}
                                            className="text-gray-500"
                                        />
                                    </TableTheme.EmptyTableWrapper>
                                </Theme.TableCellEmpty>
                            </Theme.TableRow>
                        )}
                    </Theme.TableResBody>
                </Theme.TableResWrapper>
            </Theme.TableContent>
        </Theme.TableBody>
    );
};
