import React, { useEffect, useRef, useState } from 'react';
import { Timeline, DataSet, moment } from 'vis-timeline/standalone';
import * as Theme from './Theme';
import { TimelineItem, TimelineGroup } from '../../types/timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import { useSelector } from 'react-redux';
import { useLocales } from 'hooks/locales';

interface Session {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    location: {
        name: string;
        distance: number;
    };
    ageGroup: string;
    gender: 'male' | 'female';
    participants: {
        role: string;
        count: number;
    }[];
    totalParticipants: number;
}

const MOCK_SESSIONS: Session[] = [
    {
        id: '1',
        title: 'Morning Swim Training',
        startTime: '2025-02-24T07:00:00',
        endTime: '2025-02-24T09:00:00',
        location: {
            name: 'Olympic Pool',
            distance: 1500,
        },
        ageGroup: '10-12',
        gender: 'male',
        participants: [
            { role: 'Striker', count: 8 },
            { role: 'Defender', count: 6 },
        ],
        totalParticipants: 20,
    },
    {
        id: '2',
        title: 'Intermediate Training',
        startTime: '2025-02-24T09:30:00',
        endTime: '2025-02-24T11:00:00',
        location: {
            name: 'Community Pool',
            distance: 1200,
        },
        ageGroup: '13-15',
        gender: 'female',
        participants: [
            { role: 'Striker', count: 10 },
            { role: 'Defender', count: 8 },
            { role: 'Goalkeeper', count: 2 },
        ],
        totalParticipants: 25,
    },
    {
        id: '3',
        title: 'Elite Swim Practice',
        startTime: '2025-02-24T14:00:00',
        endTime: '2025-02-24T16:00:00',
        location: {
            name: 'National Aquatics Center',
            distance: 5000,
        },
        ageGroup: '16-18',
        gender: 'male',
        participants: [
            { role: 'Striker', count: 12 },
            { role: 'Defender', count: 10 },
            { role: 'Goalkeeper', count: 3 },
        ],
        totalParticipants: 30,
    },
    {
        id: '4',
        title: 'Beginner Water Drills',
        startTime: '2025-02-24T16:30:00',
        endTime: '2025-02-24T18:00:00',
        location: {
            name: 'City Sports Complex',
            distance: 2000,
        },
        ageGroup: '8-10',
        gender: 'female',
        participants: [
            { role: 'Striker', count: 6 },
            { role: 'Defender', count: 5 },
        ],
        totalParticipants: 15,
    },
    {
        id: '5',
        title: 'Evening Advanced Training',
        startTime: '2025-02-23T18:30:00',
        endTime: '2025-02-23T20:00:00',
        location: {
            name: 'Big Pool 3',
            distance: 3000,
        },
        ageGroup: '19-22',
        gender: 'male',
        participants: [
            { role: 'Striker', count: 10 },
            { role: 'Defender', count: 12 },
            { role: 'Goalkeeper', count: 4 },
        ],
        totalParticipants: 26,
    },
    {
        id: '6',
        title: 'Test Test',
        startTime: '2025-02-25T18:30:00',
        endTime: '2025-02-25T20:00:00',
        location: {
            name: 'Big Pool 3',
            distance: 3000,
        },
        ageGroup: '19-22',
        gender: 'male',
        participants: [
            { role: 'Striker', count: 10 },
            { role: 'Defender', count: 12 },
            { role: 'Goalkeeper', count: 4 },
        ],
        totalParticipants: 26,
    },
];

