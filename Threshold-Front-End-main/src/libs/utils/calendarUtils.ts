import moment from 'moment';

export const getSessionForTimeRange = (sessions: any[], timeRange: string) => {
    const [from, to] = timeRange.split(' - ');
    const fromTime = moment(from, 'HH:mm');
    const toTime = moment(to, 'HH:mm');
    return sessions.find((session) => {
        const sessionStart = moment(session.from, 'HH:mm');
        const sessionEnd = moment(session.to, 'HH:mm');
        return fromTime.isSameOrAfter(sessionStart) && toTime.isSameOrBefore(sessionEnd);
    });
};

export const getUniqueSortedTimeRanges = (groupedSessions: any) => {
    const uniqueTimeRanges = new Set<string>();
    groupedSessions.forEach((team: any) => {
        team.sessions.forEach((session: any) => {
            uniqueTimeRanges.add(`${session.from} - ${session.to}`);
        });
    });
    const sortedTimeRanges = Array.from(uniqueTimeRanges).sort((a, b) => {
        const [fromA] = a.split(' - ');
        const [fromB] = b.split(' - ');
        return moment(fromA, 'HH:mm').diff(moment(fromB, 'HH:mm'));
    });
    return sortedTimeRanges;
};

export const ensureMinimumDisplay = <T>(array: any[], minimumCount: number, filler: T): T[] => {
    if (array?.length >= minimumCount) {
        return array;
    } else {
        const additionalItemsNeeded = minimumCount - array?.length;
        return [...array, ...Array(additionalItemsNeeded).fill(filler)];
    }
};
