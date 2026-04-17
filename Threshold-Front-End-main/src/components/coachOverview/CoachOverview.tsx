import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { PerformanceChart } from './PerformanceChart';
import { format, addMonths, subMonths } from 'date-fns';
import { MissionProgress } from './MissionProgress';

export const CoachOverview = () => {
    const [activeTab, setActiveTab] = useState('chart-1');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { trans } = useLocales();

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
        // Here you can also fetch new data for the chart based on the new date
    };

    const missionData = {
        currentValue: 3,
        maxValue: 4,
        dateRange: '8 Jan ... 15 Jan',
        sessions: [
            { name: 'Session Name 1', progress: 400, total: 400 },
            { name: 'Session Name 2', progress: 400, total: 400 },
            { name: 'Session Name 3', progress: 400, total: 400 },
            { name: 'Session Name 4', progress: 0, total: 400 },
            { name: 'Session Name 5', progress: 0, total: 400 },
            { name: 'Session Name 6', progress: 0, total: 400 },
        ],
    };

    return (
        <Theme.Body>
            <Theme.HeaderWrapper>
                <Theme.CardsWrapper>
                    <Theme.Card>
                        <Theme.FlexWrapper>
                            <Theme.FlexColumnWrapper>
                                <Theme.CardTitle>Total Players</Theme.CardTitle>
                                <Theme.CardCount>125</Theme.CardCount>
                            </Theme.FlexColumnWrapper>
                            <Theme.CardIconWrapper>
                                <img src="/assets/icons/cards/player-card.svg" alt="Players icon" />
                            </Theme.CardIconWrapper>
                        </Theme.FlexWrapper>
                        <Theme.CardTail>
                            <p>Categories: 2</p>
                            <>
                                <p>Positions: 6</p>
                                <p>Levels: 3</p>
                            </>
                        </Theme.CardTail>
                    </Theme.Card>
                    <Theme.Card>
                        <Theme.FlexWrapper>
                            <Theme.FlexColumnWrapper>
                                <Theme.CardTitle>Total Sessions - 2024</Theme.CardTitle>
                                <Theme.CardCount>82</Theme.CardCount>
                            </Theme.FlexColumnWrapper>
                            <Theme.CardIconWrapper>
                                <img
                                    src="/assets/icons/cards/sessions-card.svg"
                                    alt="Players icon"
                                />
                            </Theme.CardIconWrapper>
                        </Theme.FlexWrapper>
                        <Theme.CardTail>
                            <p>Age: 12 - 20</p>
                            <>
                                <p>+2 Monthly Regular</p>
                            </>
                        </Theme.CardTail>
                    </Theme.Card>
                    <Theme.Card>
                        <Theme.FlexWrapper>
                            <Theme.FlexColumnWrapper>
                                <Theme.CardTitle>Assistants</Theme.CardTitle>
                                <Theme.CardCount>2</Theme.CardCount>
                            </Theme.FlexColumnWrapper>
                            <Theme.CardIconWrapper>
                                <img
                                    src="/assets/icons/cards/assistants-card.svg"
                                    alt="Players icon"
                                />
                            </Theme.CardIconWrapper>
                        </Theme.FlexWrapper>
                        <Theme.CardTail>
                            <p>Medical Team: 5</p>
                            <p>Support Team: 4</p>
                        </Theme.CardTail>
                    </Theme.Card>
                </Theme.CardsWrapper>
            </Theme.HeaderWrapper>
            <Theme.ChartsSectionWrapper>
                <Theme.TabsWrapper>
                    <Theme.Tabs
                        className={activeTab === 'chart-1' ? 'active' : ''}
                        onClick={() => setActiveTab('chart-1')}
                    >
                        {trans('chart-1')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'chart-2' ? 'active' : ''}
                        onClick={() => setActiveTab('chart-2')}
                    >
                        {trans('chart-2')}
                    </Theme.Tabs>
                </Theme.TabsWrapper>
                <Theme.TabContent>
                    {activeTab === 'chart-1' && (
                        <>
                            <PerformanceChart
                                chartType="chart-1"
                                selectedDate={selectedDate}
                                onDateChange={handleDateChange}
                            />
                            <MissionProgress {...missionData} />
                        </>
                    )}
                    {activeTab === 'chart-2' && <p>Lorem ipsum dolor sit consectetur . , quos.</p>}
                </Theme.TabContent>
            </Theme.ChartsSectionWrapper>
        </Theme.Body>
    );
};
