import React, { useState } from 'react';
import * as Theme from './Theme';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, Locale } from 'date-fns';
import parse from 'date-fns/parse';
import { startOfWeek } from 'date-fns';
import getDay from 'date-fns/getDay';
import styled from 'styled-components';
import { SharedButton } from 'components/sharedButton';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventModal } from 'components/addEventModal';
import { useSelector } from 'react-redux';
import { ar, enUS } from 'date-fns/locale';
import { useLocales } from 'hooks/locales';

// Replace the locales definition
const locales: { [key: string]: Locale } = {
    'en-US': enUS,
    ar: ar,
};

const getLocalizer = (lang: string) =>
    dateFnsLocalizer({
        format,
        parse,
        startOfWeek: (date: Date) => {
            const locale = locales[lang === 'ar' ? 'ar' : 'en-US'];
            return startOfWeek(date, { locale });
        },
        getDay,
        locales,
    });

// Update Event type definition
interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    category: 'Matches' | 'Sessions' | 'Finished Contract' | 'Holidays';
    time?: string;
    notes?: string[];
}

// Update category colors with more complete styling information
const categoryStyles = {
    Matches: {
        backgroundColor: 'rgba(47, 164, 228, 0.15)',
        color: 'rgba(47, 164, 228, 1)',
        borderLeft: '3px solid rgba(47, 164, 228, 1)',
    },
    Sessions: {
        backgroundColor: 'rgba(192, 211, 48, 0.15)',
        color: 'rgba(192, 211, 48, 1)',
        borderLeft: '3px solid rgba(192, 211, 48, 1)',
    },
    'Finished Contract': {
        backgroundColor: 'rgba(238, 2, 14, 0.15)',
        color: 'rgba(238, 2, 14, 1)',
        borderLeft: '3px solid rgba(238, 2, 14, 1)',
    },
    Holidays: {
        backgroundColor: 'rgba(176, 137, 67, 0.15)',
        color: 'rgba(176, 137, 67, 1)',
        borderLeft: '3px solid rgba(176, 137, 67, 1)',
    },
};

const fakeEvents: CalendarEvent[] = [
    {
        title: 'Team Match vs Rivals',
        start: new Date(2025, 1, 2, 14, 0), // February 2, 2025
        end: new Date(2025, 1, 2, 16, 0),
        allDay: false,
        category: 'Matches',
        time: '2:00 PM',
        notes: [
            'I will make a surprise for team 2, because they won last match.',
            'Need to prepare special drills for goalkeepers',
        ],
    },
    {
        title: 'Player Development Session',
        start: new Date(2025, 1, 5, 10, 0), // February 5, 2025
        end: new Date(2025, 1, 5, 12, 0),
        allDay: false,
        category: 'Sessions',
        time: '10:00 AM',
        notes: ['Review last game tactics'],
    },
    {
        title: 'Contract Ended - John Doe',
        start: new Date(2025, 1, 10), // February 10, 2025
        end: new Date(2025, 1, 10),
        allDay: true,
        category: 'Finished Contract',
        notes: ['John Doe has finished his contract'],
    },
    {
        title: 'Summer Break Start',
        start: new Date(2025, 1, 15), // February 15, 2025
        end: new Date(2025, 1, 15),
        allDay: true,
        category: 'Holidays',
        notes: ['Summer break starts'],
    },
    {
        title: 'Friendly Match',
        start: new Date(2025, 1, 20, 16, 0), // February 20, 2025
        end: new Date(2025, 1, 20, 18, 0),
        allDay: false,
        category: 'Matches',
        time: '4:00 PM',
        notes: ['Friendly match against local team'],
    },
];

