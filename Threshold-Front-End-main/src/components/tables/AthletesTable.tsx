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
import { Athlete, Team } from 'libs/types';
import { useDispatch } from 'react-redux';
import { router } from 'routers';
import * as Theme from './Theme';
import * as TableTheme from '../table/Theme';

import { ActiveTab, SubscriptionStatus, UserRole } from 'libs/enums';
import { calculateYearsDifference } from 'libs/helpers';
import { getAvatarPlaceholder } from 'libs/constants';
import { setBreadCrumps } from 'store/controlsSlice';
import { AthleteProfilesStatus, Loader, SubscriptionStatusTableIndicator } from 'components';
import DropdownMenu from 'components/dropdownMenu/DropdownMenu';
import { handleDeleteAthlete } from 'libs/helpers/modalHelpers';
import { WithRole } from 'hooks/roles';
import { useVirtualizer } from '@tanstack/react-virtual';
import styled from 'styled-components';

interface Props {
    athletes: Athlete[];
    team?: Team;
}

type Action = 'delete';

export const AthletesTable: React.FC<Props> = React.memo(({ athletes: initialAthletes, team }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();
    const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
    const [isLoading, setLoading] = useState(false);
    const parentRef = useRef<HTMLDivElement>(null);
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleViewMore = useCallback(
        (id: string, name: string) => {
            dispatch(
                setBreadCrumps({
                    breadCrumps: [ActiveTab.ATHLETE_LIST, 'Athlete Details'],
                }),
            );
            router.navigate('athlete', { id }, { replace: true });
        },
        [dispatch],
    );

    const handleOptionClick = useCallback(
        async (action: Action, id: string) => {
            if (action === 'delete') {
                setLoading(true);
                try {
                    const response = await handleDeleteAthlete(id, dispatch, setLoading);
                    if (response.payload.status === 200 || response.payload.status === 204) {
                        setAthletes((prevAthletes: any[]) =>
                            prevAthletes.filter((athlete: { id: string }) => athlete.id !== id),
                        );
                    }
                } catch (error) {
                    console.error('Error deleting athlete:', error);
                } finally {
                    setLoading(false);
                }
            }
        },
        [dispatch],
    );

    useEffect(() => {
        setAthletes(initialAthletes);
    }, [initialAthletes]);

    const columns = useMemo<ColumnDef<Athlete, unknown>[]>(
        () => [
            {
                accessorKey: 'avatar',
                header: '',
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Athlete, unknown>) => (
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
                header: trans('home.athleteList.name'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Athlete, unknown>) => (
                    <div style={{ width: '8rem' }}>
                        {info.row.original.firstName} {info.row.original.lastName}
                    </div>
                ),
                sortingFn: (
                    a: { original: { firstName: string } },
                    b: { original: { firstName: any } },
                ) => {
                    return a.original.firstName.localeCompare(b.original.firstName);
                },
            },
            {
                accessorKey: 'subscriptionStatus',
                header: trans('home.athleteList.subscription'),
                enableSorting: false,
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Athlete, unknown>) => (
                    <SubscriptionStatusTableIndicator
                        status={
                            info.row.original.subscriptionStatus ||
                            info.row.original.subscription?.status ||
                            SubscriptionStatus.INACTIVE
                        }
                    />
                ),
                sortingFn: 'alphanumeric',
            },
            {
                accessorKey: 'profile',
                header: trans('home.athleteList.profile'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Athlete, unknown>) => (
                    <AthleteProfilesStatus
                        athleteProfiles={info.row.original.athleteProfiles}
                        team={team}
                    />
                ),
            },
            {
                accessorKey: 'team',
                header: trans('home.athleteList.team'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Athlete, unknown>) => (
                    <div style={{ width: '8rem' }}>
                        {info.row.original.teams && info.row.original.teams.length > 0
                            ? info.row.original.teams[0].name
                            : team?.name || '---'}
                    </div>
                ),
            },
            {
                accessorKey: 'age',
                header: trans('home.athleteList.age'),
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Athlete, unknown>) => (
                    <>
                        {calculateYearsDifference(
                            new Date(),
                            new Date(info.row.original.dateOfBirth || ''),
                        )}
                    </>
                ),
                sortingFn: (
                    rowA: { original: { dateOfBirth: any } },
                    rowB: { original: { dateOfBirth: any } },
                ) => {
                    const ageA = calculateYearsDifference(
                        new Date(),
                        new Date(rowA.original.dateOfBirth || ''),
                    );
                    const ageB = calculateYearsDifference(
                        new Date(),
                        new Date(rowB.original.dateOfBirth || ''),
                    );
                    return ageA - ageB;
                },
            },
            {
                accessorKey: 'viewMore',
                header: '',
                meta: { columnStyle: { flex: 1.5 } },
                cell: (info: CellContext<Athlete, unknown>) => (
                    <Theme.ViewMoreLink
                        onClick={() =>
                            handleViewMore(info.row.original.id, info.row.original.firstName)
                        }
                    >
                        {trans('home.athleteList.viewMore')}
                    </Theme.ViewMoreLink>
                ),
            },
            {
                accessorKey: 'actions',
                header: '',
                meta: { columnStyle: { flex: 0.5 } },
                cell: (info: CellContext<Athlete, unknown>) =>
                    isLoading ? (
                        <Loader />
                    ) : (
                        <WithRole allowRoles={[UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN]}>
                            <DropdownMenu
                                options={[
                                    {
                                        label: trans('home.athleteList.delete'),
                                        onClick: () =>
                                            handleOptionClick('delete', info.row.original.id),
                                    },
                                ]}
                            />
                        </WithRole>
                    ),
            },
        ],
        [trans, team, isLoading, handleOptionClick],
    );

    const data = useMemo(() => athletes, [athletes]);

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
});
