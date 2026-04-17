import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useState } from 'react';
import styled from 'styled-components';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { router } from 'routers';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const Body = styled.div`
    width: 100%;
    padding: 16px;
    @media (max-width: 768px) {
        padding: 8px;
    }
`;

export const HeaderWrapper = styled.div`
    display: flex;
    gap: 24px;
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

export const ChartWrapper = styled.div`
    display: flex;
    gap: 24px;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const LabelWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
`;

export const CardsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const EvenWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
`;

export const ChartSection = styled.div`
    margin-top: 24px;
`;

export const ChartContainer = styled.div`
    width: 100%;
    height: 300px;
    @media (max-width: 768px) {
        height: 250px;
    }
`;

export const TeamsFilterWrapper = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

export const AdministratorOverview = () => {
    const { trans } = useLocales();
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    const data = [1, 4, 6, 14, 19];
    const labels = ['technicalDirector', 'administrator', 'medicalTeam', 'coach', 'subCoach'];
    const colors = ['#C6D851', '#CCDD6A', '#D2E180', '#D8E694', '#DEEAA7'];
    const [selectedTeam, setSelectedTeam] = useState<'all' | 1 | 2 | 3>('all');
    const dataDoughnut = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff',
                spacing: 5,
            },
        ],
    };

    // Plugin to display total in center
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart: any) => {
            const { ctx, width } = chart;
            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0]?.x;
            const yCoor = chart.getDatasetMeta(0).data[0]?.y;

            if (xCoor && yCoor) {
                // Responsive font sizes based on chart width
                const totalFontSize = Math.min(18, width / 15);
                const labelFontSize = Math.min(14, width / 20);

                ctx.font = `700 ${totalFontSize}px sans-serif`;
                ctx.fillStyle = '#20240399';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('44', xCoor, yCoor - totalFontSize);

                ctx.font = `${labelFontSize}px sans-serif`;
                ctx.fillText(trans('labels.overview.totalEmployees'), xCoor, yCoor + labelFontSize);
            }
        },
    };

    // Sample data for the bar chart
    const barChartData = {
        labels: ['4 Jan', '8 Jan', '12 Jan', '16 Jan', '20 Jan', '24 Jan', '28 Jan'],
        datasets: [
            {
                label: 'Team 1',
                data: [3, 2, 4, 3, 5, 2, 4],
                backgroundColor: 'rgba(115, 151, 242, 0.1)',
                borderColor: 'rgba(115, 151, 242, 1)',
                borderWidth: 2,
                borderRadius: 4,
            },
            {
                label: 'Team 2',
                data: [2, 3, 2, 4, 3, 5, 3],
                backgroundColor: 'rgba(253, 188, 110, 0.1)',
                borderColor: 'rgba(253, 188, 110, 1)',
                borderWidth: 2,
                borderRadius: 4,
            },
            {
                label: 'Team 3',
                data: [4, 1, 3, 2, 4, 3, 5],
                backgroundColor: 'rgba(97, 205, 227, 0.1)',
                borderColor: 'rgba(97, 205, 227, 1)',
                borderWidth: 2,
                borderRadius: 4,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#E5E7EB',
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const breadcrumbs = filteredSport
        ? [{ label: `${trans('menu.overview')} ${trans(`sport.${filteredSport.sport}`)}` }]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    return (
        <Theme.Body>
            <Theme.HeaderWrapper>
                <Theme.ChartWrapper>
                    <Theme.LabelWrapper>
                        {labels.map((label, index) => (
                            <Theme.LegendCard key={label}>
                                <Theme.ColorIndicator color={colors[index]} />
                                <Theme.TitleWrapper>
                                    <Theme.Count>{data[index]}</Theme.Count>
                                    <Theme.Label>{trans(`labels.overview.${label}`)}</Theme.Label>
                                </Theme.TitleWrapper>
                            </Theme.LegendCard>
                        ))}
                    </Theme.LabelWrapper>
                    <Theme.Chart>
                        <Doughnut
                            data={dataDoughnut}
                            options={{
                                cutout: '70%',
                                plugins: {
                                    legend: { display: false },
                                    tooltip: { enabled: false },
                                },
                                maintainAspectRatio: false,
                                responsive: true,
                            }}
                            plugins={[centerTextPlugin]}
                        />
                    </Theme.Chart>
                </Theme.ChartWrapper>
                <Theme.CardsWrapper>
                    <Theme.EvenWrapper>
                        <Theme.Card>
                            <Theme.FlexWrapper>
                                <Theme.FlexColumnWrapper>
                                    <Theme.CardTitle>Total Players</Theme.CardTitle>
                                    <Theme.CardCount>125</Theme.CardCount>
                                </Theme.FlexColumnWrapper>
                                <Theme.CardIconWrapper>
                                    <img
                                        src="/assets/icons/cards/player-card.svg"
                                        alt="Players icon"
                                    />
                                </Theme.CardIconWrapper>
                            </Theme.FlexWrapper>
                            <Theme.CardTail>
                                <p>120 Active</p>
                                <>
                                    <p>Almost: 1</p>
                                    <p>Not Active: 4</p>
                                </>
                            </Theme.CardTail>
                        </Theme.Card>
                        <Theme.Card>
                            <Theme.FlexWrapper>
                                <Theme.FlexColumnWrapper>
                                    <Theme.CardTitle>Total Teams</Theme.CardTitle>
                                    <Theme.CardCount>3</Theme.CardCount>
                                </Theme.FlexColumnWrapper>
                                <Theme.CardIconWrapper>
                                    <img
                                        src="/assets/icons/cards/teams-card.svg"
                                        alt="Players icon"
                                    />
                                </Theme.CardIconWrapper>
                            </Theme.FlexWrapper>
                            <Theme.CardTail>
                                <p>Age: 12 - 20</p>
                                <>
                                    <p>Positions: 6</p>
                                    <p>Levels: 3</p>
                                </>
                            </Theme.CardTail>
                        </Theme.Card>
                    </Theme.EvenWrapper>
                    <Theme.EvenWrapper>
                        <Theme.Card>
                            <Theme.FlexWrapper>
                                <Theme.FlexColumnWrapper>
                                    <Theme.CardTitle>Week Sessions</Theme.CardTitle>
                                    <>
                                        <Theme.CardCount>21</Theme.CardCount>
                                        <Theme.CardTitle>6 left</Theme.CardTitle>
                                    </>
                                </Theme.FlexColumnWrapper>
                                <Theme.CardIconWrapper>
                                    <img
                                        src="/assets/icons/cards/sessions-card.svg"
                                        alt="Players icon"
                                    />
                                </Theme.CardIconWrapper>
                            </Theme.FlexWrapper>
                            <Theme.CardTail>
                                <p>Templates: 5</p>
                                <p>+2 Monthly Regular</p>
                            </Theme.CardTail>
                        </Theme.Card>
                        <Theme.Card>
                            <Theme.FlexWrapper>
                                <Theme.FlexColumnWrapper>
                                    <Theme.CardTitle>Week Commitment</Theme.CardTitle>
                                    <Theme.CardCount>94%</Theme.CardCount>
                                </Theme.FlexColumnWrapper>
                                <Theme.CardIconWrapper>
                                    <img
                                        src="/assets/icons/cards/commitment-card.svg"
                                        alt="Players icon"
                                    />
                                </Theme.CardIconWrapper>
                            </Theme.FlexWrapper>
                            <Theme.CardTail>
                                <>
                                    <p>+11%</p>
                                    <p>vs last week</p>
                                </>
                                <p>W-Sessions: 5/7</p>
                            </Theme.CardTail>
                        </Theme.Card>
                    </Theme.EvenWrapper>
                </Theme.CardsWrapper>
            </Theme.HeaderWrapper>
            {/* New Bar Chart Section with styled-components */}
            <Theme.ChartSection>
                <Theme.ChartHeader>
                    <Theme.ChartTitle>January Sub-Goal (sessions per missions)</Theme.ChartTitle>
                    <Theme.TeamsFilterWrapper>
                        <Theme.TeamButton
                            isActive={selectedTeam === 'all'}
                            onClick={() => setSelectedTeam('all')}
                        >
                            All
                        </Theme.TeamButton>
                        <Theme.TeamButton
                            isActive={selectedTeam === 1}
                            onClick={() => setSelectedTeam(1)}
                        >
                            Team 1
                        </Theme.TeamButton>
                        <Theme.TeamButton
                            isActive={selectedTeam === 2}
                            onClick={() => setSelectedTeam(2)}
                        >
                            Team 2
                        </Theme.TeamButton>
                        <Theme.TeamButton
                            isActive={selectedTeam === 3}
                            onClick={() => setSelectedTeam(3)}
                        >
                            Team 3
                        </Theme.TeamButton>
                    </Theme.TeamsFilterWrapper>
                </Theme.ChartHeader>

                <Theme.ChartContainer>
                    <Bar
                        data={{
                            ...barChartData,
                            datasets: barChartData.datasets.filter(
                                (dataset, index) =>
                                    selectedTeam === 'all' || selectedTeam === index + 1,
                            ),
                        }}
                        options={barChartOptions}
                    />
                </Theme.ChartContainer>
            </Theme.ChartSection>
        </Theme.Body>
    );
};
