import React, { useEffect, useState } from 'react';
import { useRouter } from 'react-router5';

import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useSelector } from 'react-redux';
import { selectAcademy, selectControls } from 'store';
import { useGetAthleteBio } from 'hooks/data';
import { stringToDateString } from 'libs/helpers';
import { useGetAthleteBattery } from 'hooks/data';
import FitnessBatteryChart from 'components/tables/FitnessBatteryChart';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    Filler,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    Filler,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
);
import { Bar } from 'react-chartjs-2';
import {
    useFetchFitnessDataById,
    useFetchHealthRecordsById,
    useFetchMedicalInfoById,
} from 'services/hooks';
import moment from 'moment';
import { calculateYearsDifference } from 'libs/helpers/athleteHelpers';
import { TemplatesTablePlayersDetails } from 'components/templatesTablePlayersDetails';
import { useFetchAthleteDetailsById } from 'services/hooks/players/useFetchAthleteDetailsById';
import { EditPlayerBankData } from 'components/playerModals/bankDataModal';
import { EditPlayerContact } from 'components/playerModals/contactModal';
import { EditPlayerPersonalInformation } from 'components/playerModals/personalInformationModal';
import { EditMedicalInformation } from 'components/playerModals/medicalInformationModal';
import { EditClothes } from 'components/playerModals/clothesModal';
import { TemplatesTablePlayersSession } from 'components/templatesTablePlayersSession';
import { TemplatesTablePlayerCompositionRecords } from 'components/templatesTablePlayerCompositionRecords';
import { MedicalInfoModal } from 'components/playerModals/medicalInfoForm';
import { AddFitnessBatteryModal } from 'components/playerModals/fitnessBatteryModal';
import { AddAthleteBiometrics } from 'components/playerModals/playerBiometricsModal';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { PlayersInfo } from 'components/playersInfo';
import { EmptyDOCS } from 'components';
import DocumentCard from 'components/documentsCard/DocumentCard';
import { Divider } from 'components/modal-windows';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { AvatarImage } from 'components/avatarImage';
import { EditPlayerContract } from 'components/playerModals/contractModal/EditPlayerContract';
import { AddNewDocumentFile } from 'components/playerModals/addNewDocumentFile';
import { useFetchPlayerDocumentsById } from 'services/hooks/players/useFetchDocumentsById';
import { useFetchPlayerBatteries } from 'services/hooks/players/useFetchPlayerBatteries';
import { useFetchBodyComposition } from 'services/hooks/players/useFetchBodyComposition';
import { useFetchPlayerContractDetails } from 'services/hooks/players/useFetchPlayerContractDetails';
const testTypes = ['push', 'curl', 'trunk', 'sit', 'pacer', 'all'] as const;
type TestType = (typeof testTypes)[number];

interface FitnessDataRecord {
    date: string;
    value: number;
    testType: string;
    id: number;
}

