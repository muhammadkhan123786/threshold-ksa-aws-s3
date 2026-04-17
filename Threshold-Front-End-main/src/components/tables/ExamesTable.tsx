import { Table } from 'components/table';
import { useLocales } from 'hooks/locales';
import { Team } from 'libs/types';
import { useDispatch } from 'react-redux';
import { router } from 'routers';
import * as Theme from './Theme';
import { ActiveTab, PlayingSessionStatus, UserRole } from 'libs/enums';
import { setBreadCrumps, setModalContent } from 'store/controlsSlice';
import { stringToDateString } from 'libs/helpers';
import { StatusIndicator } from 'components/status-indicator';
import { setCurrentTeam } from 'store/academySlice';
import { WithRole } from 'hooks/roles';
import { ExamSession } from 'services/hooks/sessions/useFetchExamSessionsByTeamId';

interface Props {
    examSessions: ExamSession[];
    team: Team;
}

export const ExamSessionsTable = ({ examSessions, team }: Props) => {
    const { trans, formatDate } = useLocales();
    const dispatch = useDispatch<any>();

    const handleViewMore = (id: string, date: Date) => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [
                    ActiveTab.TEAM_LIST,
                    'Team Details',
                    `${trans('examSession.header')} - ${formatDate(date, 'YYYY-MM-DD')}`,
                ],
            }),
        );

        dispatch(setCurrentTeam({ currentTeam: team }));
        router.navigate('exam_session', { id }, { replace: true });
    };

    const handleExamSessionUpdate = (id: string, date: Date) => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [
                    ActiveTab.TEAM_LIST,
                    'Team Details',
                    `${trans('examSession.header')} - ${formatDate(date, 'YYYY-MM-DD')}`,
                    `${trans('examSession.detail.update')}`,
                ],
            }),
        );

        dispatch(setCurrentTeam({ currentTeam: team }));
        router.navigate('exam_session_update', { id });
    };

    const handleAddExamSession = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'addExamSession',
                    title: trans('form.addExamSession.title'),
                    subtitle: trans('form.addExamSession.subtitle'),
                    defaults: {},
                },
            }),
        );

        dispatch(setCurrentTeam({ currentTeam: team }));
    };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <WithRole allowRoles={[]}>
                    <Theme.Button onClick={handleAddExamSession} $isTable={true}>
                        {trans('examSession.add')}
                    </Theme.Button>
                </WithRole>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={6}
                        headerRow={[
                            <>{trans('examSession.time')}</>,
                            <>{trans('examSession.type')}</>,
                            <>{trans('examSession.athletes')}</>,
                            <>{trans('examSession.status')}</>,
                            <>{trans('examSession.scale')}</>,
                            <></>,
                        ]}
                        rowsComponents={examSessions?.map((examSessionObj: any, index) => {
                            const { id, type, date, status, from, to, avgscale } = examSessionObj;

                            return [
                                <>{`${stringToDateString(date)} - ${from} ~ ${to}`}</>,
                                <>{trans(`examSession.${type}`, type)}</>,
                                <>{team?.athletes?.length || 0}</>,

                                <StatusIndicator
                                    key={`TableStatus for ${id} number ${index}`}
                                    isActive={status === PlayingSessionStatus.DONE}
                                    inactiveStatus={{
                                        color: 'red',
                                        text: trans('examSession.not_started'),
                                    }}
                                    activeStatus={{
                                        color: 'green',
                                        text: trans('examSession.done'),
                                    }}
                                />,
                                <>{avgscale}</>,
                                status === PlayingSessionStatus.NOT_STARTED ? (
                                    <>
                                        <WithRole allowRoles={[UserRole.COACH]}>
                                            <Theme.Button
                                                key={`TableButton for ${id} number ${index}`}
                                                onClick={() => handleExamSessionUpdate(id, date)}
                                                $isTable={true}
                                                style={{
                                                    margin: 'auto',
                                                    width: 'fit-content',
                                                    height: 'fit-content',
                                                    padding: '5px 10px',
                                                }}
                                            >
                                                {trans('examSession.update')}
                                            </Theme.Button>
                                        </WithRole>
                                        <WithRole
                                            allowRoles={[
                                                UserRole.ACADEMY_ADMIN,
                                                UserRole.CLUB_ADMIN,
                                            ]}
                                        >
                                            <Theme.ViewMoreLink
                                                key={`TableLink for ${id} number ${index}`}
                                                onClick={() => handleViewMore(id, date)}
                                            >
                                                {trans('home.teamsList.viewMore')}
                                            </Theme.ViewMoreLink>
                                        </WithRole>
                                    </>
                                ) : (
                                    <Theme.ViewMoreLink
                                        key={`TableLink for ${id} number ${index}`}
                                        onClick={() => handleViewMore(id, date)}
                                    >
                                        {trans('home.teamsList.viewMore')}
                                    </Theme.ViewMoreLink>
                                ),
                            ];
                        })}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
