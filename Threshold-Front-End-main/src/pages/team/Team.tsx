import { useRouter } from 'react-router5';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { Athlete, Team } from 'libs/types';
import { useGetTeams } from 'hooks/data';
import { TeamInfoTable } from 'components/tables/TeamInfoTable';
import { AthletesTable } from 'components/tables';
import { useDataFilter } from 'hooks/helpers';
import { selectControls, setModalContent } from 'store/controlsSlice';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { valueToSelectOption } from 'libs/helpers';
import { SportProfileType, UserRole } from 'libs/enums';
import { WithRole } from 'hooks/roles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ExamSessionsTable } from 'components/tables/ExamesTable';
import { useFetchExamSessions } from 'services/hooks/sessions/useFetchExamSessionsByTeamId';
import { WeeklySessionsTable } from 'components/tables/WeeklySessionsTable';
import { useState } from 'react';
import { Loader } from 'components';

export const TeamPage = () => {
    const { trans } = useLocales();
    const { modalContent } = useSelector(selectControls);
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        params: { id },
    } = router.getState();

    const [activeTab, setActiveTab] = useState(0);

    const { data: team, isLoading } = useGetTeams<Team>({
        id,
        idType: 'team',
        dependents: [modalContent],
    });

    const { data: examSessions, isLoading: isExamSessionsLoading } = useFetchExamSessions({
        teamId: id,
    });

    const {
        data: athletes,
        searchTerm,
        handlerSearchTermChange,
    } = useDataFilter<Athlete>({
        initialData: team?.athletes || [],
        searchFields: ['firstName', 'lastName'],
    });

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
            <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
                <TabList>
                    <Tab>{trans('team.information')}</Tab>
                    <Tab>{trans('team.athletes')}</Tab>
                    <Tab>{trans('team.sessionsHistory')}</Tab>
                    <Tab>{trans('team.exams')}</Tab>
                </TabList>
                <TabPanel>{isLoading ? <Loader /> : <TeamInfoTable team={team} />}</TabPanel>
                <TabPanel>
                    <SharedTheme.TableContainer
                        style={{
                            marginTop: '0px',
                        }}
                    >
                        <div className="flex py-[15px]">
                            <SharedTheme.SearchWrapper className="flex-1">
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

                            <WithRole allowRoles={[UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN]}>
                                <Theme.AddButton
                                    onClick={handleAddPlayers}
                                    $isTable={true}
                                    className="w-auto"
                                >
                                    {trans('team.addButton')}
                                </Theme.AddButton>
                            </WithRole>
                        </div>
                        <AthletesTable athletes={athletes} team={team} />
                    </SharedTheme.TableContainer>
                </TabPanel>
                <TabPanel>
                    <WeeklySessionsTable team={team} />
                </TabPanel>
                <TabPanel>
                    <ExamSessionsTable
                        examSessions={examSessions?.examSessions || []}
                        team={team}
                    />
                </TabPanel>
            </Tabs>
        </Theme.TeamBody>
    );
};
