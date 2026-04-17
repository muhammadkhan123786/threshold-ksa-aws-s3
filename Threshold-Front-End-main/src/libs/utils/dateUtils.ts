import moment from 'moment';

export interface DateState {
    currentDate: moment.Moment;
    day: number;
}

export const getDaysInMonth = (currentDate: moment.Moment): number[] => {
    const daysInMonth = currentDate.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

export const getVisibleDays = (
    days: number[],
    activeDay: number,
    maxVisibleDays: number,
    daysInMonth: number,
): number[] => {
    const startVisibleDayIndex = Math.max(
        0,
        Math.min(daysInMonth - maxVisibleDays, activeDay - Math.ceil(maxVisibleDays / 2)),
    );
    const endVisibleDayIndex = startVisibleDayIndex + maxVisibleDays;
    return days.slice(startVisibleDayIndex, endVisibleDayIndex);
};

export const getMaxVisibleDays = (width: number): number => {
    return Math.max(1, Math.floor((width - 500) / 70));
};

export const handlePreviousMonth = (
    currentDate: moment.Moment,
    setCurrentDate: (date: moment.Moment) => void,
    setActiveDay: (day: number) => void,
    currentDay: number,
) => {
    const newDate = currentDate.clone().subtract(1, 'month');
    setCurrentDate(newDate);
    setActiveDay(Math.min(currentDay, newDate.daysInMonth()));
};

export const handleNextMonth = (
    currentDate: moment.Moment,
    setCurrentDate: (date: moment.Moment) => void,
    setActiveDay: (day: number) => void,
    currentDay: number,
) => {
    const newDate = currentDate.clone().add(1, 'month');
    setCurrentDate(newDate);
    setActiveDay(Math.min(currentDay, newDate.daysInMonth()));
};

export const handlePreviousDays = (
    currentDate: moment.Moment,
    maxVisibleDays: number,
    setActiveDay: (day: number) => void,
    activeDay: number,
) => {
    setActiveDay(Math.max(1, activeDay - maxVisibleDays));
};

export const handleNextDays = (
    currentDate: moment.Moment,
    maxVisibleDays: number,
    daysInMonth: number,
    setActiveDay: (day: number) => void,
    activeDay: number,
) => {
    setActiveDay(Math.min(daysInMonth, activeDay + maxVisibleDays));
};
