import React, { useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { getAvatarPlaceholder } from 'libs/constants';
import { Loader, SharedTable, SharedTheme } from 'components';
import { Team } from 'libs/types';
import * as Theme from './Theme';
import { useGetTeams } from 'hooks/data';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { router } from 'routers';

export const TeamTable = () => {
    const { trans } = useLocales();
    const { academy } = useSelector(selectAcademy);
    const { data: teamsData, isLoading } = useGetTeams<Team[]>({
        id: academy?.id,
        idType: 'academy',
        page: 0,
    });
    const columns = useMemo(
        () => [
            {
                key: 'team',
                header: trans('home.teamList.team'),
                width: '25%',
                sortable: false,
                cell: (team: Team) => (
                    <div className="flex items-center gap-3">
                        <img
                            src={team.logo || '/assets/images/logo-placeholder.jpg'}
                            alt={`${team.name} logo`}
                            className="w-10 h-10 object-contain"
                        />
                        <div>
                            <span className="font-semibold text-gray-800">{team.name}</span>
                            <SharedTheme.SubText>#{team.id}</SharedTheme.SubText>
                        </div>
                    </div>
                ),
            },
            {
                key: 'category',
                header: trans('home.teamList.category'),
                width: '20%',
                sortable: true,
                cell: () => <span className="text-gray-600">Football, Male, 12–14 ages</span>,
            },
            {
                key: 'coach',
                header: trans('home.teamList.coach'),
                width: '20%',
                sortable: false,
                cell: (team: Team) => (
                    <div>
                        {team.coach ? (
                            <>
                                <span className="font-semibold text-gray-800">
                                    {team.coach.firstName} {team.coach.lastName}
                                </span>
                                <SharedTheme.SubText>
                                    {team.coach.type || 0} assistants
                                </SharedTheme.SubText>
                            </>
                        ) : (
                            <SharedTheme.StatusText color="#dc3545">N/A</SharedTheme.StatusText>
                        )}
                    </div>
                ),
            },
            {
                key: 'numbers',
                header: trans('home.teamList.numbers'),
                width: '10%',
                sortable: true,
                cell: (team: Team) => (
                    <span className="font-semibold text-gray-800">
                        {team.athletes?.length || 0}
                    </span>
                ),
            },
            {
                key: 'nextSession',
                header: trans('home.teamList.nextSession'),
                width: '25%',
                sortable: false,
                cell: () => (
                    <div>
                        <SharedTheme.StatusText color="#28a745">Now</SharedTheme.StatusText>
                        <SharedTheme.SubText>2:30 pm - 6:00 pm</SharedTheme.SubText>
                    </div>
                ),
            },
        ],
        [trans],
    );

    const handleAddAthlete = () => {
        router.navigate('addTeam');
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.CoachListBody>
            <SharedTheme.TablePageHeader>
                <SharedTheme.TableTitle>{trans('home.teamList.title')}</SharedTheme.TableTitle>
                <SharedTheme.AddButton onClick={handleAddAthlete}>
                    {trans('Add Team')}
                </SharedTheme.AddButton>
            </SharedTheme.TablePageHeader>
            <SharedTable
                data={teamsData || []}
                columns={columns}
                emptyMessage={trans('home.dashboard.empty')}
            />
        </Theme.CoachListBody>
    );
};
