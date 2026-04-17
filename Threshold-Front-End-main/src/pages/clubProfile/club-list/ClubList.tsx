import { ClubCard } from '../club-item/ClubCard';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Loader } from 'components';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { AddNewSportModal } from '../addNewSportModal/AddNewSportModal';
import { sportMapping, SportType } from 'libs/utils/sportIcons';
import _ from 'lodash';
import { router } from 'routers';
interface Club {
    id: string;
    sport: SportType;
    teamsCount?: number;
    coachesCount?: number;
    athletesCount?: number;
    mainManagers: {
        id: string;
        firstName: string;
        lastName: string;
        user: { id: string; role: string };
    }[];
}

export const ClubList = () => {
    const { trans } = useLocales();
    const { academy } = useSelector(selectAcademy);
    const { data, isLoading, error } = useClubList(academy.id);

    if (isLoading) return <Loader />;
    if (error) return <div>{trans('errorFetchingData')}</div>;

    const clubs: Club[] = (data?.payload ?? []).map((club: any) => ({
        ...club,
        mainManagers:
            club.mainManagers?.map((manager: any) => ({
                id: manager.id,
                firstName: manager.firstName,
                lastName: manager.lastName,
                user: {
                    id: manager.user.id,
                    role: manager.user.role,
                },
            })) ?? [],
    }));
    console.log(clubs);
    const redirect = (id: string, sportId: string) => {
        router.navigate(`players-details`, { id, sportId });
    };
    return (
        <Theme.Body>
            <Theme.Header>
                <Theme.Title>
                    {trans('clubList.title')}&nbsp;({clubs.length})
                </Theme.Title>
                <AddNewSportModal clubs={clubs} />
            </Theme.Header>
            <Theme.List>
                {clubs.length > 0 ? (
                    clubs.map((club) => (
                        <ClubCard
                            key={club.id}
                            club={{
                                id: club.id,
                                name: trans(`sport.${club.sport}`, club.sport),
                                avatar: sportMapping[club.sport],
                                metrics: {
                                    teams: club.teamsCount || 0,
                                    coaches: club.coachesCount || 0,
                                    athletes: club.athletesCount || 0,
                                    administrators: 0,
                                    medicalTeam: 0,
                                    supportTeam: 0,
                                },
                                mainManagers: club?.mainManagers,
                            }}
                        />
                    ))
                ) : (
                    <div>{trans('g.nodata')}</div>
                )}
            </Theme.List>
        </Theme.Body>
    );
};
