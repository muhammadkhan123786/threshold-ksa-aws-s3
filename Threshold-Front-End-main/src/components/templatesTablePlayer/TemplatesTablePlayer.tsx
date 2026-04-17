import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { PlayerModal } from '../playerModal';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';
import { calculateYearsDifference, stringToDateString } from 'libs/helpers';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { SharedButton } from 'components/sharedButton';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: { [key: string]: any }[];
    loading?: boolean;
    total?: number;
}

export const TemplatesTablePlayer: React.FC<TemplatesTableProps> = ({
    columns,
    data,
    loading,
    total,
}) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);

    const redirect = (id: number) => {
        router.navigate('players-details', { id, sportId });
    };

    // Updated getSubscriptionStatus function to handle null/undefined statuses
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

        // If status is null or undefined, default to 'expired'
        return (
            statusMap[status || 'expired'] || {
                color: 'red',
                label: trans('form.subscriptionManagement.status.expired'),
            }
        );
    };

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              { label: trans('breadcrumbs.players'), path: 'players', params: { sportId } },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    useEffect(() => {
        if (!isModalOpen) {
            return;
        }
    }, [isModalOpen]);
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <PlayerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')}
                        {`(${total})`}
                    </Theme.UsersNumberTable>
                    <SharedButton onClick={() => setIsModalOpen(true)}>
                        <Theme.ButtonIcon
                            src="/assets/icons/add-icon.svg"
                            height={16}
                            width={16}
                            alt="Add Icon"
                        />
                        {trans('add.player')}
                    </SharedButton>
                </Theme.StatusBar>

                <Table
                    loading={loading}
                    columns={columns}
                    data={data}
                    renderRow={(row) => (
                        <Theme.TableRow key={row?.id} onClick={() => redirect(row?.id)}>
                            {/* Player Info */}
                            <Theme.TableCell>
                                <Theme.PersonInfoElement>
                                    {row?.avatarUrl ? (
                                        <Theme.PersonImage
                                            src={row?.avatarUrl}
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
                                        <Theme.PersonAge>{`#${row?.id || ''}`}</Theme.PersonAge>
                                    </Theme.PersonTextContainer>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>

                            {/* Gender and Age */}
                            <Theme.TableCell>
                                {row?.gender === 'male' ? (
                                    <>
                                        <Theme.SpanCatygoryMale>
                                            {trans(`form.editAthletePersonalInfo.${row?.gender}`)}
                                            ,&nbsp;
                                            {calculateYearsDifference(
                                                new Date(),
                                                new Date(row?.dateOfBirth || ''),
                                            )}
                                        </Theme.SpanCatygoryMale>
                                    </>
                                ) : (
                                    <>
                                        <Theme.SpanCatygoryFemale>
                                            {trans(`form.editAthletePersonalInfo.${row?.gender}`)}
                                            ,&nbsp;
                                            {calculateYearsDifference(
                                                new Date(),
                                                new Date(row?.dateOfBirth || ''),
                                            )}
                                        </Theme.SpanCatygoryFemale>
                                    </>
                                )}
                            </Theme.TableCell>

                            {/* Team Name */}
                            <Theme.TableCell>
                                {!row?.teams[0]?.name ? (
                                    <img
                                        height={16}
                                        width={16}
                                        src="/assets/icons/none-or-empty-data.svg"
                                        alt="No data available"
                                    />
                                ) : (
                                    <Theme.PersonName>{row.teams[0].name}</Theme.PersonName>
                                )}
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