export function SportProfileManagerOverview() {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const { lang } = useSelector<any>((state) => state?.locales) as any;
    const { trans } = useLocales();
    const localizer = getLocalizer(lang === 'ar' ? 'ar' : 'en-US');

    const handleNavigate = (action: 'PREV' | 'NEXT') => {
        const newDate = new Date(date);
        if (action === 'PREV') {
            newDate.setMonth(date.getMonth() - 1);
        } else {
            newDate.setMonth(date.getMonth() + 1);
        }
        setDate(newDate);
    };

    const filters = ['all', 'matches', 'sessions', 'finishedContract', 'holidays'];

    const filteredEvents = fakeEvents.filter(
        (event) => activeFilter === 'all' || event.category === activeFilter,
    );

    const selectedDateEvents = selectedDate
        ? filteredEvents.filter(
              (event) => format(event.start, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
          )
        : [];

    const handleSelectSlot = ({ start, action }: { start: Date; action: string }) => {
        if (action === 'click' || action === 'select') {
            setSelectedDate(start);
        }
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedDate(event.start);
    };

    const eventPropGetter = (event: CalendarEvent) => ({
        style: {
            ...categoryStyles[event.category],
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            margin: '1px 0',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 500,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    });

    return (
        <Theme.SportProfileOverviewContainer>
            <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <Theme.CalendarHeader>
                <Theme.NavigationHeader>
                    <Theme.ArrowButton onClick={() => handleNavigate('PREV')} rtl={lang === 'ar'}>
                        {lang === 'ar' ? '›' : '‹'}
                    </Theme.ArrowButton>
                    <h2 className="text-lg font-normal">
                        {format(date, 'MMMM', { locale: lang === 'ar' ? ar : enUS })},{' '}
                        {format(date, 'yyyy')}
                    </h2>
                    <Theme.ArrowButton onClick={() => handleNavigate('NEXT')} rtl={lang === 'ar'}>
                        {lang === 'ar' ? '‹' : '›'}
                    </Theme.ArrowButton>
                </Theme.NavigationHeader>

                <Theme.FilterSection>
                    <Theme.FilterContainer>
                        {filters.map((filter: string) => (
                            <Theme.FilterButton
                                key={filter}
                                isActive={activeFilter === filter}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {trans(`menu.calendar.filters.${filter}`)}
                            </Theme.FilterButton>
                        ))}
                    </Theme.FilterContainer>
                    <Theme.CreateEventButton
                        onClick={() => setIsModalOpen(true)}
                        style={{ marginTop: '0' }}
                    >
                        {trans('menu.calendar.filters.createEvent')}
                    </Theme.CreateEventButton>
                </Theme.FilterSection>
            </Theme.CalendarHeader>

            <Theme.CalendarContainer>
                <Theme.StyledCalendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 700, flex: 1 }}
                    views={['month']}
                    date={date}
                    onNavigate={(newDate: any) => setDate(newDate)}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable={true}
                    eventPropGetter={eventPropGetter}
                    rtl={lang === 'ar'}
                    culture={lang === 'ar' ? 'ar' : 'en-US'}
                    formats={{
                        monthHeaderFormat: (date: Date) =>
                            format(date, 'MMMM yyyy', {
                                locale: lang === 'ar' ? ar : enUS,
                            }),
                        dayHeaderFormat: (date: Date) =>
                            format(date, 'EEEE', {
                                locale: lang === 'ar' ? ar : enUS,
                            }),
                        dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
                            `${format(start, 'MMMM dd', {
                                locale: lang === 'ar' ? ar : enUS,
                            })} – ${format(end, 'MMMM dd', {
                                locale: lang === 'ar' ? ar : enUS,
                            })}`,
                    }}
                />

                {selectedDate && (
                    <Theme.DayEventsPanel>
                        <Theme.DayHeader>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Theme.DateBadge>
                                    {format(selectedDate, 'dd MMM yyyy')}
                                </Theme.DateBadge>
                                <h3>Events</h3>
                            </div>
                            <Theme.CloseButton
                                onClick={() => setSelectedDate(null)}
                                aria-label="Close panel"
                            >
                                ×
                            </Theme.CloseButton>
                        </Theme.DayHeader>
                        {selectedDateEvents.length > 0 ? (
                            selectedDateEvents.map((event: any, index: number) => (
                                <Theme.EventItem key={index} category={event.category}>
                                    <div>{event.time}</div>
                                    <div>{event.title}</div>
                                </Theme.EventItem>
                            ))
                        ) : (
                            <p>No events for this day.</p>
                        )}

                        <Theme.NoteSection>
                            <Theme.NoteHeader>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Note
                            </Theme.NoteHeader>
                            <Theme.NoteList>
                                {selectedDateEvents.some(
                                    (event) => (event.notes?.length ?? 0) > 0,
                                ) ? (
                                    selectedDateEvents.map(
                                        (event) =>
                                            event.notes?.map((note, index) => (
                                                <Theme.NoteItem
                                                    key={`${event.title}-note-${index}`}
                                                >
                                                    {note}
                                                </Theme.NoteItem>
                                            )),
                                    )
                                ) : (
                                    <Theme.NoteItem>No notes for this day</Theme.NoteItem>
                                )}
                            </Theme.NoteList>
                        </Theme.NoteSection>
                    </Theme.DayEventsPanel>
                )}
            </Theme.CalendarContainer>
        </Theme.SportProfileOverviewContainer>
    );
}
