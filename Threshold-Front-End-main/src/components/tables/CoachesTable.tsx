import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
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
import { Coach } from 'libs/types';
import { useDispatch } from 'react-redux';
import { router } from 'routers';
import * as Theme from './Theme';
import { ActiveTab, UserRole } from 'libs/enums';
import { getAvatarPlaceholder } from 'libs/constants';
import { setBreadCrumps } from 'store/controlsSlice';
import { Loader } from 'components';
import DropdownMenu from 'components/dropdownMenu/DropdownMenu';
import { handleDeleteCoach } from 'libs/helpers/modalHelpers';
import { WithRole } from 'hooks/roles';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as TableTheme from '../table/Theme';

interface Props {
    coaches: Coach[];
}

export const CoachesTable: React.FC<Props> = ({ coaches: initialCoaches }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();
    const [coaches, setCoaches] = useState<Coach[]>(initialCoaches);
    const [isLoading, setLoading] = useState(false);
    const parentRef = useRef<HTMLDivElement>(null);
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleViewMore = useCallback(
        (id: string, name: string) => {
            dispatch(
                setBreadCrumps({
                    breadCrumps: [ActiveTab.COACH_LIST, 'Coach Details'],
                }),
            );
            router.navigate('coach', { id }, { replace: true });
        },
        [dispatch],
    );

    const handleOptionClick = useCallback(
        async (action: string, id: string) => {
            if (action === 'delete') {
                setLoading(true);
                const response = await handleDeleteCoach(id, dispatch, setLoading);
                if (response.payload.status === 200 || response.payload.status === 204) {
                    setCoaches(coaches.filter((coach) => coach.id !== id));
                }
                setLoading(false);
            }
        },
        [dispatch, coaches],
    );

    useEffect(() => {
        setCoaches(initialCoaches);
    }, [initialCoaches]);

    const columns = useMemo<ColumnDef<Coach, unknown>[]>(
        () => [
            {
                accessorKey: 'avatar',
                header: '',
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Coach, unknown>) => (
                    <Theme.AvatarContainer>
                        <Theme.Avatar
                            src={
                                info.row.original.avatar ||
                                getAvatarPlaceholder(info.row.original.gender)
                            }
                            alt="avatar"
                        />
                    </Theme.AvatarContainer>
                ),
            },
            {
                accessorKey: 'name',
                header: trans('home.coachesList.name'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Coach, unknown>) => (
                    <>
                        {info.row.original.firstName} {info.row.original.lastName}
                    </>
                ),
                sortingFn: (a, b) => a.original.firstName.localeCompare(b.original.firstName),
            },
            {
                accessorKey: 'sport',
                header: trans('home.coachesList.sport'),
                meta: { columnStyle: { flex: 2.5 } },
                cell: (info: CellContext<Coach, unknown>) => (
                    <>{trans(`sport.${info.row.original.sport}`, info.row.original.sport)}</>
                ),
                sortingFn: 'alphanumeric',
            },
            {
                accessorKey: 'teams',
                header: trans('home.coachesList.teams'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Coach, unknown>) => <>{info.row.original.teams?.length}</>,
            },
            {
                accessorKey: 'experience',
                header: trans('home.coachesList.experience'),
                meta: { columnStyle: { flex: 1 } },
                cell: (info: CellContext<Coach, unknown>) => <>{info.row.original.experience}</>,
                sortingFn: 'basic',
            },
            {
                accessorKey: 'viewMore',
                header: '',
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Coach, unknown>) => (
                    <Theme.ViewMoreLink
                        onClick={() =>
                            handleViewMore(info.row.original.id, info.row.original.firstName)
                        }
                    >
                        {trans('home.coachesList.viewMore')}
                    </Theme.ViewMoreLink>
                ),
            },
            {
                accessorKey: 'actions',
                header: '',
                meta: { columnStyle: { flex: 0.5 } },
                cell: (info: CellContext<Coach, unknown>) =>
                    isLoading ? (
                        <Loader />
                    ) : (
                        <WithRole allowRoles={[UserRole.ADMIN]}>
                            <DropdownMenu
                                options={[
                                    {
                                        label: trans('home.coachesList.delete'),
                                        onClick: () =>
                                            handleOptionClick('delete', info.row.original.id),
                                    },
                                ]}
                            />
                        </WithRole>
                    ),
            },
        ],
        [trans, isLoading, handleViewMore, handleOptionClick],
    );

    const data = useMemo(() => coaches, [coaches]);

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
        count: rows?.length,
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
                                    colSpan={table.getHeaderGroups()[0].headers?.length}
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
