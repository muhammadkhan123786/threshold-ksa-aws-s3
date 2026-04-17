import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    RadialLinearScale,
    Filler,
} from 'chart.js';
import { useLocales } from 'hooks/locales';
import { BATTERY_DATE_THRESHOLD } from 'libs/constants';
import { AthleteFitnessBattery } from 'libs/types';
import { Radar } from 'react-chartjs-2';
import styled from 'styled-components';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    Filler,
);

interface Props {
    batteryData: AthleteFitnessBattery[];
}

const FitnessBatteryChart = ({ batteryData }: Props) => {
    const { trans } = useLocales();
    const getIndividualAverageRating = (batteryData: AthleteFitnessBattery[]): number[] =>
        !batteryData
            ? []
            : batteryData
                  .reduce(
                      (acc, cur) => {
                          return [
                              acc[0] + Number(cur.curl),
                              acc[1] + Number(cur.push),
                              acc[2] + Number(cur.trunk),
                              acc[3] + Number(cur.sit),
                              acc[4] + Number(cur.pacer),
                          ];
                      },
                      [0, 0, 0, 0, 0] as number[],
                  )
                  .map((num) => num / batteryData.length);

    const averageRatingData = {
        label: trans('chart.averageRating'),
        data: getIndividualAverageRating(batteryData),
        borderColor: '#28b5e1',
        backgroundColor: '#28b5e122',
    };

    const lastRecordData = {
        label: trans('chart.lastRecord'),
        data:
            batteryData && batteryData.length > 0
                ? [
                      Number(batteryData[0].curl),
                      Number(batteryData[0].push),
                      Number(batteryData[0].trunk),
                      Number(batteryData[0].sit),
                      Number(batteryData[0].pacer),
                  ]
                : [0, 0, 0, 0, 0],
        borderColor: '#b0cd2f',
        backgroundColor: '#d6f15e32',
    };

    const minimumRange = {
        label: trans('chart.minimum'),
        data: BATTERY_DATE_THRESHOLD,
        borderColor: '#c96363',
        backgroundColor: '#c9636322',
    };

    const chartOptions = {
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    display: false,
                },
            },
        },
        datasets: {
            radar: {
                pointBorderColor: 'transparent',
                fill: true,
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'black',
                },
            },
        },
    };

    const Wrapper = styled.div.attrs({
        className: 'px-[20px] mx-auto',
    })`
        height: 400px;
        width: 400px;
        padding: 20px;
        align-self: center;
        width: 80%;
        border-radius: 12px;
        background-color: #fff;
        justify-content: center;
        display: flex;

        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        @media (max-width: 768px) {
            height: auto;
            width: auto;
        }
    `;
    return (
        <Wrapper>
            <Radar
                data={{
                    labels: [
                        trans('chart.curlUp'),
                        trans('chart.pushUp'),
                        trans('chart.trunkLift'),
                        trans('chart.sitAndReach'),
                        trans('chart.pacer'),
                    ],
                    datasets: [minimumRange, averageRatingData, lastRecordData],
                }}
                options={{
                    ...chartOptions,
                    maintainAspectRatio: true, // Disable aspect ratio to allow dynamic resizing
                    responsive: true, // Ensure the chart resizes with its container
                }}
                style={{
                    width: '100%',
                    height: 'auto', // Make sure height is auto to adjust with content
                }}
            />
        </Wrapper>
    );
};

export default FitnessBatteryChart;
