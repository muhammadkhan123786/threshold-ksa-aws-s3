import { SharedButton } from 'components/sharedButton';
import { Calendar } from 'react-big-calendar';
import styled from 'styled-components';

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    category: 'Matches' | 'Sessions' | 'Finished Contract' | 'Holidays';
    time?: string;
}
const categoryColors = {
    Matches: 'rgba(47, 164, 228, 1)',
    Sessions: 'rgba(192, 211, 48, 1)',
    'Finished Contract': 'rgba(238, 2, 14, 1)',
    Holidays: 'rgba(176, 137, 67, 1)',
};

export const Body = styled.div`
    border: 1px solid red;
`;
export const StyledCalendar = styled(Calendar<CalendarEvent>)`
    .rbc-header {
        padding: 10px;
        font-weight: normal;
        text-align: center;
        border-bottom: none;
    }

    .rbc-month-view {
        border: none;
    }

    .rbc-day-bg {
        border: 1px solid #eaeaea;
        min-height: 120px;
    }

    .rbc-date-cell {
        padding: 4px;
        text-align: left;
        font-size: 14px;
    }

    .rbc-event {
        color: #000;
        border: none;
        border-radius: 4px;
        padding: 2px 5px;
        margin: 1px 0;
        font-size: 12px;
        cursor: pointer;
    }

    .rbc-event-content {
        font-size: 12px;
    }

    .rbc-today {
        background-color: transparent;
    }

    .rbc-off-range-bg {
        background-color: transparent;
    }

    .rbc-row-segment {
        padding: 0 1px;
    }

    .rbc-show-more {
        background-color: transparent;
        color: #666;
        font-size: 12px;
    }

    .rbc-header {
        text-transform: uppercase;
        font-size: 12px;
        color: #666;
    }

    .rbc-date-cell {
        font-size: 12px;
        color: #666;
    }

    .rbc-toolbar {
        .rbc-btn-group:first-of-type {
            display: none;
        }
    }
`;

export const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
    }
`;

export const NavigationHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
    }
`;
export const DayEventsPanel = styled.div`
    width: 300px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 16px;
    height: fit-content;
`;

export const DayHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

export const DateBadge = styled.div`
    background: #4a4a4a;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
`;

export const FilterButton = styled.button<{ isActive?: boolean }>`
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(78, 94, 65, 1);
    background: ${(props) => (props.isActive ? '#fff' : 'transparent')};
    border-radius: 8px;
    border: ${(props) =>
        props.isActive ? '1px solid rgba(219, 221, 208, 1)' : '1px solid transparent'};
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: visible;

    @media (max-width: 768px) {
        flex: 0 1 auto;
        min-width: calc(33.33% - 8px);
        padding: 8px;
    }
    @media (max-width: 480px) {
        min-width: calc(50% - 8px);
    }
`;

export const CreateEventButton = styled(SharedButton)`
    background: #bed62f;
    color: #000;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 0;
    }
`;

export const EventItem = styled.div<{ category: keyof typeof categoryColors }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    margin: 4px 0;
    border-left: 4px solid ${(props) => categoryColors[props.category]};
    background: rgba(0, 0, 0, 0.02);
`;
export const CalendarContainer = styled.div`
    display: flex;
    gap: 24px;
    position: relative;
`;
export const MonthSpan = styled.span`
    font-size: 20px;
    font-weight: 600;
    color: rgba(20, 20, 0, 1);
`;

export const YearSpan = styled.span`
    font-size: 20px;
    font-weight: 500;
    color: rgba(20, 20, 0, 1);
`;

export const ArrowButton = styled.button<{ rtl?: boolean }>`
    font-size: 24px;
    padding: 0 8px;
    font-weight: 500;
    color: rgba(20, 20, 0, 1);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    &:first-of-type {
        transform: ${({ rtl }) => (!rtl ? 'none' : 'rotate(180deg)')};
    }

    &:last-of-type {
        transform: ${({ rtl }) => (!rtl ? 'none' : 'rotate(180deg)')};
    }
`;
export const FilterContainer = styled.div`
    display: flex;
    gap: 8px;
    border: 1px solid rgba(219, 221, 208, 1);
    border-radius: 8px;
    padding: 4px;

    @media (max-width: 768px) {
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
    }
`;
export const FilterSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        gap: 16px;
    }
`;
export const SportProfileOverviewContainer = styled.div`
    padding: 16px; // p-4 equals 16px
    position: relative;
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    color: #666;
    font-size: 24px;
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: #333;
    }
`;
export const NoteSection = styled.div`
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eaeaea;
`;

export const NoteHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
    color: rgba(20, 20, 0, 1);
    margin-bottom: 8px;
`;

export const NoteList = styled.ul`
    list-style-type: disc;
    margin-left: 16px;
    color: #666;
    font-size: 14px;
`;

export const NoteItem = styled.li`
    margin-bottom: 4px;
`;
