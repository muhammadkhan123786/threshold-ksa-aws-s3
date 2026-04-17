import { useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { getAvatarPlaceholder } from 'libs/constants';
import { Loader, SharedTable, SharedTheme } from 'components';
import { Athlete } from 'libs/types';
import * as Theme from './Theme';
import { useGetAthletes } from 'hooks';
import { router } from 'routers';

export const AthleteTable = () => {
    const { trans } = useLocales();
    const { data: athletesData, isLoading } = useGetAthletes<Athlete[]>({
        idType: 'academy',
    });

    const columns = useMemo(
        () => [
            {
                key: 'player',
                header: trans('athleteClub.athletesList.player'),
                width: '20%',
                sortable: false,
                cell: (athlete: Athlete) => (
                    <SharedTheme.AvatarContainer>
                        <SharedTheme.AvatarImage
                            src={athlete.avatar || getAvatarPlaceholder(athlete.gender)}
                            alt="avatar"
                        />
                        <div>
                            <span className="font-semibold text-gray-800">
                                {athlete.firstName} {athlete.lastName}
                            </span>
                            <SharedTheme.SubText>#{athlete.id}</SharedTheme.SubText>
                        </div>
                    </SharedTheme.AvatarContainer>
                ),
            },
            {
                key: 'category',
                header: trans('athleteClub.athletesList.category'),
                width: '15%',
                sortable: true,
                cell: (athlete: Athlete) => (
                    <SharedTheme.TableCell>
                        <span className="text-gray-600">
                            {athlete.gender}, {athlete.age || 'N/A'}
                        </span>
                    </SharedTheme.TableCell>
                ),
            },
            {
                key: 'team',
                header: trans('athleteClub.athletesList.team'),
                width: '20%',
                sortable: true,
                cell: (athlete: Athlete) => (
                    <div className="flex items-center gap-2">
                        {athlete.team?.logo && (
                            <img
                                src={athlete.team.logo || '/assets/team-logo.png'}
                                alt={`${athlete.team.name} logo`}
                                className="w-6 h-6 object-contain"
                            />
                        )}
                        <div>
                            <span className="font-semibold text-gray-800">
                                {athlete.team?.name || 'N/A'}
                            </span>
                            <SharedTheme.SubText>#{athlete.team?.id || 'N/A'}</SharedTheme.SubText>
                        </div>
                    </div>
                ),
            },
            {
                key: 'position',
                header: trans('athleteClub.athletesList.position'),
                width: '15%',
                sortable: true,
                cell: (athlete: Athlete) => (
                    <SharedTheme.Badge bgColor="#ffe3f3" textColor="#d63384">
                        {athlete.position || 'N/A'}
                    </SharedTheme.Badge>
                ),
            },
            {
                key: 'contract',
                header: trans('athleteClub.athletesList.contract'),
                width: '20%',
                sortable: true,
                cell: (athlete: Athlete) => (
                    <div>
                        {athlete.contractDetails ? (
                            <>
                                <SharedTheme.StatusText color="#28a745">
                                    Available
                                </SharedTheme.StatusText>
                                <SharedTheme.SubText>
                                    till {athlete.contractDetails.endDate || 'N/A'}
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
        router.navigate('addAthlete');
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.CoachListBody>
            <SharedTheme.TablePageHeader>
                <SharedTheme.TableTitle>
                    {trans('athleteClub.athletesList.title')}
                </SharedTheme.TableTitle>
                <SharedTheme.AddButton onClick={handleAddAthlete}>
                    {trans('athleteClub.Add Player')}
                </SharedTheme.AddButton>
            </SharedTheme.TablePageHeader>
            <SharedTable
                data={athletesData || []}
                columns={columns}
                emptyMessage={trans('athleteClub.dashboard.empty')}
            />
        </Theme.CoachListBody>
    );
};
