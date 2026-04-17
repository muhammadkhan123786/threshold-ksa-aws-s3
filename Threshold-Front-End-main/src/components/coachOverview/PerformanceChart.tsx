import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subMonths, addMonths } from 'date-fns';
import * as Theme from './Theme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface PerformanceChartProps {
    chartType: 'chart-1' | 'chart-2';
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

type FilterType =
    | 'all-sessions'
    | 'all-templates'
    | 'fitness-battery'
    | 'football-1'
    | 'football-2';
type TimeframeType = 'daily' | 'weekly' | 'monthly';

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
    selectedDate,
    onDateChange,
}) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all-templates');
    const [timeframe, setTimeframe] = useState<TimeframeType>('weekly');

    // Mock data array with more entries
    const chartData = [
        // All Sessions
        { id: 1, value: 7, date: '2024-01-01', category: 'all-sessions', timeframe: 'daily' },
        { id: 2, value: 6, date: '2024-01-02', category: 'all-sessions', timeframe: 'daily' },
        { id: 3, value: 8, date: '2024-01-03', category: 'all-sessions', timeframe: 'daily' },
        { id: 4, value: 5, date: '2024-01-04', category: 'all-sessions', timeframe: 'daily' },
        { id: 5, value: 7, date: 'W1', category: 'all-sessions', timeframe: 'weekly' },
        { id: 6, value: 6, date: 'W2', category: 'all-sessions', timeframe: 'weekly' },
        { id: 7, value: 8, date: 'W3', category: 'all-sessions', timeframe: 'weekly' },
        { id: 8, value: 7, date: 'Jan', category: 'all-sessions', timeframe: 'monthly' },

        // All Templates
        { id: 9, value: 5, date: '2024-01-01', category: 'all-templates', timeframe: 'daily' },
        { id: 10, value: 7, date: '2024-01-02', category: 'all-templates', timeframe: 'daily' },
        { id: 11, value: 6, date: '2024-01-03', category: 'all-templates', timeframe: 'daily' },
        { id: 12, value: 8, date: '2024-01-04', category: 'all-templates', timeframe: 'daily' },
        { id: 13, value: 6, date: 'W1', category: 'all-templates', timeframe: 'weekly' },
        { id: 14, value: 7, date: 'W2', category: 'all-templates', timeframe: 'weekly' },
        { id: 15, value: 5, date: 'W3', category: 'all-templates', timeframe: 'weekly' },
        { id: 16, value: 8, date: 'Jan', category: 'all-templates', timeframe: 'monthly' },

        // Fitness Battery
        { id: 17, value: 4, date: '2024-01-01', category: 'fitness-battery', timeframe: 'daily' },
        { id: 18, value: 6, date: '2024-01-02', category: 'fitness-battery', timeframe: 'daily' },
        { id: 19, value: 7, date: '2024-01-03', category: 'fitness-battery', timeframe: 'daily' },
        { id: 20, value: 5, date: '2024-01-04', category: 'fitness-battery', timeframe: 'daily' },
        { id: 21, value: 8, date: 'W1', category: 'fitness-battery', timeframe: 'weekly' },
        { id: 22, value: 6, date: 'W2', category: 'fitness-battery', timeframe: 'weekly' },
        { id: 23, value: 7, date: 'W3', category: 'fitness-battery', timeframe: 'weekly' },
        { id: 24, value: 6, date: 'Jan', category: 'fitness-battery', timeframe: 'monthly' },

        // Football 1
        { id: 25, value: 7, date: '2024-01-01', category: 'football-1', timeframe: 'daily' },
        { id: 26, value: 8, date: '2024-01-02', category: 'football-1', timeframe: 'daily' },
        { id: 27, value: 6, date: '2024-01-03', category: 'football-1', timeframe: 'daily' },
        { id: 28, value: 7, date: '2024-01-04', category: 'football-1', timeframe: 'daily' },
        { id: 29, value: 5, date: 'W1', category: 'football-1', timeframe: 'weekly' },
        { id: 30, value: 7, date: 'W2', category: 'football-1', timeframe: 'weekly' },
        { id: 31, value: 8, date: 'W3', category: 'football-1', timeframe: 'weekly' },
        { id: 32, value: 7, date: 'Jan', category: 'football-1', timeframe: 'monthly' },

        // Football 2
        { id: 33, value: 6, date: '2024-01-01', category: 'football-2', timeframe: 'daily' },
        { id: 34, value: 7, date: '2024-01-02', category: 'football-2', timeframe: 'daily' },
        { id: 35, value: 8, date: '2024-01-03', category: 'football-2', timeframe: 'daily' },
        { id: 36, value: 6, date: '2024-01-04', category: 'football-2', timeframe: 'daily' },
        { id: 37, value: 7, date: 'W1', category: 'football-2', timeframe: 'weekly' },
        { id: 38, value: 8, date: 'W2', category: 'football-2', timeframe: 'weekly' },
        { id: 39, value: 6, date: 'W3', category: 'football-2', timeframe: 'weekly' },
        { id: 40, value: 7, date: 'Jan', category: 'football-2', timeframe: 'monthly' },
    ];

    // Update the filter to include timeframe
    const filteredData = chartData.filter(
        (item) => item.category === activeFilter && item.timeframe === timeframe,
    );

    const data = {
        labels: filteredData.map((item) => item.date),
        datasets: [
            {
                data: filteredData.map((item) => item.value),
                backgroundColor: '#C1E1A7',
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    useEffect(() => {
        // Update chart data when selectedDate changes
        // updateChartData(selectedDate);
    }, [selectedDate]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `Value: ${context.parsed.y}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 8,
                ticks: {
                    stepSize: 2,
                },
                grid: {
                    display: true,
                    drawBorder: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const handleDateChange = (direction: 'prev' | 'next') => {
        const newDate =
            direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1);
        onDateChange(newDate);
    };

    return (
        <Theme.Container>
            <Theme.ControlsContainer>
                <Theme.FilterButtonsContainer>
                    <Theme.FilterButton
                        isActive={activeFilter === 'all-sessions'}
                        onClick={() => setActiveFilter('all-sessions')}
                    >
                        All Sessions
                    </Theme.FilterButton>
                    <Theme.FilterButton
                        isActive={activeFilter === 'all-templates'}
                        onClick={() => setActiveFilter('all-templates')}
                    >
                        All Templates
                    </Theme.FilterButton>
                    <Theme.FilterButton
                        isActive={activeFilter === 'fitness-battery'}
                        onClick={() => setActiveFilter('fitness-battery')}
                    >
                        Fitness Battery
                    </Theme.FilterButton>
                    <Theme.FilterButton
                        isActive={activeFilter === 'football-1'}
                        onClick={() => setActiveFilter('football-1')}
                    >
                        Football 1
                    </Theme.FilterButton>
                    <Theme.FilterButton
                        isActive={activeFilter === 'football-2'}
                        onClick={() => setActiveFilter('football-2')}
                    >
                        Football 2
                    </Theme.FilterButton>
                </Theme.FilterButtonsContainer>

                <Theme.DateTimeControls>
                    <Theme.DateNavigator>
                        <Theme.ArrowButton onClick={() => handleDateChange('prev')}>
                            ‹
                        </Theme.ArrowButton>
                        <Theme.DateText>Starts: {format(selectedDate, 'd MMM')}</Theme.DateText>
                        <Theme.ArrowButton onClick={() => handleDateChange('next')}>
                            ›
                        </Theme.ArrowButton>
                    </Theme.DateNavigator>
                    <Theme.TimeframeContainer>
                        <Theme.FilterButton
                            isActive={timeframe === 'daily'}
                            onClick={() => setTimeframe('daily')}
                        >
                            Daily
                        </Theme.FilterButton>
                        <Theme.FilterButton
                            isActive={timeframe === 'weekly'}
                            onClick={() => setTimeframe('weekly')}
                        >
                            Weekly
                        </Theme.FilterButton>
                        <Theme.FilterButton
                            isActive={timeframe === 'monthly'}
                            onClick={() => setTimeframe('monthly')}
                        >
                            Monthly
                        </Theme.FilterButton>
                    </Theme.TimeframeContainer>
                </Theme.DateTimeControls>
            </Theme.ControlsContainer>

            <Theme.ChartContainer>
                <Bar
                    options={{
                        ...options,
                        maintainAspectRatio: false,
                        responsive: true,
                    }}
                    data={data}
                />
            </Theme.ChartContainer>
        </Theme.Container>
    );
};
