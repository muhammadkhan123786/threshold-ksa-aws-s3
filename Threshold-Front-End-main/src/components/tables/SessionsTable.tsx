import { Table } from 'components/table';
import { useLocales } from 'hooks/locales';
import { SessionPlayingType, Team } from 'libs/types';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'routers';
import * as Theme from './Theme';
import { ActiveTab, PlayingSessionStatus, SessionRecordStatus, UserRole } from 'libs/enums';
import { selectControls, setBreadCrumps, setModalContent } from 'store/controlsSlice';
import { stringToDateString, valueToSelectOption } from 'libs/helpers';
import { SessionRecord } from 'libs/types/session';
import { StatusIndicator } from 'components/status-indicator';
import { setCurrentSessionRecords, setCurrentSession, setCurrentTeam } from 'store/academySlice';
import { useGetSessionRecords } from 'hooks/data';
import { isEmpty } from 'lodash';
import { WithRole } from 'hooks/roles';
interface Props {
    sessions: SessionPlayingType[];
    team: Team;
}

const EditButton = ({
    id,
    index,
    sessionObj,
}: {
    id: string;
    index: number;
    sessionObj: SessionPlayingType;
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();
    const { modalContent } = useSelector(selectControls);
    const sessionRecords = useGetSessionRecords({
        id: sessionObj.id,
        idType: 'session',
        // status: SessionRecordStatus.PRESENT,
        dependents: [modalContent],
    });

    const handleEditSession = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editSession',
                    title: trans('form.editSession.title'),
                    subtitle: trans('form.editSession.subtitle'),
                    defaults: {
                        status: valueToSelectOption(
                            sessionObj.status,
                            PlayingSessionStatus,
                            trans,
                            'session.',
                        ),
                    },
                },
            }),
        );

        dispatch(setCurrentSession({ currentSession: sessionObj }));
        dispatch(setCurrentSessionRecords({ currentSessionRecords: sessionRecords }));
    };

    return (
        <Theme.Button
            key={`TableButton for ${id} number ${index}`}
            onClick={handleEditSession}
            $isTable={true}
            style={{
                margin: 'auto',
                width: 'fit-content',
                height: 'fit-content',
                padding: '5px 10px',
            }}
        >
            {trans('session.update')}
        </Theme.Button>
    );
};

export const SessionsTable = ({ sessions, team }: Props) => {
    const { trans, formatDate } = useLocales();
    const dispatch = useDispatch<any>();

    const { finishedSessions, unfinishedSessions } = !sessions
        ? {
              finishedSessions: [],
              unfinishedSessions: [],
          }
        : sessions.reduce(
              (acc, session) => {
                  const isDone = session.status === PlayingSessionStatus.DONE;

                  return {
                      finishedSessions: [...acc.finishedSessions, ...(isDone ? [session] : [])],
                      unfinishedSessions: [
                          ...acc.unfinishedSessions,
                          ...(!isDone ? [session] : []),
                      ],
                  };
              },
              {
                  finishedSessions: [] as SessionPlayingType[],
                  unfinishedSessions: [] as SessionPlayingType[],
              },
          );

    const handleViewMore = (id: string, date: Date) => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [
                    ActiveTab.TEAM_LIST,
                    'Team Details',
                    `${trans('session.header')} - ${formatDate(date, 'YYYY-MM-DD')}`,
                ],
            }),
        );

        dispatch(setCurrentTeam({ currentTeam: team }));
        router.navigate('session', { id }, { replace: true });
    };

    const handleSesstionUpdate = (id: string, date: Date) => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [
                    ActiveTab.TEAM_LIST,
                    'Team Details',
                    `${trans('session.header')} - ${formatDate(date, 'YYYY-MM-DD')}`,
                    `${trans('session.detail.update')}`,
                ],
            }),
        );

        dispatch(setCurrentTeam({ currentTeam: team }));
        router.navigate('session_update', { id });
    };

    const handleAddSession = () => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [ActiveTab.TEAM_LIST, 'Team Details', trans('session.add')],
            }),
        );
        router.navigate('add-sesstion-page');
    };
    const getAvgScale = (records: SessionRecord[]): number | string => {
        if (isEmpty(records) || (records?.length > 0 && records[0].scale === null))
            return trans('session.not_yet');

        const total = records.reduce((acc, { scale }) => acc + Number(scale), 0);
        const avg = total / records?.length;

        return isNaN(avg) ? 0 : avg;
    };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('session.info')} />
                <WithRole allowRoles={[UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN]}>
                    <Theme.Button onClick={handleAddSession} $isTable={true}>
                        {trans('session.add')}
                    </Theme.Button>
                </WithRole>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={6}
                        headerRow={[
                            <>{trans('session.time')}</>,
                            <>{trans('session.type')}</>,
                            <>{trans('session.athletes')}</>,
                            <>{trans('session.status')}</>,
                            <>{trans('session.scale')}</>,
                            <></>,
                        ]}
                        rowsComponents={[...unfinishedSessions, ...finishedSessions].map(
                            (sessionObj: any, index) => {
                                const {
                                    id,
                                    type,
                                    date,
                                    status,
                                    from,
                                    to,
                                    sessionRecords,
                                    avgscale,
                                } = sessionObj;

                                return [
                                    <>{`${stringToDateString(date)} - ${from} ~ ${to}`}</>,
                                    <>{trans(`session.${type}`, type)}</>,
                                    <>{team?.athletes?.length || 0}</>,

                                    <StatusIndicator
                                        key={`TableStatus for ${id} number ${index}`}
                                        isActive={status === PlayingSessionStatus.DONE}
                                        inactiveStatus={{
                                            color: 'red',
                                            text: trans('session.not_started'),
                                        }}
                                        activeStatus={{
                                            color: 'green',
                                            text: trans('session.done'),
                                        }}
                                    />,
                                    <>{avgscale}</>,
                                    status === PlayingSessionStatus.NOT_STARTED ? (
                                        <>
                                            <WithRole allowRoles={[UserRole.COACH]}>
                                                <Theme.Button
                                                    key={`TableButton for ${id} number ${index}`}
                                                    onClick={() => handleSesstionUpdate(id, date)}
                                                    $isTable={true}
                                                    style={{
                                                        margin: 'auto',
                                                        width: 'fit-content',
                                                        height: 'fit-content',
                                                        padding: '5px 10px',
                                                    }}
                                                >
                                                    {trans('session.update')}
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
                            },
                        )}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
