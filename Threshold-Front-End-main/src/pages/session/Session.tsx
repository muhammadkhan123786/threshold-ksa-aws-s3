import { useRouter } from 'react-router5';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { SessionPlayingType, SessionRecord } from 'libs/types';
import { useGetSessionRecords, useGetSessions } from 'hooks/data';
import { SessionRecordsTable } from 'components/tables';
import { selectControls, setBreadCrumps } from 'store/controlsSlice';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveTab, PlayingSessionStatus, SessionRecordStatus, UserRole } from 'libs/enums';
import { formatDate } from 'hooks/locales/useLocales';
import { StatusIndicator } from 'components';
import { WithRole } from 'hooks/roles';
import DrillList from 'pages/confirmSession/components/drillList/drillList';

export const SessionPage = () => {
    const { trans } = useLocales();
    const { modalContent } = useSelector(selectControls);
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        params: { id },
    } = router.getState();

    const session = useGetSessions<SessionPlayingType>({
        id,
        idType: 'session',
        dependents: [id, modalContent],
    });

    const sessionRecords = useGetSessionRecords<SessionRecord[]>({
        id,
        idType: 'session',
        dependents: [id, modalContent],
    });

    const isSessionDone = session?.status === PlayingSessionStatus.DONE;

    const { absentAthleteRecords, presentAthleteRecords } = (sessionRecords || []).reduce(
        (acc, record) => {
            const isPresent = record.status === SessionRecordStatus.PRESENT;

            return {
                presentAthleteRecords: [
                    ...acc.presentAthleteRecords,
                    ...(isPresent ? [record] : []),
                ],
                absentAthleteRecords: [
                    ...acc.absentAthleteRecords,
                    ...(!isPresent ? [record] : []),
                ],
            };
        },
        {
            absentAthleteRecords: [] as SessionRecord[],
            presentAthleteRecords: [] as SessionRecord[],
        },
    );

    const handleSesstionUpdate = () => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [
                    ActiveTab.TEAM_LIST,
                    'Team Details',
                    `${trans('session.header')} - ${formatDate(session?.date, 'YYYY-MM-DD')}`,
                    `${trans('session.detail.update')}`,
                ],
            }),
        );

        router.navigate('session_update', { id });
    };

    return (
        <Theme.Body>
            <Theme.AvatarSection>
                <Theme.Avatar
                    src={session?.team?.logo || '/assets/images/logo-placeholder.jpg'}
                    alt="avatar"
                />

                <Theme.Name variant="h3" value={session?.team?.name || ''} />

                <WithRole
                    allowRoles={[UserRole.COACH, UserRole.CLUB_ADMIN, UserRole.ACADEMY_ADMIN]}
                >
                    <Theme.Button className="truncate text-ellipsis" onClick={handleSesstionUpdate}>
                        {trans('session.detail.checking.presence')}
                    </Theme.Button>
                </WithRole>
            </Theme.AvatarSection>

            <Theme.SessionTitleSection className="mr-auto text-[18px] uppercase font-bold flex flex-wrap">
                <Theme.SessionTitle>
                    {`${trans('session.header')} - ${formatDate(session?.date || '')}`}
                </Theme.SessionTitle>
                <StatusIndicator
                    isActive={session?.status === PlayingSessionStatus.DONE}
                    inactiveStatus={{
                        color: 'red',
                        text: trans('session.not_started'),
                    }}
                    activeStatus={{
                        color: 'green',
                        text: trans('session.done'),
                    }}
                />
            </Theme.SessionTitleSection>
            <DrillList />
            <SharedTheme.TableTitle
                value={trans('session.presentAthletes')}
                variant="h3"
                style={{
                    margin: '0px',
                    width: '100%',
                    fontSize: '30px',
                    textTransform: 'capitalize',
                }}
            />
            <SharedTheme.TableContainer
                style={{
                    marginTop: '0px',
                }}
            >
                <SessionRecordsTable sessionRecords={presentAthleteRecords} />
            </SharedTheme.TableContainer>
            <SharedTheme.TableTitle
                value={trans('session.absentAthletes')}
                variant="h3"
                style={{
                    margin: '0px',
                    width: '100%',
                    fontSize: '30px',
                    textTransform: 'capitalize',
                }}
            />
            <SharedTheme.TableContainer
                style={{
                    marginTop: '0px',
                }}
            >
                <SessionRecordsTable sessionRecords={absentAthleteRecords} />
            </SharedTheme.TableContainer>
        </Theme.Body>
    );
};
