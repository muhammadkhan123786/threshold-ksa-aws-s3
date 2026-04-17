import React from 'react';
import moment from 'moment';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useWindowSize } from 'hooks/windowSize';
import * as Theme from './Theme';
import {
    getDaysInMonth,
    getVisibleDays,
    getMaxVisibleDays,
    handlePreviousMonth,
    handleNextMonth,
    handlePreviousDays,
    handleNextDays,
} from 'libs/utils/dateUtils';

interface DateHeaderProps {
    setActiveDay: (day: number) => void;
    activeDay: number;
    currentDate: moment.Moment;
    setCurrentDate: (date: moment.Moment) => void;
}

const DateHeader: React.FC<DateHeaderProps> = ({
    setActiveDay,
    activeDay,
    currentDate,
    setCurrentDate,
}) => {
    const { width } = useWindowSize();
    const { lang, isRTL } = useSelector<any>((state) => state?.locales) as any;

    const daysInMonth = currentDate.daysInMonth();
    const days = getDaysInMonth(currentDate);
    const maxVisibleDays = getMaxVisibleDays(width);
    const visibleDays = getVisibleDays(days, activeDay, maxVisibleDays, daysInMonth);

    return (
        <Theme.DateHeaderContainer>
            <Theme.NavigationButton
                onClick={() =>
                    handlePreviousMonth(currentDate, setCurrentDate, setActiveDay, activeDay)
                }
                aria-label={isRTL ? 'Next Month' : 'Previous Month'}
            >
                {isRTL ? <FiChevronRight /> : <FiChevronLeft />}
            </Theme.NavigationButton>
            <Theme.MonthDisplay>
                <span>
                    {currentDate.locale(lang).format('MMMM')}{' '}
                    {currentDate.locale('en').format('YYYY')}
                </span>
            </Theme.MonthDisplay>
            <Theme.NavigationButton
                onClick={() =>
                    handleNextMonth(currentDate, setCurrentDate, setActiveDay, activeDay)
                }
                aria-label={isRTL ? 'Previous Month' : 'Next Month'}
            >
                {isRTL ? <FiChevronLeft /> : <FiChevronRight />}
            </Theme.NavigationButton>
            <Theme.DaysContainer>
                <Theme.NavigationButton
                    onClick={() =>
                        handlePreviousDays(currentDate, maxVisibleDays, setActiveDay, activeDay)
                    }
                    disabled={visibleDays[0] === 1}
                    aria-label={isRTL ? 'Next Days' : 'Previous Days'}
                >
                    {isRTL ? <FiChevronRight /> : <FiChevronLeft />}
                </Theme.NavigationButton>
                {visibleDays.map((day) => (
                    <Theme.Day
                        key={day}
                        active={day === activeDay}
                        onClick={() => setActiveDay(day)}
                    >
                        {day}
                    </Theme.Day>
                ))}
                <Theme.NavigationButton
                    onClick={() =>
                        handleNextDays(
                            currentDate,
                            maxVisibleDays,
                            daysInMonth,
                            setActiveDay,
                            activeDay,
                        )
                    }
                    disabled={visibleDays[visibleDays?.length - 1] === daysInMonth}
                    aria-label={isRTL ? 'Previous Days' : 'Next Days'}
                >
                    {isRTL ? <FiChevronLeft /> : <FiChevronRight />}
                </Theme.NavigationButton>
            </Theme.DaysContainer>
        </Theme.DateHeaderContainer>
    );
};

export default DateHeader;
