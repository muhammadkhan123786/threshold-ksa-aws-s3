import { useRouter } from 'react-router5';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { Athlete, SessionPlayingType, Team } from 'libs/types';
import { useGetSessions, useGetTeams } from 'hooks/data';
import { TeamInfoTable } from 'components/tables/TeamInfoTable';
import { AthletesTable, SessionsTable } from 'components/tables';
import { useDataFilter } from 'hooks/helpers';
import { selectControls, setModalContent } from 'store/controlsSlice';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from 'components';
import { valueToSelectOption } from 'libs/helpers';
import { SportProfileType, UserRole } from 'libs/enums';
import { WithRole } from 'hooks/roles';

export const TeamPage = () => {
    const { trans } = useLocales();
    const { modalContent } = useSelector(selectControls);
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        params: { id },
    } = router.getState();

    const { data: team, isLoading } = useGetTeams<Team>({
        id,
        idType: 'team',
        dependents: [modalContent],
    });
    const sessions = useGetSessions<SessionPlayingType[]>({
        id,
        idType: 'team',
        dependents: [modalContent],
    });

    const {
        data: athletes,
        searchTerm,
        handlerSearchTermChange,
    } = useDataFilter<Athlete>({
        initialData: team?.athletes || [],
        searchFields: ['firstName', 'lastName'],
    });

    if (isLoading) return <Loader />;

    const handleAddPlayers = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editTeamInfo',
                    title: trans('form.editTeamInfo.title'),
                    subtitle: trans('form.editTeamInfo.subtitle'),
                    defaults: {
                        sport: valueToSelectOption(team?.sport, SportProfileType, trans, 'sport.'),
                        name: team?.name,
                        branch: {
                            label: team?.branch,
                            value: team?.branch,
                        },
                        creationDate: team?.creationDate,
                        logo: team?.logo,
                        coach: {
                            label: `${team?.coach?.firstName} ${team?.coach?.lastName}`,
                            value: team?.coach?.id,
                        },
                        athletes:
                            !team?.athletes || team?.athletes?.length === 0
                                ? []
                                : team.athletes.map((athlete) => ({
                                      label: `${athlete.firstName} ${athlete.lastName}`,
                                      value: athlete.id,
                                  })),
                        flag: 'players',
                    },
                },
            }),
        );
    };

    return (
        <Theme.TeamBody>
            <Theme.AvatarSection>
                <Theme.Avatar
                    src={team?.logo || '/assets/images/logo-placeholder.jpg'}
                    alt="avatar"
                />

                <Theme.Name variant="h3" value={team?.name} />
            </Theme.AvatarSection>

            <TeamInfoTable team={team} />

            <SessionsTable sessions={sessions} team={team} />

            <Theme.Section>
                <Theme.ButtonWrapper>
                    <Theme.Title variant="h2" value={trans('team.athletes')} />

                    <WithRole allowRoles={[UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN]}>
                        <Theme.Button onClick={handleAddPlayers} $isTable={true}>
                            {trans('team.addButton')}
                        </Theme.Button>
                    </WithRole>
                </Theme.ButtonWrapper>
            </Theme.Section>

            <SharedTheme.TableContainer
                style={{
                    marginTop: '0px',
                }}
            >
                <SharedTheme.SearchWrapper>
                    <SharedTheme.SearchIcon
                        src="/assets/icons/athlete-list-search-icon.png"
                        alt="search"
                    />
                    <SharedTheme.SearchBox
                        placeholder={trans('home.teamsList.searchPlaceholder')}
                        value={searchTerm}
                        onChange={handlerSearchTermChange}
                    />
                </SharedTheme.SearchWrapper>

                <AthletesTable athletes={athletes} team={team} />
            </SharedTheme.TableContainer>
        </Theme.TeamBody>
    );
};
