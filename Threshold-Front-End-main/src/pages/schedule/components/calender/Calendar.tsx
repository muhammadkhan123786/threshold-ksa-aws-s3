import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useGetSessionsByCoach } from 'hooks/data/useGetSessionsByCoach';
import * as Theme from './Theme';
import DateHeader from '../dataHeader/DateHeader';
import { HeaderCell } from '../cells/HeaderCell';
import { Cell } from '../cells/Cell';
import {
    ensureMinimumDisplay,
    getSessionForTimeRange,
    getUniqueSortedTimeRanges,
} from 'libs/utils/calendarUtils';
import Note from '../cells/Note';
import { isEmpty } from 'lodash';
import { useLocales } from 'hooks/locales';
import { useRoute } from 'react-router5';

const Calendar: React.FC = () => {
    const { trans } = useLocales();
    const { router } = useRoute();
    const [activeDay, setActiveDay] = useState(moment().date());
    const [currentDate, setCurrentDate] = useState(moment());
    const [timeRanges, setTimeRanges] = useState<string[]>([]);
    const date = currentDate.clone().date(activeDay).toDate();
    const { data: groupedSessions, isLoading } = useGetSessionsByCoach({
        dependents: [currentDate.month(), activeDay],
        date: date,
    });

    const handleOnclickNoteAction = (sessions: any) => {
        const sessionId = sessions?.[0]?.id;

        router.navigate('confirm_session', { id: sessionId });
    };

    useEffect(() => {
        if (groupedSessions) {
            setTimeRanges(getUniqueSortedTimeRanges(groupedSessions));
        }
    }, [groupedSessions]);

    if (isLoading) {
        return (
            <Theme.Body>
                <DateHeader
                    setActiveDay={setActiveDay}
                    activeDay={activeDay}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                />
                <Theme.LoadingMessage>{trans('calendar.loading')}</Theme.LoadingMessage>
            </Theme.Body>
        );
    }

    const teamsToShow: any[] = ensureMinimumDisplay(groupedSessions || [], 4, {});
    const timeRangesToShow: string[] = ensureMinimumDisplay(timeRanges, 8, '');

    return (
        <Theme.Body>
            <DateHeader
                setActiveDay={setActiveDay}
                activeDay={activeDay}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />
            {teamsToShow?.length ? (
                <>
                    <Theme.HeaderBody>
                        <HeaderCell title={trans('calendar.time_teams')} />
                        {teamsToShow.map((team: any) => (
                            <HeaderCell key={team.id} title={team.name} logo={team.logo} />
                        ))}
                    </Theme.HeaderBody>
                    <Theme.CellBody>
                        <Theme.Column>
                            {timeRangesToShow.map((timeRange, index) => (
                                <Cell key={index}>{timeRange}</Cell>
                            ))}
                        </Theme.Column>
                        {teamsToShow.map((team: any) => (
                            <Theme.Column key={team.id}>
                                {timeRangesToShow.map((timeRange, timeIndex) => (
                                    <Cell key={timeIndex}>
                                        {!isEmpty(team.sessions) && (
                                            <Note
                                                // onClick={handleOnclickNoteAction.bind(
                                                //     this,
                                                //     team.sessions,
                                                // )}
                                                status={
                                                    getSessionForTimeRange(team.sessions, timeRange)
                                                        ?.status
                                                }
                                                type={
                                                    getSessionForTimeRange(team.sessions, timeRange)
                                                        ?.type
                                                }
                                            />
                                        )}
                                    </Cell>
                                ))}
                            </Theme.Column>
                        ))}
                    </Theme.CellBody>
                </>
            ) : (
                <Theme.NoDataMessage>{trans('calendar.no_sessions')} </Theme.NoDataMessage>
            )}
        </Theme.Body>
    );
};

export default Calendar;
