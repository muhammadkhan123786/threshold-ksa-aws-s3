import React, { useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { useGetCoaches } from 'hooks/data/useGetCoaches';
import { getAvatarPlaceholder } from 'libs/constants';
import { Loader, SharedTable, SharedTheme } from 'components';
import { Coach } from 'libs/types';
import * as Theme from './Theme';
import { router } from 'routers';

export const CoachTable = () => {
    const { trans } = useLocales();
    const { data: coachesData, isLoading } = useGetCoaches<Coach[]>({ idType: 'academy', page: 0 });

    const columns = useMemo(
        () => [
            {
                key: 'coach',
                header: trans('home.coachesList.coach'),
                width: '20%',
                sortable: false,
                cell: (coach: Coach) => (
                    <SharedTheme.AvatarContainer>
                        <SharedTheme.AvatarImage
                            src={coach.avatar || getAvatarPlaceholder(coach.gender)}
                            alt="avatar"
                        />
                        <div>
                            <span className="font-semibold text-gray-800">
                                {coach.firstName} {coach.lastName}
                            </span>
                            <SharedTheme.SubText>#{coach.id}</SharedTheme.SubText>
                        </div>
                    </SharedTheme.AvatarContainer>
                ),
            },
            {
                key: 'experience',
                header: trans('home.coachesList.experience'),
                width: '15%',
                sortable: true,
                cell: (coach: Coach) => (
                    <SharedTheme.TableCell>
                        <span className="text-gray-600">{coach.experience || 'N/A'}</span>
                    </SharedTheme.TableCell>
                ),
            },
            {
                key: 'type',
                header: trans('home.coachesList.type'),
                width: '15%',
                sortable: true,
                cell: (coach: Coach) => (
                    <SharedTheme.Badge bgColor="#ffe3f3" textColor="#d63384">
                        {coach.type || 'N/A'}
                    </SharedTheme.Badge>
                ),
            },
            {
                key: 'teams',
                header: trans('home.coachesList.teams'),
                width: '20%',
                sortable: true,
                cell: (coach: Coach) => (
                    <div className="flex flex-col gap-2">
                        {coach.teams && coach.teams.length > 0 ? (
                            coach.teams.map((team) => (
                                <div key={team.id} className="flex items-center gap-2">
                                    {team.logo && (
                                        <img
                                            src={team.logo || '/assets/team-logo.png'}
                                            alt={`${team.name || 'team'} logo`}
                                            className="w-6 h-6 object-contain"
                                        />
                                    )}
                                    <div>
                                        <span className="font-semibold text-gray-800">
                                            {team.name || 'N/A'}
                                        </span>
                                        <SharedTheme.SubText>
                                            #{team.id || 'N/A'}
                                        </SharedTheme.SubText>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <SharedTheme.StatusText color="#dc3545">N/A</SharedTheme.StatusText>
                        )}
                    </div>
                ),
            },
            {
                key: 'contract',
                header: trans('home.coachesList.contract'),
                width: '20%',
                sortable: true,
                cell: (coach: Coach) => (
                    <div>
                        {coach.contractDetails ? (
                            <>
                                <SharedTheme.StatusText
                                    color={
                                        coach.contractDetails.status === 'Active'
                                            ? '#28a745'
                                            : '#dc3545'
                                    }
                                >
                                    {coach.contractDetails.status || 'N/A'}
                                </SharedTheme.StatusText>
                                <SharedTheme.SubText>
                                    {coach.contractDetails.joinDate || 'N/A'} -{' '}
                                    {coach.contractDetails.durationPeriod || 'N/A'}
                                </SharedTheme.SubText>
                            </>
                        ) : (
                            <SharedTheme.StatusText color="#dc3545">N/A</SharedTheme.StatusText>
                        )}
                    </div>
                ),
            },
        ],
        [trans],
    );

    const handleAddAthlete = () => {
        router.navigate('addCoach');
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.CoachListBody>
            <SharedTheme.TablePageHeader>
                <SharedTheme.TableTitle>{trans('home.coachesList.all')}</SharedTheme.TableTitle>
                <SharedTheme.AddButton onClick={handleAddAthlete}>
                    {trans('Add Coach')}
                </SharedTheme.AddButton>
            </SharedTheme.TablePageHeader>
            <SharedTable
                data={coachesData || []}
                columns={columns}
                emptyMessage={trans('home.dashboard.empty')}
            />
        </Theme.CoachListBody>
    );
};