export const NewSchedulePage = () => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [timeline, setTimeline] = useState<Timeline | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date('2025-02-24'));
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'included'>('all');
    const { lang } = useSelector<any>((state) => state?.locales) as any;
    const { trans } = useLocales();

    const formatSessionContent = (session: Session) => {
        const participantsText = session.participants
            .map((p) => `${p.role} (${p.count})`)
            .join(', ');

        return `
            <div>
                <div>
                    <div>
                        <p>${session.title}</p>
                        <p> > </p>
                    </div>
                    <div>
                        <img src='/assets/icons/address-icon.svg' alt='icon' />
                        <p>${session.location.name}</p>
                    </div>
                    <div class="location-info">
                        <div>
                            <span>${session.location.name}</span>
                        </div>
                        <div>
                            <img src='/assets/icons/target-icon.svg' alt='icon' />
                            <span>${session.location.distance} meters</span>
                        </div>
                    </div>
                    <div class="player-info">
                        <div>
                            <span>${participantsText}</span>
                        </div>
                        <div>
                            <span>Total: ${session.totalParticipants}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    const loadTimelineData = (date: Date) => {
        const currentMoment = moment(date);
        const sessions = MOCK_SESSIONS.filter((session) => {
            const sessionStart = moment(session.startTime);
            const isSameDate = sessionStart.isSame(currentMoment, 'day');

            if (selectedFilter === 'all') return isSameDate;
            if (selectedFilter === 'included') return isSameDate && session.totalParticipants > 20;

            return false;
        });
        const uniqueGroups = Array.from(new Set(sessions.map((s) => `${s.gender}-${s.ageGroup}`)));
        const groups = new DataSet<TimelineGroup>(
            uniqueGroups.map((groupId) => ({
                id: groupId,
                content: groupId.replace('-', ': ').replace('-', '-'),
            })),
        );

        const items = new DataSet<TimelineItem>(
            sessions.map((session) => ({
                id: session.id,
                group: `${session.gender}-${session.ageGroup}`,
                content: formatSessionContent(session),
                start: moment(session.startTime).toDate(),
                end: moment(session.endTime).toDate(),
                className: 'session-item',
            })),
        );

        if (timelineRef.current) {
            // Destroy the existing timeline if it exists
            if (timeline) {
                timeline.destroy();
                setTimeline(null); // Reset timeline state
            }

            // Clear the timeline container
            timelineRef.current.innerHTML = '';

            // Initialize a new timeline
            const options = {
                start: moment(date).set({ hour: 8, minute: 0, second: 0 }).toDate(),
                end: moment(date).add(1, 'day').set({ hour: 0, minute: 0, second: 0 }).toDate(),
                timeAxis: { scale: 'hour' as const, step: 1 },
                orientation: 'top' as const,
                stack: true,
                verticalScroll: true,
                zoomKey: 'ctrlKey' as const,
                height: '600px',
                groupHeightMode: 'fixed' as const,
                minHeight: '160px',
                groupMinHeight: 80,
                groupWidth: '200px',
                margin: { item: { horizontal: 20 } },
                zoomMin: 1000 * 60 * 60,
                zoomMax: 1000 * 60 * 60 * 24,
                showCurrentTime: true,
                rollingMode: { follow: true },
            };

            const newTimeline = new Timeline(timelineRef.current, items, groups, options);
            setTimeline(newTimeline);
        }
    };

    useEffect(() => {
        if (!timeline) return;
        const interval = setInterval(() => {
            timeline.setCurrentTime(moment().toDate());
        }, 60000);
        return () => clearInterval(interval);
    }, [timeline]);

    useEffect(() => {
        loadTimelineData(currentDate);
    }, [currentDate, selectedFilter]);

    const handlePrevious = () => {
        setCurrentDate(moment(currentDate).subtract(1, 'day').toDate());
    };

    const handleNext = () => {
        setCurrentDate(moment(currentDate).add(1, 'day').toDate());
    };

    const handleToday = () => {
        setCurrentDate(moment().toDate());
    };

    // Updated month select handler
    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newDate = moment(currentDate).month(parseInt(event.target.value, 10)).toDate();
        setCurrentDate(newDate);
    };

    return (
        <Theme.Body>
            <Theme.TimelineWrapper>
                <div className="timeline-header">
                    {/* Left Section */}
                    <div className="filters-section">
                        <span>{trans('schedule.timeline')}:</span>
                        <Theme.FilterButton
                            active={selectedFilter === 'all'}
                            onClick={() => setSelectedFilter('all')}
                        >
                            {trans('schedule.all')}
                        </Theme.FilterButton>
                        <Theme.FilterButton
                            active={selectedFilter === 'included'}
                            onClick={() => setSelectedFilter('included')}
                        >
                            {trans('schedule.included')}
                        </Theme.FilterButton>
                    </div>

                    {/* Right Section */}
                    <div className="navigation-section">
                        <div className="day-navigation">
                            <Theme.NavigationButton onClick={handlePrevious}>
                                {lang === 'ar' ? (
                                    <img
                                        src="/assets/icons/arrowleft.svg"
                                        alt="calendar icon"
                                        className="select-icon"
                                    />
                                ) : (
                                    <img
                                        src="/assets/icons/arrowleft.svg"
                                        alt="calendar icon"
                                        className="select-icon"
                                        style={{ transform: 'rotate(180deg)' }}
                                    />
                                )}
                                {trans('schedule.previous')}
                            </Theme.NavigationButton>
                            <Theme.NavigationButton onClick={handleToday}>
                                {trans('schedule.today')}
                            </Theme.NavigationButton>
                            <Theme.NavigationButton onClick={handleNext}>
                                {trans('schedule.next')}
                                {lang === 'ar' ? (
                                    <img
                                        src="/assets/icons/arrowleft.svg"
                                        alt="calendar icon"
                                        className="select-icon"
                                        style={{ transform: 'rotate(180deg)' }}
                                    />
                                ) : (
                                    <img
                                        src="/assets/icons/arrowleft.svg"
                                        alt="calendar icon"
                                        className="select-icon"
                                    />
                                )}
                            </Theme.NavigationButton>
                        </div>

                        <Theme.MonthSelectWrapper>
                            <Theme.MonthSelect
                                value={currentDate.getMonth()}
                                onChange={handleMonthChange}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(currentDate.getFullYear(), i, 1).toLocaleString(
                                            lang === 'ar' ? 'ar-EG' : 'en-US',
                                            { month: 'long' },
                                        )}
                                    </option>
                                ))}
                            </Theme.MonthSelect>
                            <img
                                src="/assets/icons/menu/pick-date.svg"
                                alt="calendar icon"
                                className="select-icon"
                            />
                        </Theme.MonthSelectWrapper>
                    </div>
                </div>
                <div ref={timelineRef} />
            </Theme.TimelineWrapper>
        </Theme.Body>
    );
};
