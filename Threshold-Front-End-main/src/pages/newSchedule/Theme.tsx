import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div`
    margin: 40px 32px;
`;
export const TimelineWrapper = styled.div`
    .vis-timeline {
        border: none;
        font-family: inherit;
    }

    .vis-item {
        border-radius: 4px;
        border-color: transparent;

        &.session-item {
            background-color: rgba(255, 255, 255, 1);
            color: rgba(32, 36, 3, 0.6);
        }
    }

    .vis-time-axis .vis-text {
        color: #666;
    }

    .vis-panel.vis-center {
        border-left: 1px solid #ddd;
    }

    .vis-group-level-0 {
        rotate: 90deg;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #c0d330;
        border: none;
    }

    .vis-inner {
        background-color: rgba(192, 211, 48, 0.08);
        white-space: nowrap;
        padding: 8px;
        font-size: 14px;
        font-weight: 600;
    }

    .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #ddd;
    }

    .timeline-navigation {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    .vis-item .vis-item-content {
        padding: 8px;
        width: 100%;
    }

    .vis-item .vis-item-content div div div:first-child {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .vis-item .vis-item-content div div:nth-child(2) {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .vis-item .vis-item-content div div:nth-child(3) {
        display: flex;
        justify-content: space-between;
    }

    .vis-item .vis-item-content div div div:first-child p:nth-of-type(1) {
        color: rgba(192, 211, 48, 1);
        font-size: 14px;
        font-weight: 500;
    }

    .vis-item .vis-item-content div div div:first-child p:nth-of-type(2) {
        font-size: 20px;
        color: rgba(32, 36, 3, 0.3);
    }

    .vis-item .vis-item-content div div:nth-child(3) div:first-child {
        padding: 3px 0px;
        border-radius: 8px;
        color: rgba(192, 211, 48, 1);
    }
    .vis-item .vis-item-content div div:nth-child(4) {
        display: flex;
        justify-content: space-between;
    }
    .vis-item .vis-item-content div div:nth-child(4) div:nth-child(1) {
        color: rgba(220, 37, 159, 1);
    }
    .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding: 0 16px;
    }

    .filters-section {
        display: flex;
        align-items: center;
        gap: 12px;

        span {
            color: #667085;
            font-weight: 500;
        }
    }

    .navigation-section {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .day-navigation {
        display: flex;
        gap: 8px;
    }
`;

export const NavigationButton = styled.button`
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    &:hover {
        background: #f5f5f5;
    }
`;

export const DateDisplay = styled.div`
    font-size: 16px;
    font-weight: 500;
`;

export const FilterButton = styled.button<{ active: boolean }>`
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid ${({ active }) => (active ? 'rgba(219, 221, 208, 1)' : 'transparent')};
    background: ${({ active }) => (active ? 'rgba(255, 255, 255, 1)' : 'transparent')};
    color: ${({ active }) => (active ? 'rgba(78, 94, 65, 1)' : 'rgba(78, 94, 65, 1)')};
    cursor: pointer;
    font-weight: 500;
`;

export const MonthSelectWrapper = styled.div`
    position: relative;
    display: flex;
    position: relative;
    display: inline-block;
    display: flex;
    background-color: white;
    padding: 10px 16px;
    color: rgba(32, 36, 3, 0.3);
    border-radius: 8px;
    border: 1px solid rgba(219, 221, 208, 1);
`;

export const MonthSelect = styled.select`
    appearance: none;
    cursor: pointer;
    outline: none;
    .select-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        width: 16px;
        height: 16px;
    }
`;
