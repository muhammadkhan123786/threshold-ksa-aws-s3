import { useMemo } from 'react';
import moment from 'moment';

export const useTimeSlots = (start: string, end: string, interval: number) => {
    return useMemo(() => {
        const startTime = moment(start, 'HH:mm');
        const endTime = moment(end, 'HH:mm').add(1, 'day');
        const times = [];

        while (startTime < endTime) {
            const slotStart = startTime.format('HH:mm');
            startTime.add(interval, 'minutes');
            const slotEnd = startTime.format('HH:mm');
            times.push(`${slotStart} - ${slotEnd}`);
        }

        return times;
    }, [start, end, interval]);
};