interface AllFitnessDataRecord {
    date: string;
    pacer?: string;
    sit?: string;
    trunk?: string;
    push?: string;
    curl?: string;
    id: number;
}
export const PlayersDetails = () => {
    const { isRTL, trans } = useLocales();
    const router = useRouter();
    const [columns, setColumns] = useState<any>();
    const [columnsTwo, setColumnsTwo] = useState<any>();
    const { academy } = useSelector(selectAcademy);
    const [activeTab, setActiveTab] = useState('profile');
    const [isModalOpenBankData, setIsModalOpenBankData] = useState(false);
    const [isModalOpenContact, setIsModalOpenContact] = useState(false);
    const [isModalOpenContract, setIsModalOpenContract] = useState(false);
    const [isModalOpenPersonalInformation, setIsModalOpenPersonalInformation] = useState(false);
    const [isModalOpenMedicalInformation, setIsModalOpenMedicalInformation] = useState(false);
    const [isModalOpenClothes, setIsModalOpenClothes] = useState(false);
    const [isModalOpenMedicalInfoModal, setIsModalOpenMedicalInfoModal] = useState(false);
    const [isModalOpenAddNewDocumentFile, setIsModalOpenAddNewDocumentFile] = useState(false);
    const [isModalOpenFitnessBatteryModa, setIsModalOpenFitnessBatteryModa] = useState(false);
    const [isModalOpenAthleteBiometrics, setIsModalOpenAthleteBiometrics] = useState(false);
    const [selectedTestType, setSelectedTestType] = useState<TestType>('all');
    const [startDate, setStartDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), 0, 2),
    );
    const [endDateFitnnes, setEndDate] = useState<Date | undefined>(new Date());
    const [interval, setInterval] = useState<string>('1 day');
    const {
        params: { sportId, id },
    } = router.getState();
    const { data } = useClubList(academy?.id);
    const filteredSport: any = data?.payload?.find((club) => club?.id === sportId);
    const {
        data: athleteDetails,
        isLoading: isLoadingDetails,
        error: athleteDetailsError,
        refetch: refetchathleteDetails,
    } = useFetchAthleteDetailsById(id);

    const {
        data: athleteHealthRecords,
        isLoading: isLoadingHealthRecords,
        error: athleteHealthRecordsError,
        refetch: refetchAthleteHealthRecords,
    } = useFetchHealthRecordsById(id);
    const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setInterval(event.target.value);
    };
    const handleTestTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTestType(event.target.value as TestType);
    };
    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setStartDate(undefined); // Handle empty value
        } else {
            setStartDate(new Date(value));
        }
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setEndDate(undefined); // Handle empty value
        } else {
            setEndDate(new Date(value));
        }
    };
    const {
        data: fitnessDataRecords,
        isLoading: isLoadingFitnessData,
        error: fitnessDataError,
        refetch: refetchFitnessData,
    } = useFetchFitnessDataById(id, selectedTestType, interval, startDate, endDateFitnnes);
    const {
        data: athleteMedicalInfo,
        isLoading: isLoadingMedicalInfo,
        error: athleteMedicalInfoError,
        refetch: refetchAthleteMedicalInfo,
    } = useFetchMedicalInfoById(id);
    const {
        data: documents,
        isLoading: documentsLoading,
        error: documentsError,
    } = useFetchPlayerDocumentsById(id);
    const {
        data: playerBatteries,
        isLoading: isPlayerBatteriesLoading,
        error: playerBatteriesError,
    } = useFetchPlayerBatteries(id);

    const {
        data: bodyComposition,
        isLoading: isLoadingBodyComposition,
        error: bodyCompositionError,
    } = useFetchBodyComposition(id);
    const {
        data: contractDate,
        isLoading: contractIsLoading,
        error: contractError,
    } = useFetchPlayerContractDetails(id);
    const handleOpenModalBankData = () => {
        setIsModalOpenBankData(true);
    };
    const handleCloseModalBankData = () => {
        setIsModalOpenBankData(false);
    };
    const handleOpenModalContact = () => {
        setIsModalOpenContact(true);
    };
    const handleCloseModalContact = () => {
        setIsModalOpenContact(false);
    };
    const handleOpenModalContract = () => {
        setIsModalOpenContract(true);
    };
    const handleCloseModalContract = () => {
        setIsModalOpenContract(false);
    };
    const handleOpenModalPersonalInformation = () => {
        setIsModalOpenPersonalInformation(true);
    };
    const handleCloseModalPersonalInformation = () => {
        setIsModalOpenPersonalInformation(false);
    };
    const handleOpenModalMedicalInformation = () => {
        setIsModalOpenMedicalInformation(true);
    };
    const handleCloseModalMedicalInformation = () => {
        setIsModalOpenMedicalInformation(false);
    };
    const handleOpenModalClothes = () => {
        setIsModalOpenClothes(true);
    };
    const handleCloseModalClothes = () => {
        setIsModalOpenClothes(false);
    };
    const handleOpenModalMedicalInfoModal = () => {
        setIsModalOpenMedicalInfoModal(true);
    };
    const handleCloseModalMedicalInfoModal = () => {
        setIsModalOpenMedicalInfoModal(false);
    };
    const handleOpenAddNewDocumentFile = () => {
        setIsModalOpenAddNewDocumentFile(true);
    };
    const handleCloseAddNewDocumentFile = () => {
        setIsModalOpenAddNewDocumentFile(false);
    };
    const handleOpenModalFitnessBatteryModal = () => {
        setIsModalOpenFitnessBatteryModa(true);
    };
    const handleCloseModalFitnessBatteryModal = () => {
        setIsModalOpenFitnessBatteryModa(false);
    };
    const handleOpenModalAthleteBiometrics = () => {
        setIsModalOpenAthleteBiometrics(true);
    };
    const handleCloseModalAthleteBiometrics = () => {
        setIsModalOpenAthleteBiometrics(false);
    };
    useEffect(() => {
        if (activeTab === 'profile') {
            setColumns([
                {
                    key: 'date',
                    label: trans('player.table.date'),
                    width: '15%',
                    sortable: false,
                },
                {
                    key: 'type',
                    label: trans('player.table.type'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'description',
                    label: trans('player.table.description'),
                    width: '15%',
                    sortable: true,
                },
            ]);
        } else if (activeTab === 'records') {
            setColumns([
                {
                    key: 'date',
                    label: trans('player.table.date'),
                    width: '15%',
                    sortable: false,
                },
                {
                    key: 'type',
                    label: trans('player.table.typeTemplate'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'level',
                    label: trans('player.table.level'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'position',
                    label: trans('player.table.position'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'avg',
                    label: trans('player.table.avg'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'comment',
                    label: trans('player.table.comment'),
                    width: '15%',
                    sortable: true,
                },
            ]);
        } else if (activeTab === 'analytics') {
            setColumns([
                {
                    key: 'date',
                    label: trans('player.table.date'),
                    width: '15%',
                    sortable: false,
                },
                {
                    key: 'curlup',
                    label: trans('player.table.curlup'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'pushup',
                    label: trans('player.table.pushup'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'truncklift',
                    label: trans('player.table.truncklift'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'sitreach',
                    label: trans('player.table.sitreach'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'pacer',
                    label: trans('player.table.pacer'),
                    width: '15%',
                    sortable: true,
                },
            ]);
            setColumnsTwo([
                {
                    key: 'date',
                    label: trans('player.table.date'),
                    width: '15%',
                    sortable: false,
                },
                {
                    key: 'weight',
                    label: trans('player.table.weight'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'height',
                    label: trans('player.table.height'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'bodymassindex',
                    label: trans('player.table.bodymassindex'),
                    width: '15%',
                    sortable: true,
                },
            ]);
        }
    }, [trans, activeTab]);

    function isAllFitnessDataRecord(
        record: FitnessDataRecord | AllFitnessDataRecord,
    ): record is AllFitnessDataRecord {
        return (
            'pacer' in record ||
            'sit' in record ||
            'trunk' in record ||
            'push' in record ||
            'curl' in record
        );
    }

    const createGradient = (
        ctx: CanvasRenderingContext2D,
        chartArea: any,
        colors: [string, string],
    ) => {
        const { top, bottom } = chartArea;
        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        gradient.addColorStop(0, colors[0]); // Start color
        gradient.addColorStop(1, colors[1]); // End color
        return gradient;
    };

    const filteredData = fitnessDataRecords
        ? (fitnessDataRecords?.athleteData as (FitnessDataRecord | AllFitnessDataRecord)[]).filter(
              (record: FitnessDataRecord | AllFitnessDataRecord) => {
                  if (selectedTestType === 'all' && isAllFitnessDataRecord(record)) {
                      // For 'all', check if any fitness test data is greater than 0
                      return (
                          parseFloat(record?.push ?? '0') > 0 ||
                          parseFloat(record?.curl ?? '0') > 0 ||
                          parseFloat(record?.sit ?? '0') > 0 ||
                          parseFloat(record?.trunk ?? '0') > 0 ||
                          parseFloat(record?.pacer ?? '0') > 0
                      );
                  } else if (!isAllFitnessDataRecord(record)) {
                      // For specific testType, check if 'value' is greater than 0
                      return record.value > 0;
                  }
                  return false;
              },
          )
        : [];

    const pushUpsData = {
        labels: filteredData.map((_, index) => index + 1), // Use index instead of id
        datasets: [
            {
                label: trans('chart.push'),
                data: filteredData?.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record?.push ?? '0') || 0
                        : selectedTestType === 'push' && !isAllFitnessDataRecord(record)
                          ? record?.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context?.chart;
                    const ctx = chart?.ctx;
                    const chartArea = chart?.chartArea;
                    if (!chartArea) {
                        return '#4A90E2'; // Return a default color if gradient can't be created
                    }
                    return createGradient(ctx, chartArea, ['#4A90E2', '#0033A0']); // Unique gradient
                },
                borderColor: 'rgba(54, 162, 235, 1)', // Strong blue
                borderWidth: 1,
                barThickness: 30, // Set a fixed bar width
                maxBarThickness: 50, // Set a maximum bar width
            },
            {
                label: trans('chart.curl'),
                data: filteredData.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record.curl ?? '0') || 0
                        : selectedTestType === 'curl' && !isAllFitnessDataRecord(record)
                          ? record.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const ctx = chart.ctx;
                    const chartArea = chart?.chartArea;
                    if (!chartArea) {
                        return 'rgba(255, 99, 132, 0.6)'; // Return a default color if gradient can't be created
                    }
                    return createGradient(ctx, chartArea, ['#FF6384', '#FF6F61']); // Unique gradient
                },
                borderColor: 'rgba(255, 99, 132, 1)', // Strong red
                borderWidth: 1,
                barThickness: 30, // Set a fixed bar width
                maxBarThickness: 50, // Set a maximum bar width
            },
            {
                label: trans('chart.sit'),
                data: filteredData.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record?.sit ?? '0') || 0
                        : selectedTestType === 'sit' && !isAllFitnessDataRecord(record)
                          ? record.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context?.chart;
                    const ctx = chart?.ctx;
                    const chartArea = chart?.chartArea;
                    if (!chartArea) {
                        return 'rgba(75, 192, 192, 0.6)'; // Return a default color if gradient can't be created
                    }
                    return createGradient(ctx, chartArea, ['#4BC0C0', '#009688']); // Unique gradient
                },
                borderColor: 'rgba(75, 192, 192, 1)', // Strong teal
                borderWidth: 1,
                barThickness: 30, // Set a fixed bar width
                maxBarThickness: 50, // Set a maximum bar width
            },
            {
                label: trans('chart.trunk'),
                data: filteredData?.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record?.trunk ?? '0') || 0
                        : selectedTestType === 'trunk' && !isAllFitnessDataRecord(record)
                          ? record?.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context?.chart;
                    const ctx = chart.ctx;
                    const chartArea = chart.chartArea;
                    if (!chartArea) {
                        return 'rgba(153, 102, 255, 0.6)'; // Return a default color if gradient can't be created
                    }
                    return createGradient(ctx, chartArea, ['#9966FF', '#663399']); // Unique gradient
                },
                borderColor: 'rgba(153, 102, 255, 1)', // Strong purple
                borderWidth: 1,
                barThickness: 30, // Set a fixed bar width
                maxBarThickness: 50, // Set a maximum bar width
            },
            {
                label: trans('chart.pacer'),
                data: filteredData?.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record?.pacer ?? '0') || 0
                        : selectedTestType === 'pacer' && !isAllFitnessDataRecord(record)
                          ? record?.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context?.chart;
                    const ctx = chart?.ctx;
                    const chartArea = chart?.chartArea;
                    if (!chartArea) {
                        return 'rgba(255, 159, 64, 0.6)'; // Return a default color if gradient can't be created
                    }
                    return createGradient(ctx, chartArea, ['#FFCE56', '#FF8C00']); // Unique gradient
                },
                borderColor: 'rgba(255, 159, 64, 1)', // Strong orange
                borderWidth: 1,
                barThickness: 30, // Set a fixed bar width
                maxBarThickness: 50, // Set a maximum bar width
            },
        ].filter(
            (dataset) =>
                selectedTestType === 'all' || dataset?.label === trans(`chart.${selectedTestType}`),
        ),
    };
    const handleDateClick = (clickedDate: any) => {
        const newDate = new Date(clickedDate);
        setStartDate(newDate);
        setEndDate(new Date(newDate.getTime() + 30 * 24 * 60 * 60 * 1000));
    };
    const DashboardCharts = () => {
        let chartHeight = window.innerWidth < 768 ? 100 : 600;

        const chartOptions = {
            responsive: true,
            height: chartHeight,

            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const,
                    align: 'end' as const,
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                    },
                },
                title: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const index = context?.dataIndex;
                            const date = filteredData[index]?.date || '';
                            const value = context?.raw;

                            return [
                                `${moment(date).format('MMM DD')}`,
                                `${context.dataset.label}:${value}`,
                            ];
                        },
                        title: function () {
                            return '';
                        },
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        autoSkip: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2,
                    },
                },
            },
            onClick: (event: any, elements: any) => {
                if (elements.length > 0) {
                    const index = elements[0]?.index;
                    const clickedDate = fitnessDataRecords?.athleteData[index]?.date;
                    handleDateClick(clickedDate);
                }
            },
        } as const;

        return (
            <Theme.ChartsContainer>
                <div>
                    <Theme.FormGroup>
                        <Theme.FormGroupWrapper>
                            <Theme.FormLabel htmlFor="testTypeSelect">
                                {trans('confirm-session.type')}
                            </Theme.FormLabel>
                            <select
                                id="testTypeSelect"
                                value={selectedTestType}
                                onChange={handleTestTypeChange}
                                style={{
                                    padding: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    width: '150px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {testTypes.map((testType) => (
                                    <option key={testType} value={testType}>
                                        {trans(`athlete.battery.${testType}`)}
                                    </option>
                                ))}
                            </select>
                        </Theme.FormGroupWrapper>
                        <Theme.FormGroupWrapper>
                            <Theme.FormLabel htmlFor="intervalSelect">
                                {trans('athlete.battery.interval')}
                            </Theme.FormLabel>
                            <select
                                id="intervalSelect"
                                value={interval}
                                onChange={handleIntervalChange}
                                style={{
                                    padding: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    width: '150px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <option value="15 days">{trans('athlete.battery.15Days')}</option>
                                <option value="1 month">{trans('athlete.battery.1Month')}</option>
                                <option value="1 day">{trans('athlete.battery.1Day')}</option>
                            </select>
                        </Theme.FormGroupWrapper>
                        <Theme.FormGroupWrapper>
                            <Theme.FormLabel htmlFor="startDate">
                                {trans('athlete.health.startDate')}
                            </Theme.FormLabel>
                            <Theme.FormInput
                                id="startDate"
                                type="date"
                                value={startDate && startDate.toISOString().split('T')[0]}
                                onChange={handleStartDateChange}
                            />
                        </Theme.FormGroupWrapper>
                        <Theme.FormGroupWrapper>
                            <Theme.FormLabel htmlFor="endDate">
                                {trans('athlete.health.endDate')}
                            </Theme.FormLabel>
                            <Theme.FormInput
                                id="endDate"
                                type="date"
                                value={endDateFitnnes && endDateFitnnes.toISOString().split('T')[0]}
                                onChange={handleEndDateChange}
                            />
                        </Theme.FormGroupWrapper>
                    </Theme.FormGroup>

                    <div className="chart-wrapper">
                        <Bar data={pushUpsData} options={chartOptions} />
                    </div>
                </div>
            </Theme.ChartsContainer>
        );
    };

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              { label: trans('breadcrumbs.players'), path: 'players', params: { sportId } },
              {
                  label: id,
                  path: `/players-details`,
                  params: { sportId, id },
              },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    return (
        <Theme.Body>
            <Theme.PlayerPageHeaderIformationWrapper>
                <Theme.PlayerPageHeaderIformation>
                    <Theme.AcademyAndPlayerInfoWrapper>
                        <Theme.AcademyInformation>
                            <Theme.SportSpan>
                                {filteredSport?.sport && trans(`sport.${filteredSport?.sport}`)}
                            </Theme.SportSpan>
                            {/* <Theme.SportSpan>{athleteDetails?.sportProfile?.sport}</Theme.SportSpan> */}
                            <Theme.AcademySpan>{athleteDetails?.teams?.name}</Theme.AcademySpan>
                            <Theme.AgeGendarSpan>
                                {athleteDetails?.gender && (
                                    <>
                                        @
                                        {trans(
                                            `form.editAthletePersonalInfo.${athleteDetails?.gender}`,
                                        )}
                                        ,
                                        {calculateYearsDifference(
                                            new Date(),
                                            new Date(athleteDetails?.dateOfBirth || ''),
                                        )}
                                    </>
                                )}
                            </Theme.AgeGendarSpan>
                            <Theme.NationalTeamSpan>
                                {athleteDetails?.nationality &&
                                    trans(`form.editAthleteProfile.${athleteDetails?.nationality}`)}
                            </Theme.NationalTeamSpan>
                        </Theme.AcademyInformation>
                        <Theme.PLayerInformation>
                            <Theme.PlayerNameSpan>
                                {athleteDetails?.firstName} {athleteDetails?.lastName}
                            </Theme.PlayerNameSpan>
                        </Theme.PLayerInformation>
                        <Theme.PLayerInformationDetails>
                            {athleteDetails?.level && (
                                <Theme.PlayerLevelSpan>
                                    {trans(`form.add.player.${athleteDetails?.level}`)}
                                </Theme.PlayerLevelSpan>
                            )}
                            {athleteDetails?.position && (
                                <Theme.PlayerRoleSpan>
                                    {trans(`form.editAthleteProfile.${athleteDetails?.position}`)}
                                </Theme.PlayerRoleSpan>
                            )}
                        </Theme.PLayerInformationDetails>
                        <Theme.SportPlayerDetails>
                            <Theme.Datalabel>{trans('player.details.id')}</Theme.Datalabel>
                            <Theme.DataContant>#{athleteDetails?.id}</Theme.DataContant>
                            <Theme.Datalabel>
                                {trans('player.details.heightWeight')}
                            </Theme.Datalabel>
                            <Theme.DataContant>
                                {athleteDetails
                                    ? `${athleteDetails?.height || trans('not.added')}/${
                                          athleteDetails?.weight || trans('not.added')
                                      }`
                                    : 'Not Added'}
                            </Theme.DataContant>
                            <Theme.Datalabel>{trans(`player.details.nationality`)}</Theme.Datalabel>
                            <Theme.DataContant>
                                {athleteDetails?.nationality &&
                                    trans(`form.editAthleteProfile.${athleteDetails?.nationality}`)}
                            </Theme.DataContant>
                        </Theme.SportPlayerDetails>
                    </Theme.AcademyAndPlayerInfoWrapper>
                </Theme.PlayerPageHeaderIformation>
                <Theme.IMGWrapper>
                    <AvatarImage
                        date={athleteDetails?.dateOfBirth}
                        avatarUrl={athleteDetails?.avatarUrl}
                    />
                </Theme.IMGWrapper>

                <Theme.ContractInfo>
                    <Theme.ContractTitleSpan>
                        <ul>
                            {athleteDetails?.subscription?.status === 'active' && (
                                <li style={{ color: 'green' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${athleteDetails?.subscription?.status}`,
                                    )}
                                </li>
                            )}
                            {!athleteDetails?.subscription?.status && (
                                <li style={{ color: 'green' }}>
                                    {trans(`form.subscriptionManagement.status.registered`)}
                                </li>
                            )}
                            {athleteDetails?.subscription?.status === 'inactive' && (
                                <li style={{ color: 'gray' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${athleteDetails?.subscription?.status}`,
                                    )}
                                </li>
                            )}
                            {athleteDetails?.subscription?.status === 'pending' && (
                                <li style={{ color: 'yellow' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${athleteDetails?.subscription?.status}`,
                                    )}
                                </li>
                            )}
                            {athleteDetails?.subscription?.status === 'expired' && (
                                <li style={{ color: 'red' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${athleteDetails?.subscription?.status}`,
                                    )}
                                </li>
                            )}
                        </ul>
                    </Theme.ContractTitleSpan>
                    <Theme.ContractDateSpan>
                        {athleteDetails?.subscription?.subscriptionDate &&
                            stringToDateString(athleteDetails.subscription.subscriptionDate)}
                    </Theme.ContractDateSpan>
                </Theme.ContractInfo>
            </Theme.PlayerPageHeaderIformationWrapper>
            <Theme.TabsContainer>
                <Theme.TabsWrapper>
                    <Theme.Tabs
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        {trans('athlete.profile')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'records' ? 'active' : ''}
                        onClick={() => setActiveTab('records')}
                    >
                        {trans('athlete.records')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'analytics' ? 'active' : ''}
                        onClick={() => setActiveTab('analytics')}
                    >
                        {trans('athlete.analytics')}
                    </Theme.Tabs>
                </Theme.TabsWrapper>

                <Theme.TabContent>
                    {activeTab === 'analytics' && (
                        <Theme.InfoWrap>
                            <AddFitnessBatteryModal
                                isOpen={isModalOpenFitnessBatteryModa}
                                onClose={() => handleCloseModalFitnessBatteryModal()}
                            />
                            <AddAthleteBiometrics
                                isOpen={isModalOpenAthleteBiometrics}
                                onClose={() => handleCloseModalAthleteBiometrics()}
                            />
                            <Theme.TableHeaderTitle>
                                {trans('tableTitle.body.fitnessBattery')}
                            </Theme.TableHeaderTitle>
                            <Theme.DivWraperFlex>
                                <Theme.DivWraperFlexCharts>
                                    <FitnessBatteryChart batteryData={playerBatteries} />
                                </Theme.DivWraperFlexCharts>
                                <Theme.DivWraperFlexCharts>
                                    <DashboardCharts />
                                </Theme.DivWraperFlexCharts>
                            </Theme.DivWraperFlex>
                            <Theme.LabelAndIconWaper>
                                {trans('athlete.medicalInformation')}
                                <button onClick={handleOpenModalFitnessBatteryModal}>
                                    <img
                                        src="/assets/icons/add-icon-black.svg"
                                        alt="edit"
                                        height={24}
                                        width={24}
                                    />
                                </button>
                            </Theme.LabelAndIconWaper>
                            <TemplatesTablePlayersSession
                                columns={columns || []}
                                data={playerBatteries || []}
                            />
                            <Theme.LabelAndIconWaper>
                                {trans('tableTitle.body.compositions')}
                                <button onClick={handleOpenModalAthleteBiometrics}>
                                    <img
                                        src="/assets/icons/add-icon-black.svg"
                                        alt="edit"
                                        height={24}
                                        width={24}
                                    />
                                </button>
                            </Theme.LabelAndIconWaper>
                            <TemplatesTablePlayerCompositionRecords
                                columns={columnsTwo || []}
                                data={bodyComposition || []}
                            />
                        </Theme.InfoWrap>
                    )}
                    {activeTab === 'records' && (
                        <PlayersInfo tableData={[]} columns={columns || []} data={[]} />
                    )}
                    {activeTab === 'profile' && (
                        <Theme.InfoWrap>
                            <EditPlayerBankData
                                isOpen={isModalOpenBankData}
                                onClose={() => handleCloseModalBankData()}
                            />
                            <EditPlayerContact
                                isOpen={isModalOpenContact}
                                onClose={() => handleCloseModalContact()}
                            />
                            <EditPlayerContract
                                isOpen={isModalOpenContract}
                                onClose={() => handleCloseModalContract()}
                            />
                            <EditPlayerPersonalInformation
                                isOpen={isModalOpenPersonalInformation}
                                onClose={() => handleCloseModalPersonalInformation()}
                            />
                            <EditMedicalInformation
                                isOpen={isModalOpenMedicalInformation}
                                onClose={() => handleCloseModalMedicalInformation()}
                            />
                            <EditClothes
                                isOpen={isModalOpenClothes}
                                onClose={() => handleCloseModalClothes()}
                            />
                            <MedicalInfoModal
                                isOpen={isModalOpenMedicalInfoModal}
                                onClose={() => handleCloseModalMedicalInfoModal()}
                            />
                            <AddNewDocumentFile
                                isOpen={isModalOpenAddNewDocumentFile}
                                onClose={() => handleCloseAddNewDocumentFile()}
                            />
                            <Theme.WrapRecords>
                                <Theme.DivWraper>
                                    <Theme.LabelAndIconWaper>
                                        {trans('profile.personalInformation')}
                                        <button onClick={handleOpenModalPersonalInformation}>
                                            <img
                                                src="/assets/icons/edit.svg"
                                                alt="edit"
                                                height={24}
                                                width={24}
                                            />
                                        </button>
                                    </Theme.LabelAndIconWaper>
                                    <Theme.StatusContainer3>
                                        <Theme.InfoRow>
                                            <Theme.Label>{trans('profile.name')}:</Theme.Label>
                                            {athleteDetails?.firstName ? (
                                                `${athleteDetails?.firstName} ${athleteDetails?.lastName}`
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.teams')}:
                                            </Theme.Label>
                                            {athleteDetails?.teams?.name ? (
                                                athleteDetails?.teams?.name
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Join Date */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.join')}:
                                            </Theme.Label>
                                            {athleteDetails?.joinDate ? (
                                                moment(athleteDetails?.joinDate).format(
                                                    'DD-MM-YYYY',
                                                )
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.category')}:
                                            </Theme.Label>
                                            {athleteDetails?.category ? (
                                                athleteDetails?.category
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.body.position')}:
                                            </Theme.Label>
                                            {athleteDetails?.psotion ? (
                                                athleteDetails?.psotion
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Weight */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.body.weight')}:
                                            </Theme.Label>
                                            {athleteDetails?.weight ? (
                                                athleteDetails?.weight
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.body.height')}:
                                            </Theme.Label>
                                            {athleteDetails?.height ? (
                                                athleteDetails?.height
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Level */}
                                        <Theme.InfoRow>
                                            <Theme.Label>{trans('athlete.level')}:</Theme.Label>
                                            {athleteDetails?.level ? (
                                                trans(`form.add.player.${athleteDetails?.level}`)
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Date of Birth */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('form.editAthletePersonalInfo.birth')}:
                                            </Theme.Label>
                                            {athleteDetails?.dateOfBirth ? (
                                                moment(athleteDetails?.dateOfBirth).format(
                                                    'DD-MM-YYYY',
                                                )
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>

                                        {/* Gender */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.gender')}:
                                            </Theme.Label>
                                            {athleteDetails?.gender ? (
                                                <>
                                                    {trans(
                                                        `gender.${athleteDetails?.gender}`,
                                                        athleteDetails?.gender,
                                                    )}
                                                </>
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width={16}
                                                    height={16}
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Experience */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('coach.personal.experience')}:
                                            </Theme.Label>
                                            {athleteDetails?.experience ? (
                                                athleteDetails?.experience
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Nationality */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.country')}:
                                            </Theme.Label>
                                            {athleteDetails?.nationality ? (
                                                trans(
                                                    `form.editAthleteProfile.${athleteDetails?.nationality}`,
                                                )
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Language */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.language')}:
                                            </Theme.Label>
                                            {athleteDetails?.language ? (
                                                athleteDetails.language
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* School Name */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.school')}:
                                            </Theme.Label>
                                            {athleteDetails?.schoolName ? (
                                                athleteDetails?.schoolName
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>

                                        {/* Education */}
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.body.education')}:
                                            </Theme.Label>
                                            {athleteDetails?.education ? (
                                                trans(
                                                    `form.editAthletePersonalInfo.${athleteDetails?.education}`,
                                                )
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        {/* Height */}
                                    </Theme.StatusContainer3>
                                </Theme.DivWraper>
                                <Theme.ContainersWrap>
                                    <Theme.DivWraper>
                                        <Theme.LabelAndIconWaper>
                                            {trans('form.editAthleteProfile.contact')}
                                            <button onClick={handleOpenModalContact}>
                                                <img
                                                    src="/assets/icons/edit.svg"
                                                    alt="edit"
                                                    height={24}
                                                    width={24}
                                                />
                                            </button>
                                        </Theme.LabelAndIconWaper>
                                        <Theme.StatusContainer3>
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('club.phoneNumbers')}:
                                                </Theme.Label>
                                                {athleteDetails?.emergencyContact?.name ? (
                                                    athleteDetails.emergencyContact?.name
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>
                                            {/* Emergency Contact Phone Number */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('coach.profile.UrgentPhoneNumber')}:
                                                </Theme.Label>
                                                {athleteDetails?.emergencyContact?.phoneNumber ? (
                                                    `${athleteDetails?.emergencyContact
                                                        ?.phoneNumber} (${trans(
                                                        `form.editAthleteProfile.${athleteDetails?.emergencyContact?.relationship}`,
                                                    )})`
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>

                                            {/* National Identification Number (NIN) */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('coach.profile.nationalID')}:
                                                </Theme.Label>
                                                {athleteDetails?.emergencyContact
                                                    ?.nationalNumber ? (
                                                    athleteDetails?.emergencyContact?.nationalNumber
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>

                                            {/* NIN Expiration Date */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('coach.profile.nationalIDExpiration')}:
                                                </Theme.Label>
                                                {athleteDetails?.ninExpirationDate ? (
                                                    moment(
                                                        athleteDetails?.ninExpirationDate,
                                                    ).format('DD-MM-YYYY')
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>
                                        </Theme.StatusContainer3>
                                    </Theme.DivWraper>
                                    <Theme.DivWraper>
                                        <Theme.LabelAndIconWaper>
                                            {trans('athlete.bankData')}
                                            <button onClick={handleOpenModalBankData}>
                                                <img
                                                    src="/assets/icons/edit.svg"
                                                    alt="edit"
                                                    height={24}
                                                    width={24}
                                                />
                                            </button>
                                        </Theme.LabelAndIconWaper>
                                        <Theme.StatusContainer3>
                                            {/* IBAN Number */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.ibanNumber')}:
                                                </Theme.Label>
                                                {athleteDetails?.bankDetails?.iban ? (
                                                    athleteDetails?.bankDetails?.iban
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>

                                            {/* Bank Name */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.bankName')}:
                                                </Theme.Label>
                                                {athleteDetails?.bankDetails?.bank ? (
                                                    trans(
                                                        `bank.${athleteDetails?.bankDetails?.bank}`,
                                                    )
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>

                                            {/* Account Holder */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.accountOwner')}:
                                                </Theme.Label>
                                                {athleteDetails?.bankDetails?.accountHolder ? (
                                                    athleteDetails?.bankDetails?.accountHolder
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>
                                        </Theme.StatusContainer3>
                                    </Theme.DivWraper>
                                    <Theme.DivWraper>
                                        <Theme.LabelAndIconWaper>
                                            {trans('athlete.clothsData')}
                                            <button onClick={handleOpenModalClothes}>
                                                <img
                                                    src="/assets/icons/edit.svg"
                                                    alt="edit"
                                                    height={24}
                                                    width={24}
                                                />
                                            </button>
                                        </Theme.LabelAndIconWaper>
                                        <Theme.StatusContainer3>
                                            {/* T-Shirt Size */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.tshirtSize')}:
                                                </Theme.Label>
                                                {athleteDetails?.athleteClothing?.tShirtSize ? (
                                                    athleteDetails?.athleteClothing?.tShirtSize
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>

                                            {/* Pant Size */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.pantSize')}:
                                                </Theme.Label>
                                                {athleteDetails?.athleteClothing?.pantSize ? (
                                                    athleteDetails?.athleteClothing?.pantSize
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>

                                            {/* Shoe Size */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.shoesSize')}:
                                                </Theme.Label>
                                                {athleteDetails?.athleteClothing?.shoeSize ? (
                                                    athleteDetails?.athleteClothing?.shoeSize
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>

                                            {/* Dri-Fit Size */}
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.driFit')}:
                                                </Theme.Label>
                                                {athleteDetails?.athleteClothing?.driFitSize ? (
                                                    athleteDetails?.athleteClothing?.driFitSize
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.InfoRow>
                                        </Theme.StatusContainer3>
                                    </Theme.DivWraper>
                                </Theme.ContainersWrap>
                            </Theme.WrapRecords>
                            {/* *-*-*-*-*-*-*-*-*-*- START Contracting*-*-*-*-*-*-*-*-*-*-*-*-* */}
                            <Theme.DivWraper>
                                <Theme.LabelAndIconWaper>
                                    {trans('form.editAthleteProfile.contracting')}
                                    <button onClick={handleOpenModalContract}>
                                        <img
                                            src="/assets/icons/edit.svg"
                                            alt="edit"
                                            height={24}
                                            width={24}
                                        />
                                    </button>
                                </Theme.LabelAndIconWaper>
                                <Theme.StatusContainer3>
                                    <Theme.InfoRow>
                                        <Theme.Label>
                                            {trans('form.editAthleteProfile.joinDate')}:
                                        </Theme.Label>
                                        {contractDate?.payload?.joinDate ? (
                                            isRTL ? (
                                                moment(contractDate?.payload?.joinDate).format(
                                                    'DD-MM-YYYY',
                                                )
                                            ) : (
                                                contractDate?.payload?.joinDate
                                            )
                                        ) : (
                                            <img
                                                src="/assets/icons/NullIcon.svg"
                                                alt="Null Icon"
                                                width="16"
                                                height="16"
                                            />
                                        )}
                                    </Theme.InfoRow>
                                    {/* Emergency Contact Phone Number */}
                                    <Theme.InfoRow>
                                        <Theme.Label>
                                            {trans('form.editAthleteProfile.contractDuration')}:
                                        </Theme.Label>
                                        {contractDate?.payload?.contractDuration ? (
                                            trans(
                                                `form.subscriptionManagement.periodSubscription.${contractDate?.payload?.contractDuration}`,
                                            )
                                        ) : (
                                            <img
                                                src="/assets/icons/NullIcon.svg"
                                                alt="Null Icon"
                                                width="16"
                                                height="16"
                                            />
                                        )}
                                    </Theme.InfoRow>

                                    {/* National Identification Number (NIN) */}
                                    <Theme.InfoRow>
                                        <Theme.Label>
                                            {trans('athlete.personal.expirationDate')}:
                                        </Theme.Label>
                                        {contractDate?.payload?.expirationDate ? (
                                            isRTL ? (
                                                moment(
                                                    contractDate?.payload?.expirationDate,
                                                ).format('DD-MM-YYYY')
                                            ) : (
                                                contractDate?.payload?.expirationDate
                                            )
                                        ) : (
                                            <img
                                                src="/assets/icons/NullIcon.svg"
                                                alt="Null Icon"
                                                width="16"
                                                height="16"
                                            />
                                        )}
                                    </Theme.InfoRow>
                                    <Theme.InfoRow>
                                        <Theme.Label>{trans('athlete.personal.file')}:</Theme.Label>
                                        <Theme.FileButton
                                            onClick={() =>
                                                window.open(
                                                    contractDate?.payload?.contractUrl,
                                                    '_blank',
                                                )
                                            }
                                        >
                                            <img
                                                src="/assets/icons/file-icon.svg"
                                                alt="edit"
                                                height={18}
                                                width={18}
                                            />
                                        </Theme.FileButton>
                                    </Theme.InfoRow>
                                </Theme.StatusContainer3>
                            </Theme.DivWraper>
                            {/* *-*-*-*-*-*-*-*-*-*- end Contracting*-*-*-*-*-*-*-*-*-*-*-*-* */}
                            <Divider />
                            <Theme.WrapRecords>
                                <Theme.DivWraper>
                                    <Theme.LabelAndIconWaper>
                                        {trans('athlete.medicalInformation')}
                                        <button onClick={handleOpenModalMedicalInfoModal}>
                                            <img
                                                src="/assets/icons/edit.svg"
                                                alt="edit"
                                                height={24}
                                                width={24}
                                            />
                                        </button>
                                    </Theme.LabelAndIconWaper>
                                    <Theme.StatusContainer3>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.medical.allergies')}
                                            </Theme.Label>
                                            {trans(
                                                `athlete.truthyValue.${athleteMedicalInfo?.medicalInfo?.allergies}`,
                                            )}
                                        </Theme.InfoRow>

                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.medical.foodAllergies')}
                                            </Theme.Label>
                                            {athleteMedicalInfo?.medicalInfo?.foodAllergies ? (
                                                trans(
                                                    `foodAllergies.${athleteMedicalInfo?.medicalInfo?.foodAllergies}`,
                                                )
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.medical.chronic')}
                                            </Theme.Label>
                                            {athleteMedicalInfo?.medicalInfo?.chronicDisease ? (
                                                //  trans(
                                                //       `athlete.truthyValue.${athleteMedicalInfo?.medicalInfo?.chronic}`,
                                                //   )
                                                trans(
                                                    `athlete.truthyValue.${athleteMedicalInfo?.medicalInfo?.chronicDisease}`,
                                                )
                                            ) : (
                                                <img
                                                    src="/assets/icons/NullIcon.svg"
                                                    alt="Null Icon"
                                                    width="16"
                                                    height="16"
                                                />
                                            )}
                                        </Theme.InfoRow>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.medical.consideration')}
                                            </Theme.Label>
                                            {trans(
                                                `form.editMedicalInfo.${athleteMedicalInfo?.medicalInfo?.consideration}`,
                                            )}
                                        </Theme.InfoRow>
                                    </Theme.StatusContainer3>
                                </Theme.DivWraper>
                                <Theme.DivWraper>
                                    <Theme.LabelAndIconWaper>
                                        {trans('coach.profile.Edit.medicalFiles')}
                                        <Theme.FileIconWrapper>
                                            <button onClick={handleOpenModalMedicalInfoModal}>
                                                <img
                                                    src="/assets/icons/edit.svg"
                                                    alt="edit"
                                                    height={24}
                                                    width={24}
                                                />
                                            </button>
                                        </Theme.FileIconWrapper>
                                    </Theme.LabelAndIconWaper>
                                    <Theme.StatusContainer3>
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {athleteMedicalInfo?.medicalInfo
                                                    ?.foodAllergiesUrl ? (
                                                    moment(
                                                        athleteMedicalInfo?.medicalInfo?.updatedAt,
                                                    ).format('DD-MM-YYYY')
                                                ) : (
                                                    <img
                                                        src="/assets/icons/NullIcon.svg"
                                                        alt="Null Icon"
                                                        width="16"
                                                        height="16"
                                                    />
                                                )}
                                            </Theme.Label>

                                            <Theme.FileContainer>
                                                <Theme.FileButton
                                                    onClick={() =>
                                                        window.open(
                                                            athleteMedicalInfo?.medicalInfo
                                                                ?.foodAllergiesUrl,
                                                            '_blank',
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src="/assets/icons/file-icon.svg"
                                                        alt="edit"
                                                        height={18}
                                                        width={18}
                                                    />
                                                    <Theme.FileName>
                                                        {athleteMedicalInfo?.medicalInfo?.foodAllergies
                                                            .split('/')
                                                            .pop() || 'File'}
                                                    </Theme.FileName>
                                                </Theme.FileButton>
                                            </Theme.FileContainer>
                                        </Theme.InfoRow>
                                        {athleteMedicalInfo?.medicalInfo?.considerationUrl && (
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {athleteMedicalInfo?.medicalInfo
                                                        ?.considerationUrl ? (
                                                        moment(
                                                            athleteMedicalInfo?.medicalInfo
                                                                ?.updatedAt,
                                                        ).format('DD-MM-YYYY')
                                                    ) : (
                                                        <img
                                                            src="/assets/icons/NullIcon.svg"
                                                            alt="Null Icon"
                                                            width="16"
                                                            height="16"
                                                        />
                                                    )}
                                                </Theme.Label>

                                                <Theme.FileContainer>
                                                    <Theme.FileButton
                                                        onClick={() =>
                                                            window.open(
                                                                athleteMedicalInfo?.medicalInfo
                                                                    ?.considerationUrl,
                                                                '_blank',
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src="/assets/icons/file-icon.svg"
                                                            alt="edit"
                                                            height={18}
                                                            width={18}
                                                        />
                                                        <Theme.FileName>
                                                            {athleteMedicalInfo?.medicalInfo?.consideration
                                                                .split('/')
                                                                .pop() || 'File'}
                                                        </Theme.FileName>
                                                    </Theme.FileButton>
                                                </Theme.FileContainer>
                                            </Theme.InfoRow>
                                        )}
                                    </Theme.StatusContainer3>
                                </Theme.DivWraper>
                            </Theme.WrapRecords>
                            <Theme.LabelAndIconWaper>
                                {trans('athlete.medicalInformation')}
                                <button onClick={handleOpenModalMedicalInformation}>
                                    <img
                                        src="/assets/icons/add-icon-black.svg"
                                        alt="edit"
                                        height={24}
                                        width={24}
                                    />
                                </button>
                            </Theme.LabelAndIconWaper>
                            <TemplatesTablePlayersDetails
                                loading={isLoadingHealthRecords}
                                columns={columns || []}
                                data={athleteHealthRecords?.records}
                            />
                            <Theme.LabelAndIconWaper>
                                {trans('athlete.Docs')}
                                <button onClick={handleOpenAddNewDocumentFile}>
                                    <img
                                        src="/assets/icons/add-icon-black.svg"
                                        alt="edit"
                                        height={24}
                                        width={24}
                                    />
                                </button>
                            </Theme.LabelAndIconWaper>
                            {documents?.payload.length > 0 ? (
                                <Theme.DocumentSectionWrapper>
                                    {documents?.payload?.map((doc: any) => (
                                        <DocumentCard key={doc?.id} doc={doc} />
                                    ))}
                                </Theme.DocumentSectionWrapper>
                            ) : (
                                <Theme.EmptyDOCSWrapper>
                                    <EmptyDOCS />
                                </Theme.EmptyDOCSWrapper>
                            )}
                        </Theme.InfoWrap>
                    )}
                </Theme.TabContent>
            </Theme.TabsContainer>
        </Theme.Body>
    );
};
