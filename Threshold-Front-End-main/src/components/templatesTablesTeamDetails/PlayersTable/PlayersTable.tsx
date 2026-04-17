import React, { useState } from 'react';
import { Table } from '../../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { TeamsModal } from '../../teamsModal';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';
import { calculateYearsDifference, stringToDateString } from 'libs/helpers';
import { PlayerModal } from 'components/playerModal';
import { useFetchPlayersTableTeamId } from 'services/hooks/players/useFetchPlayersTableTeamId';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: any;
    loading?: boolean;
    total?: number;
}

export const PlayersTable: React.FC<TemplatesTableProps> = ({ columns, data, loading, total }) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tabledata, setTabledata] = useState(data?.payload?.items || []);

    const {
        params: { sportId, id },
    } = router.getState();

    const redirect = (id: number) => {
        router.navigate(`team-details`, { id, sportId });
    };

    const getSubscriptionStatus = (status: string | null | undefined) => {
        const statusMap: { [key: string]: { color: string; label: string } } = {
            active: { color: 'green', label: trans('form.subscriptionManagement.status.active') },
            inactive: {
                color: 'gray',
                label: trans('form.subscriptionManagement.status.inactive'),
            },
            pending: {
                color: 'yellow',
                label: trans('form.subscriptionManagement.status.pending'),
            },
            expired: { color: 'red', label: trans('form.subscriptionManagement.status.expired') },
        };

        return (
            statusMap[status || 'expired'] || {
                color: 'red',
                label: trans('form.subscriptionManagement.status.expired'),
            }
        );
    };
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <PlayerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')}
                        {`(${total})`}
                    </Theme.UsersNumberTable>
                    <Theme.ButtonsWrapper type="button" onClick={() => setIsModalOpen(true)}>
                        <Theme.ButtonIcon
                            src="/assets/icons/add-icon.svg"
                            height={16}
                            width={16}
                            alt="Add Icon"
                        />
                        {trans('add.player')}
                    </Theme.ButtonsWrapper>
                </Theme.StatusBar>

                <Table
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={data}
                    renderRow={(row: any) => (
                        <Theme.TableRow key={row?.id} onClick={() => redirect(row?.id)}>
                            {/* Player Info */}
                            <Theme.TableCell>
                                <Theme.PersonInfoElement>
                                    {row?.avatarSignedUrl ? (
                                        <Theme.PersonImage
                                            src={row?.avatarSignedUrl}
                                            alt={`${row?.firstName || ''} ${row?.lastName || ''}`}
                                        />
                                    ) : (
                                        <Theme.PersonImage
                                            src="/assets/images/avatar-male.jpg"
                                            alt={`${row?.firstName || ''} ${row?.lastName || ''}`}
                                        />
                                    )}
                                    <Theme.PersonTextContainer>
                                        <Theme.PersonName>
                                            {`${row?.firstName || ''} ${row?.lastName || ''}`}
                                        </Theme.PersonName>
                                        {/* <Theme.PersonAge>{`#${row?.id || ''}`}</Theme.PersonAge> */}
                                    </Theme.PersonTextContainer>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                {trans(`form.add.player.${row?.clublevel}`)}
                            </Theme.TableCell>

                            {/* Position */}
                            <Theme.TableCell>
                                <p>
                                    {trans(`form.editAthleteProfile.${row?.position}`) ||
                                        trans('not.added')}
                                </p>
                            </Theme.TableCell>

                            {/* Weight */}
                            <Theme.TableCell>
                                <p>{row?.weight || trans('not.added')}</p>
                            </Theme.TableCell>

                            {/* Subscription Status */}
                            <Theme.TableCell>
                                <Theme.SpanContracter>
                                    <ul>
                                        {row?.subscription?.status && (
                                            <li
                                                style={{
                                                    color: getSubscriptionStatus(
                                                        row.subscription.status,
                                                    ).color,
                                                }}
                                            >
                                                {
                                                    getSubscriptionStatus(row.subscription.status)
                                                        .label
                                                }
                                            </li>
                                        )}
                                    </ul>
                                </Theme.SpanContracter>
                                <p>
                                    {row?.subscription?.expiryDate
                                        ? stringToDateString(row.subscription.expiryDate)
                                        : trans('not.added')}
                                </p>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
