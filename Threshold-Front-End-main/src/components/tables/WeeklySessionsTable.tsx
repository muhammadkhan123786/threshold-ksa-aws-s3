import { useState } from 'react';
import { useLocales } from 'hooks/locales';
import { Team } from 'libs/types';
import { useDispatch } from 'react-redux';
import { router } from 'routers';
import * as Theme from './Theme';
import { ActiveTab, UserRole } from 'libs/enums';
import { setBreadCrumps, setModalContent } from 'store/controlsSlice';
import { setCurrentTeam } from 'store/academySlice';
import { WithRole } from 'hooks/roles';
import { useGetWeeklySessions } from 'services/hooks/weeklySessions/useGetWeeklySessions';
import { ThreeDots } from 'react-loader-spinner';

interface Props {
    team: Team;
}

export const WeeklySessionsTable = ({ team }: Props) => {
    const { trans, formatDate } = useLocales();
    const dispatch = useDispatch<any>();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 200;

    const { data: weeklySessions, isLoading: isWeeklySessionsLoading } = useGetWeeklySessions({
        page: currentPage,
        limit: itemsPerPage,
        team_id: team.id,
    });

    const handleViewMore = (sessionId: string, date: Date) => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [ActiveTab.TEAM_LIST, 'Team Details', `${trans('session.header')}`],
            }),
        );
        dispatch(setCurrentTeam({ currentTeam: team }));
        router.navigate('team-session', { id: sessionId });
    };

    const handleAddSession = (date: string, weeklySessionId: string) => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'addWeeklySession',
                    title: trans('form.addSession.title'),
                    subtitle: `${trans('form.addSession.subtitle')} - ${formatDate(
                        new Date(date),
                        'YYYY-MM-DD',
                    )}`,
                    defaults: { date, weeklySessionId },
                },
            }),
        );
        dispatch(setCurrentTeam({ currentTeam: team }));
    };

    const handleAddWeeklySessionPlaning = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'addWeeklySessionPlanning',
                    title: trans('session.addPlanning', { defaultValue: 'Add week planing' }),
                    defaults: { teamId: team.id },
                },
            }),
        );
        dispatch(setCurrentTeam({ currentTeam: team }));
    };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={''} />
                <WithRole allowRoles={[UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN]}>
                    <Theme.Button $isTable={true} onClick={handleAddWeeklySessionPlaning}>
                        {trans('session.weekly.add')}
                    </Theme.Button>
                </WithRole>
            </Theme.ButtonWrapper>

            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Theme.CardHeader>
                        <Theme.CardHead>{trans('session.time')}</Theme.CardHead>
                        <Theme.CardHead>{trans('session.type')}</Theme.CardHead>
                        <Theme.CardHead>{trans('session.athletes')}</Theme.CardHead>
                        <Theme.CardHead>{trans('session.status')}</Theme.CardHead>
                        <Theme.CardHead></Theme.CardHead>
                    </Theme.CardHeader>
                    <Theme.CardBody>
                        {isWeeklySessionsLoading ? (
                            <ThreeDots color="#000" height={50} width={50} />
                        ) : weeklySessions?.data.length ? (
                            weeklySessions.data.map((session) => (
                                <div key={session.id}>
                                    <Theme.CardHeaderRow>
                                        <Theme.CardHeaderCol>
                                            {formatDate(session.weekDate, 'YYYY-MM-DD')}
                                        </Theme.CardHeaderCol>
                                        <Theme.CardHeaderCol>
                                            {trans('session.weekTargetLabel', {
                                                value: session.weekTarget,
                                            })}
                                        </Theme.CardHeaderCol>
                                        <Theme.CardHeaderCol>
                                            {trans('session.weekSessionsLabel', {
                                                value: session.sessions.length,
                                            })}
                                        </Theme.CardHeaderCol>
                                    </Theme.CardHeaderRow>

                                    {session.sessionDays.map((day, index) => {
                                        const sessionForDay = session.sessions.find(
                                            (s) => s.date === day.date,
                                        );

                                        return (
                                            <Theme.CardRow key={index}>
                                                <Theme.CardCol>
                                                    {formatDate(day.date, 'YYYY-MM-DD') || day.date}
                                                </Theme.CardCol>

                                                {sessionForDay ? (
                                                    <>
                                                        <Theme.CardCol>
                                                            {String(
                                                                trans(
                                                                    `session.${sessionForDay.type.toLowerCase()}`,
                                                                    sessionForDay.type,
                                                                ),
                                                            )}
                                                        </Theme.CardCol>
                                                        <Theme.CardCol>
                                                            {team?.athletes?.length || 0}
                                                        </Theme.CardCol>
                                                        <Theme.CardCol>
                                                            {String(
                                                                trans(
                                                                    `session.${sessionForDay.status.toLowerCase()}`,
                                                                    sessionForDay.status,
                                                                ),
                                                            )}
                                                        </Theme.CardCol>
                                                        <Theme.CardCol>
                                                            <Theme.ViewMoreLink
                                                                onClick={() =>
                                                                    handleViewMore(
                                                                        sessionForDay.id,
                                                                        new Date(day.date),
                                                                    )
                                                                }
                                                            >
                                                                {trans('home.teamsList.viewMore')}
                                                            </Theme.ViewMoreLink>
                                                        </Theme.CardCol>
                                                    </>
                                                ) : (
                                                    <Theme.CardCol
                                                        style={{ flex: '1', textAlign: 'center' }}
                                                    >
                                                        <Theme.Button
                                                            onClick={() =>
                                                                handleAddSession(
                                                                    day.date,
                                                                    session.id,
                                                                )
                                                            }
                                                        >
                                                            {trans('session.add')}
                                                        </Theme.Button>
                                                    </Theme.CardCol>
                                                )}
                                            </Theme.CardRow>
                                        );
                                    })}
                                </div>
                            ))
                        ) : (
                            <Theme.EmptyTableWrapper>
                                <Theme.EmptyTableIcon
                                    src="/assets/icons/clock-icon.png"
                                    alt="clock"
                                />
                                <Theme.EmptyTableText
                                    variant="p"
                                    value={trans('home.dashboard.empty')}
                                />
                            </Theme.EmptyTableWrapper>
                        )}
                    </Theme.CardBody>
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
