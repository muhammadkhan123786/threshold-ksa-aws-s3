import React, { useState } from 'react';
import { useRouter } from 'react-router5';

import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls } from 'store';
import {
    Nationality,
    Relationship,
    SubscriptionPeriod,
    SubscriptionStatus,
    UserRole,
} from 'libs/enums';
import { useGetAthletes } from 'hooks';
import { Athlete, AthleteSubscription } from 'libs/types';
import { getAvatarPlaceholder } from 'libs/constants';
import { useGetAthleteBio, useGetAthleteSubscription } from 'hooks/data';
import { exportPDF, getScaleExertion, stringToDateString, valueToSelectOption } from 'libs/helpers';
import { FitnessBatteryTable } from 'components/tables/FitnessBatteryTable';
import { useGetAthleteBattery, useGetAthleteProfiles } from 'hooks/data';
import FitnessBatteryChart from 'components/tables/FitnessBatteryChart';
import { BodyInfoTable } from 'components/tables';
import { setModalContent } from 'store/controlsSlice';
import { Loader, StatusIndicator, SubscriptionStatusButton } from 'components';
import { ProfilesCard } from 'components/cards/ProfilesCard';
import { WithRole } from 'hooks/roles';
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
    ChartOptions,
    BarElement,
    Title,
} from 'chart.js';
import { FaFileAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

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
import { Line, Doughnut, Radar, Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { FaStopwatch, FaClipboardCheck, FaUserCheck, FaStar, FaFile } from 'react-icons/fa';
import { useGetAthletesDetails } from 'hooks/data/useGetAthletesDetails';
import { useGetAthleteRecords } from 'hooks/data/useGetAthleteRecords';
import { AthleteRecord, AthletesRecords } from 'libs/types/athlete';
import {
    useDeleteDocument,
    useFetchAtheleteSessions,
    useFetchAthelteRecordById,
    useFetchAthleteAnalyticsById,
    useFetchAthleteDetailsById,
    useFetchAthleteDocumentsById,
    useFetchBodyCompositionById,
    useFetchBranchById,
    useFetchFitnessDataById,
    useFetchHealthRecordsById,
    useFetchMedicalInfoById,
    useFetchSessionRecordsById,
    useGetTodayAthletes,
} from 'services/hooks';
import moment from 'moment';
import { useQueryClient } from '@tanstack/react-query';
import { exportRowPDF } from 'libs/helpers/athleteHelpers';
const testTypes = ['push', 'curl', 'trunk', 'sit', 'pacer', 'all'] as const;
type TestType = (typeof testTypes)[number];
const formatDuration = (expiryDate: moment.MomentInput, trans: any) => {
    const now = moment();
    const expiry = moment(expiryDate);

    // Calculate differences
    const years = expiry.diff(now, 'years');
    now.add(years, 'years');

    const months = expiry.diff(now, 'months');
    now.add(months, 'months');

    const days = expiry.diff(now, 'days');

    let result = '';
    if (years > 0) result += `${years} ${trans('coach.personal.year')} ${years > 1 ? '' : ''} `;
    if (months > 0) result += `${months} ${trans('month')}${months > 1 ? '' : ''} `;
    if (days > 0) result += `${days} ${trans('day')}${days > 1 ? '' : ''}`;

    return result.trim() || `0 ${trans('day')}`;
};

const ChartsContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding-block: 50px;
    align-self: center;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 80%;
    @media (max-width: 767px) {
        width: 100%;
        height: auto; /* Set height to auto to adapt to content */
    }

    .chart-wrapper {
        height: 500px; /* Set a fixed height for large screens */

        @media (max-width: 767px) {
            height: 250px; /* Reduce height for mobile screens */
        }
    }
`;
export const FormGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-direction: row;
    margin-bottom: 1rem;

    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

export const FormLabel = styled.label`
    margin-bottom: 0.5rem;
    font-weight: bold;
`;

export const FormInput = styled.input`
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 150px; // Adjust width as needed
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const AthletePage = () => {
    const { trans } = useLocales();
    const expiryDate = '2024-08-27T10:45:00.207Z';
    const currentDate = moment();
    const endDate = moment(expiryDate);
    const isRTL = useSelector((state: any) => state.locales.isRTL);

    const duration = moment.duration(endDate.diff(currentDate));

    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const dispatch = useDispatch();
    const router = useRouter();
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();

    const { data: athlete, isLoading } = useGetAthletes<Athlete>({
        id: id || '',
        idType: 'athlete',
        dependents: [modalContent],
    });

    // const { data: athleteDetails, isLoading: isLoadingDetails } = useGetAthletesDetails<Athlete>({
    //     id: id || '',
    //     idType: 'athlete',
    //     dependents: [modalContent],
    // });

    // const { data: athleteRecords, isLoading: isLoadingRecords } =
    //     useGetAthleteRecords<AthletesRecords>({
    //         id: id || '',
    //         idType: 'athlete',
    //         dependents: [modalContent],
    //     });

    const {
        data: athleteDetails,
        isLoading: isLoadingDetails,
        error: athleteDetailsError,
        refetch: refetchathleteDetails,
    } = useFetchAthleteDetailsById(athlete?.id);

    const {
        data: athleteRecords,
        isLoading: isLoadingRecords,
        error,
        refetch: refetchAthleteRecord,
    } = useFetchAthelteRecordById(athlete?.id);

    const {
        data: athleteSession,
        isLoading: isLoadingSession,
        error: athleteSessionError,
        refetch: refetchAthleteAthelteSession,
    } = useFetchAtheleteSessions(athlete?.id);

    const {
        data: athleteSessionRecords,
        isLoading: isLoadingSessionRecords,
        error: athleteSessionRecordsError,
        refetch: refetchAthleteAthelteSessionRecords,
    } = useFetchSessionRecordsById(athlete?.id);

    const {
        data: athleteHealthRecords,
        isLoading: isLoadingHealthRecords,
        error: athleteHealthRecordsError,
        refetch: refetchAthleteHealthRecords,
    } = useFetchHealthRecordsById(athlete?.id);

    const [bodyCompositionStartDate, setBodyCompositionStartDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), 0, 2),
    );
    const [bodyCompositionEndDate, setBodyCompositionEndDate] = useState<Date | undefined>(
        new Date(),
    );

    const handleBodyCompositionStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setBodyCompositionStartDate(undefined); // Handle empty value
        } else {
            setBodyCompositionStartDate(new Date(value));
        }
    };

    const handlebodyCompositionEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setBodyCompositionEndDate(undefined); // Handle empty value
        } else {
            setBodyCompositionEndDate(new Date(value));
        }
    };

    const {
        data: bodyCompositionRecords,
        isLoading: isLoadingBodyComposition,
        error: bodyCompositionError,
        refetch: refetchBodyComposition,
    } = useFetchBodyCompositionById(athlete?.id, bodyCompositionStartDate, bodyCompositionEndDate);
    const [selectedTestType, setSelectedTestType] = useState<TestType>('all');
    const [startDate, setStartDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), 0, 2),
    );
    const [endDateFitnnes, setEndDate] = useState<Date | undefined>(new Date());
    const [interval, setInterval] = useState<string>('1 day');

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
    // const startDate = new Date('2024-01-01');
    // const endDateFitnnes = new Date('2024-06-30');
    // const interval = '1 day';
    const {
        data: fitnessDataRecords,
        isLoading: isLoadingFitnessData,
        error: fitnessDataError,
        refetch: refetchFitnessData,
    } = useFetchFitnessDataById(athlete?.id, selectedTestType, interval, startDate, endDateFitnnes);

    const {
        data: athleteMedicalInfo,
        isLoading: isLoadingMedicalInfo,
        error: athleteMedicalInfoError,
        refetch: refetchAthleteMedicalInfo,
    } = useFetchMedicalInfoById(athlete?.id);

    const [analyticStartDate, setAnalyticStartDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), 0, 2),
    );
    const [analyticEndDate, setAnalyticEndDate] = useState<Date | undefined>(new Date());

    const formattedStartDate = analyticStartDate?.toISOString().split('T')[0];
    const formattedEndDate = analyticEndDate?.toISOString().split('T')[0];

    const handleAnalyticStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setAnalyticStartDate(undefined); // Handle empty value
        } else {
            const newStartDate = new Date(event.target.value);
            setAnalyticStartDate(newStartDate);
        }
    };

    const handleAnalyticEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setAnalyticEndDate(undefined); // Handle empty value
        } else {
            const newEndDate = new Date(event.target.value);
            setAnalyticEndDate(newEndDate);
        }
    };
    const {
        data: athleteAnalytic,
        isLoading: isLoadingAnalytic,
        error: athleteAnalyticError,
        refetch: refetchAthleteAthelteAnalytic,
    } = useFetchAthleteAnalyticsById(athlete?.id, formattedStartDate, formattedEndDate);

    const {
        data: athleteDoccument,
        isLoading: isLoadingAthleteDoccument,
        error: athleteDoccumentError,
        refetch: refetchAthleteDoccument,
    } = useFetchAthleteDocumentsById(athlete?.id);

    const queryClient = useQueryClient();

    const athleteBioArray = useGetAthleteBio({
        athleteId: athlete?.id || '',
        dependents: [athlete, modalContent],
    });

    const athleteBatteryArray = useGetAthleteBattery({
        athleteId: athlete?.id || '',
        dependents: [athlete, modalContent],
    });

    const athleteProfilesArray = useGetAthleteProfiles({
        athleteId: athlete?.id || '',
        dependents: [athlete, modalContent],
    });

    const athleteSubscription = useGetAthleteSubscription({
        athleteId: athlete?.id || '',
        dependents: [athlete, modalContent],
    });

    const formattedScale = (scale: number | null | undefined | unknown) => {
        if (typeof scale === 'number') {
            return scale.toFixed(2); // Format the number to 2 decimal places
        }
        return '0.00'; // Default fallback in case of null/undefined
    };
    const [activeTab, setActiveTab] = useState('general-view');

    const handleEditProfile = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editAthleteProfile',
                    title: trans('form.editAthleteProfile.title'),
                    subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        firstName: athlete.firstName,
                        lastName: athlete.lastName,
                        avatar: athlete.avatar,
                        relationship: valueToSelectOption(
                            athlete.relationship,
                            Relationship,
                            trans,
                            'form.editAthleteProfile.',
                        ),
                        nationality: valueToSelectOption(
                            athlete.nationality,
                            Nationality,
                            trans,
                            'form.editAthleteProfile.',
                        ),
                        contactNumber: athlete.contactNumber,
                    },
                },
            }),
        );
    };

    const handleEditRecord = (item: any) => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editAtheleteRecord',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        category: item.category,
                        subcategory: item.subcategory,
                        personalRecord: item.personalRecord,
                        bestRecord: item.bestRecord,
                        lastRecord: item.lastRecord,
                        recordId: item.id,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleAddRecord = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'addAtheleteRecord',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };
    const handleAddBank = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'bankDataForm',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        iban: athleteDetails?.bankDetails?.iban,
                        bank: athleteDetails?.bankDetails?.bank,
                        accountHolder: athleteDetails?.bankDetails?.accountHolder,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleAddHealthRecord = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editAthleteHealthRecord',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleEditHtealthRecord = (item: any) => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editAthleteHealthRecord',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        recordId: item.id,
                        type: item.description,
                        description: item.description,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        medicalRecommendation: item.medicalRecommendation,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleAddClothing = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'clothingDataForm',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        tShirtSize: athleteDetails?.athleteClothing?.tShirtSize,
                        pantSize: athleteDetails?.athleteClothing?.pantSize,
                        shoeSize: athleteDetails?.athleteClothing?.shoeSize,
                        driFitSize: athleteDetails?.athleteClothing?.driFitSize,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleAddEmergency = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'emergencyContactForm',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        name: athleteDetails?.emergencyContact?.name,
                        relation: athleteDetails?.emergencyContact?.relationship,
                        phoneNumber: athleteDetails?.emergencyContact?.phoneNumber,
                        nationalNumber: athleteDetails?.emergencyContact?.nationalNumber,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleAddDocs = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'documentUploadForm',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        type: 'passport',
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleUpdateDocs = (documentId: any) => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'documentUploadForm',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        documentId: documentId,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleUpdateInfo = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'personalInfoForm',
                    title: trans('form.editAthleteProfile.title'),
                    subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        firstName: athleteDetails?.firstName,
                        lastName: athleteDetails?.lastName,
                        joinDate: athleteDetails?.joinDate,
                        level: athleteDetails?.level,
                        experience: athleteDetails?.experience,
                        education: athleteDetails?.education,
                        schoolName: athleteDetails?.schoolName,
                        dateOfBirth: athleteDetails?.dateOfBirth,
                        gender: athleteDetails?.gender,
                        nationality: athleteDetails?.nationality,
                        nin: athleteDetails?.nin,
                        weight: athleteDetails?.weight,
                        height: athleteDetails?.height,
                        ninExpirationDate: athlete?.ninExpirationDate,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleUpdateMedical = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'medicalInfoForm',
                    title: trans('form.editAthleteProfile.title'),
                    // subtitle: trans('form.editAthleteProfile.subtitle'),
                    defaults: {
                        allergies: athleteMedicalInfo?.medicalInfo?.allergies,
                        chronicDisease: athleteMedicalInfo?.medicalInfo?.chronicDisease
                            ? athleteMedicalInfo?.medicalInfo?.chronicDisease
                            : athleteMedicalInfo?.medicalInfo?.chronic?.length > 0
                              ? 'yes'
                              : 'no',
                        injury: athleteMedicalInfo?.medicalInfo?.injury ? 'yes' : 'no',
                        foodAllergies: athleteMedicalInfo?.medicalInfo?.foodAllergies,
                        consideration: athleteMedicalInfo?.medicalInfo?.consideration,
                        foodAllergiesFile: athleteMedicalInfo?.medicalInfo?.foodAllergiesUrl,
                        currentConsiderationFile: athleteMedicalInfo?.medicalInfo?.considerationUrl,
                        refetchAthleteRecord: refetchAthleteRecord,
                    },
                },
            }),
        );
    };

    const handleExportRow = (record: any) => {
        // Get the row element by its unique identifier or index
        const rowElement = document.getElementById(`row-${record.id}`);
        if (rowElement) {
            // Hide buttons before capturing
            const buttons = rowElement.querySelectorAll('button');
            buttons.forEach((button) => (button.style.display = 'none'));

            // Generate a professional filename
            const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const fileName = `Health_Record_${athlete.firstName}_${record.id}_${currentDate}.pdf`; // Professional name

            // Capture and export
            exportRowPDF(rowElement, fileName);

            // Restore button visibility after capturing
            buttons.forEach((button) => (button.style.display = ''));
        } else {
            console.error('Row element not found');
        }
    };
    const AnalyticsChart = () => {
        const breakdown = athleteAnalytic?.analyticsBreakdown;
        const data = {
            labels: [
                trans('analytics.absent'),
                trans('analytics.practice'),
                trans('analytics.injury'),
                trans('analytics.playingWithNationalTeam'),
            ],
            datasets: [
                {
                    data: [
                        breakdown?.absent || 0,
                        breakdown?.present || 0,
                        breakdown?.injury || 0,
                        breakdown?.reasonSessions || 0,
                    ],
                    backgroundColor: ['#E0E0E0', '#4F46E5', '#F5A623', '#7ED321'],
                    hoverBackgroundColor: ['#D8D8D8', '#4F46E5', '#F4A623', '#7DD321'],
                },
            ],
        };
        const options = {
            plugins: {
                legend: {
                    display: true, // Enable the legend to show labels
                    position: 'top' as const, // You can change the position (e.g., 'top', 'bottom', 'left', 'right')
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            return `${context.label}: ${context.raw}`;
                        },
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        };

        return (
            <Theme.ChartContainer>
                <Theme.ChartTitle>{trans('athlete.analytics')}</Theme.ChartTitle>
                <Doughnut options={options} data={data} />
            </Theme.ChartContainer>
        );
    };

    const handleUpdateSubscription = () => {
        const {
            subscriptionDate = new Date(),
            status = SubscriptionStatus.INACTIVE,
            period = SubscriptionPeriod.ONE_MONTH,
        } = athleteSubscription || {};

        dispatch(
            setModalContent({
                modalContent: {
                    type: 'updateSubscription',
                    title: trans('form.subscriptionManagement.title'),
                    subtitle: trans('form.subscriptionManagement.subtitle'),
                    defaults: {
                        subscriptionDate: subscriptionDate,
                        status: {
                            value: status,
                            label: trans(`form.subscriptionManagement.status.${status}`),
                        },
                        period: {
                            value: period,
                            label: trans(
                                `form.subscriptionManagement.periodSubscription.${period}`,
                            ),
                        },
                    },
                },
            }),
        );
    };

    if (isLoading || isLoadingDetails || isLoadingRecords) return <Loader />;

    const BoxContainer = styled.div`
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        @media (max-width: 767px) {
            flex-direction: column;
        }
    `;

    const Box = styled.div`
        height: 146px;
        width: 100%;
        justify-content: space-between;
        align-items: baseline;
        flex-direction: row;
        display: flex;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        text-align: center;
    `;

    const BoxIcon = styled.div`
        font-size: 24px;
        color: #4a90e2;
        margin-bottom: 10px;
    `;

    const BoxValue = styled.div`
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 10px;
    `;

    const BoxLabel = styled.div`
        text-align: justify;
        font-size: 16px;
        color: #666;
    `;

    const ScoreLabel = styled.div`
        font-size: 14px;
        color: #888;
    `;
    let bodyCompositionRecordsdummy = [
        {
            date: '2024-01-15T00:00:00.000Z',
            bmi: '22.5',
            weight: '70.5',
            height: '175.0',
        },
        {
            date: '2024-02-15T00:00:00.000Z',
            bmi: '32.5',
            weight: '70.5',
            height: '175.0',
        },
        {
            date: '2024-03-15T00:00:00.000Z',
            bmi: '52.5',
            weight: '70.5',
            height: '175.0',
        },
    ];
    const bodyCompositionData = {
        labels: bodyCompositionRecords
            ? bodyCompositionRecords.map((record) => moment(record.date).format('MMM'))
            : [],
        datasets: [
            {
                label: trans('athlete.body.bmi'),
                data: bodyCompositionRecords
                    ? bodyCompositionRecords.map((record) => parseFloat(record.bmi))
                    : [],
                borderColor: '#B8E986',
                backgroundColor: 'rgba(184, 233, 134, 0.2)',
                tension: 0, // No curve
                fill: true,
                pointRadius: 4, // Size of the points
                pointHoverRadius: 6, // Size of the points on hover
            },
        ],
    };

    const formatLabel = (date: string) => {
        switch (interval) {
            case '15 days':
                return moment(date)
                    .locale(isRTL ? 'ar' : 'en')
                    .format('DD MMM'); // Arabic format
            case '1 month':
                return moment(date)
                    .locale(isRTL ? 'ar' : 'en')
                    .format('MMM YYYY'); // Arabic format
            case '1 day':
            default:
                return moment(date)
                    .locale(isRTL ? 'ar' : 'en')
                    .format('DD MMM'); // Arabic format
        }
    };

    interface FitnessDataRecord {
        date: string; // ISO 8601 date string
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
        ? (fitnessDataRecords.athleteData as (FitnessDataRecord | AllFitnessDataRecord)[]).filter(
              (record: FitnessDataRecord | AllFitnessDataRecord) => {
                  if (selectedTestType === 'all' && isAllFitnessDataRecord(record)) {
                      // For 'all', check if any fitness test data is greater than 0
                      return (
                          parseFloat(record.push ?? '0') > 0 ||
                          parseFloat(record.curl ?? '0') > 0 ||
                          parseFloat(record.sit ?? '0') > 0 ||
                          parseFloat(record.trunk ?? '0') > 0 ||
                          parseFloat(record.pacer ?? '0') > 0
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
                data: filteredData.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record.push ?? '0') || 0
                        : selectedTestType === 'push' && !isAllFitnessDataRecord(record)
                          ? record.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const ctx = chart.ctx;
                    const chartArea = chart.chartArea;
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
                    const chartArea = chart.chartArea;
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
                        ? parseFloat(record.sit ?? '0') || 0
                        : selectedTestType === 'sit' && !isAllFitnessDataRecord(record)
                          ? record.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const ctx = chart.ctx;
                    const chartArea = chart.chartArea;
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
                data: filteredData.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record.trunk ?? '0') || 0
                        : selectedTestType === 'trunk' && !isAllFitnessDataRecord(record)
                          ? record.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context.chart;
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
                data: filteredData.map((record) =>
                    selectedTestType === 'all' && isAllFitnessDataRecord(record)
                        ? parseFloat(record.pacer ?? '0') || 0
                        : selectedTestType === 'pacer' && !isAllFitnessDataRecord(record)
                          ? record.value
                          : 0,
                ),
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const ctx = chart.ctx;
                    const chartArea = chart.chartArea;
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
                selectedTestType === 'all' || dataset.label === trans(`chart.${selectedTestType}`),
        ),
    };
    const handleDateClick = (clickedDate: any) => {
        const newDate = new Date(clickedDate);
        // Set the clicked date as the startDate and set an appropriate endDate (e.g., 7 days later)
        setStartDate(newDate);
        setEndDate(new Date(newDate.getTime() + 30 * 24 * 60 * 60 * 1000)); // Example: end date is 7 days after the start date
    };
    const DashboardCharts = () => {
        let chartHeight = window.innerWidth < 768 ? 100 : 600; // Adjust based on screen width

        const chartOptions = {
            responsive: true,
            height: chartHeight,

            maintainAspectRatio: false, // Disable to allow better scaling on small screens
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
                            const index = context.dataIndex;
                            const date = filteredData[index]?.date || ''; // Get the date from filteredData
                            const value = context.raw; // Get the value

                            // Format the tooltip label
                            return [
                                `${moment(date).format('MMM DD')}`,
                                `${context.dataset.label}:${value}`,
                            ];
                        },
                        title: function () {
                            // Hide the default title
                            return '';
                        },
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        autoSkip: false, // Ensure all labels are shown
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
                    const index = elements[0].index;
                    const clickedDate = fitnessDataRecords?.athleteData[index].date;
                    handleDateClick(clickedDate);
                }
            },
        } as const;

        return (
            <ChartsContainer>
                <div>
                    <FormGroup>
                        <FormLabel htmlFor="testTypeSelect">
                            {trans('confirm-session.type')}
                        </FormLabel>
                        <select
                            id="testTypeSelect"
                            value={selectedTestType}
                            onChange={handleTestTypeChange}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                width: '150px', // Match the width of FormInput if needed
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                // marginRight: '1rem',
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
                        <FormLabel htmlFor="intervalSelect">
                            {trans('athlete.battery.interval')}
                        </FormLabel>
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
                            }}
                        >
                            <option value="15 days">{trans('athlete.battery.15Days')}</option>
                            <option value="1 month">{trans('athlete.battery.1Month')}</option>
                            <option value="1 day">{trans('athlete.battery.1Day')}</option>
                        </select>
                        <FormLabel htmlFor="startDate">
                            {trans('athlete.health.startDate')}
                        </FormLabel>
                        <FormInput
                            id="startDate"
                            type="date"
                            value={startDate && startDate.toISOString().split('T')[0]} // Handle null value
                            onChange={handleStartDateChange}
                        />
                        <FormLabel htmlFor="endDate">{trans('athlete.health.endDate')}</FormLabel>
                        <FormInput
                            id="endDate"
                            type="date"
                            value={endDateFitnnes && endDateFitnnes.toISOString().split('T')[0]}
                            onChange={handleEndDateChange}
                        />
                    </FormGroup>

                    <div className="chart-wrapper">
                        <Bar data={pushUpsData} options={chartOptions} />
                    </div>
                    {/* {isLoadingFitnessData && <p>Loading...</p>}
                {fitnessDataError && <p>Error loading data</p>} */}
                </div>
            </ChartsContainer>
        );
    };
    const BmiCharts = () => {
        const bmiValues = bodyCompositionRecords
            ? bodyCompositionRecords.map((record) => parseFloat(record.bmi))
            : [];

        // Use Math.min and Math.max with numbers only
        const minBmi = Math.floor(Math.min(...bmiValues) - 2); // Adjust the minimum value
        const maxBmi = Math.floor(Math.max(...bmiValues) + 2);

        const chartBmiOptions = {
            responsive: true,
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
                            const index = context.dataIndex; // Get the index of the hovered point
                            const record = bodyCompositionRecords
                                ? bodyCompositionRecords[index]
                                : null;

                            if (record) {
                                const bmi = formattedScale(context.raw);
                                const weight = record.weight;
                                const height = record.height;

                                // Return an array where each element is a new line
                                return [
                                    `${trans('athlete.body.bmi')}: ${bmi}`,
                                    `${trans('athlete.body.weight')}: ${weight}kg`,
                                    `${trans('athlete.body.height')}: ${height}cm`,
                                ];
                            } else {
                                return `${trans('athlete.body.bmi')}: ${context.raw}`;
                            }
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: false, // Allow the y-axis to adjust dynamically
                    min: minBmi, // Set minimum value dynamically
                    max: maxBmi, // Set maximum value dynamically
                    ticks: {
                        stepSize: 2, // Adjust step size as needed
                    },
                },
            },
        } as const;
        return (
            <ChartsContainer>
                <FormGroup>
                    <FormLabel htmlFor="startDate">{trans('athlete.health.startDate')}</FormLabel>
                    <FormInput
                        id="startDate"
                        type="date"
                        value={
                            bodyCompositionStartDate &&
                            bodyCompositionStartDate.toISOString().split('T')[0]
                        } // Convert date to string format YYYY-MM-DD
                        onChange={handleBodyCompositionStartDateChange}
                    />

                    <FormLabel htmlFor="endDate">{trans('athlete.health.endDate')}</FormLabel>
                    <FormInput
                        id="endDate"
                        type="date"
                        value={
                            bodyCompositionEndDate &&
                            bodyCompositionEndDate.toISOString().split('T')[0]
                        }
                        onChange={handlebodyCompositionEndDate}
                    />
                </FormGroup>
                {/* <h3>{trans('athlete.body')}</h3> */}
                <Line data={bodyCompositionData} options={chartBmiOptions} />
            </ChartsContainer>
        );
    };
    const Dashboard = () => {
        return (
            <BoxContainer>
                <Box>
                    <div>
                        <BoxLabel>{trans('athlete.sessions')}</BoxLabel>
                        <BoxValue>{athleteAnalytic?.sessions?.totalSessions}</BoxValue>
                        <ScoreLabel>
                            {athleteAnalytic?.sessions?.averageSessions} {trans('chart.average')}
                        </ScoreLabel>
                    </div>
                    <BoxIcon>
                        <FaStopwatch />
                    </BoxIcon>
                </Box>
                <Box>
                    <div>
                        <BoxLabel>{trans('athlete.practicing')}</BoxLabel>
                        <BoxValue>{athleteAnalytic?.practicingPercentage}</BoxValue>
                        {/* <ScoreLabel>Good Score</ScoreLabel> */}
                    </div>
                    <BoxIcon>
                        <FaClipboardCheck color={'#7F41C8'} />
                    </BoxIcon>
                </Box>
                <Box>
                    <div>
                        <BoxLabel>{trans('athlete.presence')}</BoxLabel>
                        <BoxValue>
                            {athleteAnalytic?.presencePercentage
                                ? `${athleteAnalytic?.presencePercentage}%`
                                : '-'}
                        </BoxValue>
                        {/* <ScoreLabel>Average Score</ScoreLabel> */}
                    </div>
                    <BoxIcon>
                        <FaUserCheck color={'#60C7AE'} />
                    </BoxIcon>
                </Box>
                <Box>
                    <div>
                        <BoxLabel>{trans('athlete.level')}</BoxLabel>
                        <BoxValue>
                            {athleteAnalytic?.level && athleteAnalytic?.level !== 'Unknown'
                                ? trans(`profileLeveName.${athleteDetails?.level}`)
                                : '-'}
                        </BoxValue>
                    </div>
                    <BoxIcon>
                        <FaFile color={'#C4D251'} />
                    </BoxIcon>
                </Box>
            </BoxContainer>
        );
    };

    const BoxWrap = styled.div`
        display: flex;
        flex-direction: column;
        align-items: baseline;
    `;
    const ValueWrap = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    `;

    const Dashboard2 = () => {
        return (
            <BoxContainer>
                <Box>
                    <BoxWrap>
                        <BoxLabel>{trans('presentSession')}</BoxLabel>
                        <ValueWrap>
                            <BoxValue>{athleteSession?.summary?.presentSessions}</BoxValue>
                            <ScoreLabel>{trans('day')}</ScoreLabel>
                        </ValueWrap>
                    </BoxWrap>
                    <BoxIcon>
                        <FaStopwatch />
                    </BoxIcon>
                </Box>
                <Box>
                    <BoxWrap>
                        <BoxLabel>{trans('absentSessions')}</BoxLabel>
                        <BoxValue>{athleteSession?.summary?.absentSessions}</BoxValue>
                    </BoxWrap>
                    <BoxIcon>
                        <FaClipboardCheck />
                    </BoxIcon>
                </Box>
                <Box>
                    <BoxWrap>
                        <BoxLabel>{trans('injurySessions')}</BoxLabel>
                        <ValueWrap>
                            <BoxValue>{athleteSession?.summary?.injurySessions}</BoxValue>
                            <ScoreLabel>{trans('day')}</ScoreLabel>
                        </ValueWrap>
                    </BoxWrap>
                    <BoxIcon>
                        <FaUserCheck />
                    </BoxIcon>
                </Box>
            </BoxContainer>
        );
    };

    const TrainingLoadChart = () => {
        // Extract labels (weeks) and average scale for each week
        const sessions = athleteAnalytic?.trainingLoad.flatMap((item) => item.sessions) || []; // Flatten the sessions array from all weeks

        // Extract the labels (days) and scale (dot values) from the sessions
        const labels = sessions.map((session) => moment(session.date).format('MMM DD')); // Use moment to format date as 'Jul 23', etc.
        const scaleData = sessions.map((session) => {
            const scale = session.scale ?? 0; // Fallback to 0 if scale is undefined or null
            return Number(scale.toFixed(2)); // Ensure scale is formatted to two decimal places
        });

        const data = {
            labels: labels, // X-axis labels will be the formatted session dates (days)
            datasets: [
                {
                    label: trans('analytics.trainingLoad'), // Label for the dataset
                    data: scaleData, // Y-axis data is the session scale values
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    fill: true,
                    tension: 0,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };

        const options: ChartOptions<'line'> = {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 1, // Y-axis starts from 1
                    max: 10, // Y-axis ends at 10
                    ticks: {
                        stepSize: 1, // Static scale from 1 to 10
                        callback: function (value) {
                            return value as number; // Correct typing for tick callback
                        },
                    },
                },
                x: {
                    ticks: {
                        callback: function (value, index) {
                            return labels[index]; // X-axis labels are the session days
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    display: true, // Show legend with the label
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${trans('session.scale')}: ${formattedScale(context.raw)}`; // Format the number to two decimal places
                        },
                    },
                },
            },
            maintainAspectRatio: false,
            responsive: true, // Ensure chart is responsive
        } as const;

        return (
            <Theme.ChartContainer>
                <div>
                    <Theme.ChartTitle>{trans('athlete.trainingLoad')}</Theme.ChartTitle>
                    <FormGroup>
                        <FormLabel htmlFor="startDate">
                            {trans('athlete.health.startDate')}
                        </FormLabel>
                        <FormInput
                            id="startDate"
                            type="date"
                            value={formattedStartDate ? formattedStartDate : ''} // Convert date to string format YYYY-MM-DD
                            onChange={handleAnalyticStartDateChange}
                        />
                        <FormLabel htmlFor="endDate">{trans('athlete.health.endDate')}</FormLabel>
                        <FormInput
                            id="endDate"
                            type="date"
                            value={formattedEndDate && formattedEndDate}
                            onChange={handleAnalyticEndDateChange}
                        />
                    </FormGroup>

                    {/* {isLoadingFitnessData && <p>Loading...</p>}
                {fitnessDataError && <p>Error loading data</p>} */}
                </div>
                <Line data={data} options={options} />
            </Theme.ChartContainer>
        );
    };
    const DocumentCard = ({ thumbnail, documentType, lastUpdate, item }: any) => {
        const deleteMutation = useDeleteDocument(id, item?.id);
        const handleDeleteDocument = async () => {
            // setLoading(true);

            deleteMutation.mutate(undefined, {
                onSuccess: (response) => {
                    const isSuccess =
                        [200, 204].includes(response.status) ||
                        response?.message === 'Document deleted successfully';

                    queryClient.invalidateQueries({ queryKey: ['athleteDocuments'] });

                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: isSuccess ? 'success' : 'warning',
                                title: isSuccess ? 'Success' : 'Warning',
                                subtitle: isSuccess
                                    ? 'Document deleted successfully'
                                    : response.message || 'An error occurred',
                            },
                        }),
                    );
                },
                onError: (error: Error) => {
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'warning',
                                title: 'Warning',
                                subtitle: error.message || 'An error occurred',
                            },
                        }),
                    );
                },
            });
        };
        return (
            <Theme.DocumentBox>
                {/* <Theme.Thumbnail src={thumbnail} alt="Document Thumbnail" /> */}
                <Theme.DocumentInfo>
                    <Theme.DocumentType>{trans(`documentType.${item?.type}`)}</Theme.DocumentType>
                    <Theme.LastUpdate>
                        {' '}
                        {moment(item?.lastUpdated).format('DD-MM-YYYY')}
                    </Theme.LastUpdate>
                </Theme.DocumentInfo>
                <Theme.Actions>
                    <Theme.ActionIcon onClick={() => window.open(item?.signedUrl, '_blank')}>
                        <FaEye />
                    </Theme.ActionIcon>
                    <Theme.ActionIcon onClick={() => handleUpdateDocs(item?.id)}>
                        <FaEdit />
                    </Theme.ActionIcon>
                    <Theme.ActionIcon onClick={() => handleDeleteDocument()}>
                        <FaTrash />
                    </Theme.ActionIcon>
                </Theme.Actions>
            </Theme.DocumentBox>
        );
    };

    return (
        <Theme.Body>
            <Theme.WrapRecors>
                <Theme.AvatarSection>
                    <Theme.Profile variant="h3" value={trans('addAthlete.profile')} />

                    <WithRole blockRoles={[UserRole.COACH]}>
                        <Theme.EditImg
                            onClick={handleEditProfile}
                            src="/assets/icons/edit.png"
                            alt="eye"
                        />
                    </WithRole>
                    <Theme.Avatar
                        src={athlete?.avatar || getAvatarPlaceholder(athlete?.gender)}
                        alt="avatar"
                    />

                    <Theme.SubBody>
                        <Theme.Name
                            variant="h3"
                            value={`${athlete?.firstName} ${athlete?.lastName}`}
                        />
                    </Theme.SubBody>
                </Theme.AvatarSection>

                <Theme.RecordsContainer>
                    <Theme.StatusTitle>{trans('athlete.records')}</Theme.StatusTitle>
                    <Theme.RecordsTable>
                        <Theme.Thead>
                            <Theme.TrHeader>
                                <Theme.Th>{trans('athlete.personal.category')}</Theme.Th>
                                <Theme.Th>{trans('athlete.personal.subcategory')}</Theme.Th>
                                <Theme.Th> {trans('athlete.personal.personal')}</Theme.Th>
                                <Theme.Th> {trans('athlete.personal.best')}</Theme.Th>
                                <Theme.Th> {trans('athlete.personal.last')}</Theme.Th>
                                <Theme.Th> {trans('athlete.personal.edit')}</Theme.Th>
                            </Theme.TrHeader>
                        </Theme.Thead>
                        <Theme.Tbody>
                            {athleteRecords?.records.map((item, index) => (
                                <Theme.Tr key={index}>
                                    <Theme.Td>{trans(`sport.${item?.category}`)}</Theme.Td>
                                    <Theme.Td>
                                        {item?.subcategory ? item?.subcategory : '-'}
                                    </Theme.Td>
                                    <Theme.Td>{item?.personalRecord}</Theme.Td>
                                    <Theme.Td>{item?.bestRecord}</Theme.Td>
                                    <Theme.Td>{item?.lastRecord}</Theme.Td>
                                    <WithRole blockRoles={[UserRole.COACH]}>
                                        <Theme.UpdateButtonSmall
                                            onClick={() => handleEditRecord(item)}
                                        >
                                            {trans('coach.personal.update')}{' '}
                                        </Theme.UpdateButtonSmall>
                                    </WithRole>
                                </Theme.Tr>
                            ))}
                        </Theme.Tbody>
                    </Theme.RecordsTable>
                    <WithRole blockRoles={[UserRole.COACH]}>
                        <Theme.UpdateButton onClick={handleAddRecord}>
                            {trans('form.addSportProfileType.add')}
                        </Theme.UpdateButton>
                    </WithRole>
                </Theme.RecordsContainer>
                <Theme.StatusContainer>
                    <Theme.StatusContainerWrapper>
                        <Theme.StatusTitle>{trans('links.status')}</Theme.StatusTitle>
                        <WithRole blockRoles={[UserRole.COACH]}>
                            <SubscriptionStatusButton
                                status={athleteSubscription?.status}
                                onClick={handleUpdateSubscription}
                            />
                        </WithRole>
                        <WithRole allowRoles={[UserRole.COACH]}>
                            <SubscriptionStatusButton status={athleteSubscription?.status} />
                        </WithRole>
                    </Theme.StatusContainerWrapper>
                    <Theme.ContractBox>
                        <Theme.Label>{trans('links.contract')}</Theme.Label>
                        {formatDuration(athleteSubscription?.expiryDate, trans)}
                    </Theme.ContractBox>
                    <Theme.AvailabilityBox>
                        <Theme.Label>{trans('links.Availability')}</Theme.Label>
                        {trans(`athlete.profiles.${athlete?.availabilityStatus}`)}
                    </Theme.AvailabilityBox>
                </Theme.StatusContainer>
            </Theme.WrapRecors>
            <Theme.TabsContainer>
                <Theme.TabsWrapper>
                    <Theme.Tabs
                        className={activeTab === 'general-view' ? 'active' : ''}
                        onClick={() => setActiveTab('general-view')}
                    >
                        {trans('athlete.general.view')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'personal-information' ? 'active' : ''}
                        onClick={() => setActiveTab('personal-information')}
                    >
                        {trans('athlete.personal.information')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'personal-documents' ? 'active' : ''}
                        onClick={() => setActiveTab('personal-documents')}
                    >
                        {trans('athlete.personal.documents')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'health' ? 'active' : ''}
                        onClick={() => setActiveTab('health')}
                    >
                        {trans('athlete.health')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'sport-profile' ? 'active' : ''}
                        onClick={() => setActiveTab('sport-profile')}
                    >
                        {trans('athlete.sport.profile')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'punctuality' ? 'active' : ''}
                        onClick={() => setActiveTab('punctuality')}
                    >
                        {trans('athlete.punctuality')}
                    </Theme.Tabs>
                </Theme.TabsWrapper>

                <Theme.TabContent>
                    {activeTab === 'general-view' && (
                        <Theme.InfoWrap>
                            <Dashboard />
                            <Theme.GeneralWrap>
                                <TrainingLoadChart />
                                <AnalyticsChart />
                            </Theme.GeneralWrap>
                        </Theme.InfoWrap>
                    )}
                    {activeTab === 'personal-information' && (
                        <Theme.InfoWrap>
                            <Theme.WrapRecords>
                                <Theme.StatusContainer3>
                                    <Theme.StatusTitle2>
                                        {trans('profile.personalInformation')}
                                    </Theme.StatusTitle2>
                                    {athleteDetails?.firstName && (
                                        <Theme.InfoRow>
                                            <Theme.Label>{trans('profile.name')}:</Theme.Label>{' '}
                                            {athleteDetails.firstName}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.joinDate && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.join')}:
                                            </Theme.Label>{' '}
                                            {stringToDateString(athleteDetails.joinDate)}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.level && (
                                        <Theme.InfoRow>
                                            <Theme.Label>{trans('athlete.level')}:</Theme.Label>{' '}
                                            {trans(`profileLeveName.${athleteDetails?.level}`)}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.experience && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('coach.personal.experience')}:
                                            </Theme.Label>{' '}
                                            {athleteDetails.experience}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.schoolName && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.school')}:
                                            </Theme.Label>{' '}
                                            {athleteDetails.schoolName}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.dateOfBirth && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('form.editAthletePersonalInfo.birth')}:
                                            </Theme.Label>{' '}
                                            {moment(athleteDetails.dateOfBirth).format(
                                                'DD-MM-YYYY',
                                            )}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.education && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.education')}:
                                            </Theme.Label>{' '}
                                            {trans(
                                                `form.editAthletePersonalInfo.${athleteDetails?.education}`,
                                            )}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.gender && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.gender')}:
                                            </Theme.Label>{' '}
                                            {trans(
                                                `gender.${athleteDetails?.gender}`,
                                                athleteDetails?.gender,
                                            )}
                                        </Theme.InfoRow>
                                    )}
                                    {athlete?.playingFor && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.playing')} :
                                            </Theme.Label>{' '}
                                            {athlete.playingFor}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.nin && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.nationalNumber')} :
                                            </Theme.Label>{' '}
                                            {athleteDetails.nin}
                                        </Theme.InfoRow>
                                    )}
                                    {athlete?.ninExpirationDate && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('form.editAthletePersonalInfo.ninExpire')} :
                                            </Theme.Label>{' '}
                                            {moment(athlete?.ninExpirationDate).format(
                                                'DD-MM-YYYY',
                                            )}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.nationality && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.personal.country')} :
                                            </Theme.Label>{' '}
                                            {trans(
                                                `form.editAthleteProfile.${athleteDetails?.nationality}`,
                                            )}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.weight && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.body.weight')} :
                                            </Theme.Label>{' '}
                                            {athleteDetails.weight}
                                        </Theme.InfoRow>
                                    )}
                                    {athleteDetails?.height && (
                                        <Theme.InfoRow>
                                            <Theme.Label>
                                                {trans('athlete.body.height')} :
                                            </Theme.Label>{' '}
                                            {athleteDetails.height}
                                        </Theme.InfoRow>
                                    )}
                                    <WithRole blockRoles={[UserRole.COACH]}>
                                        <Theme.UpdateButton onClick={handleUpdateInfo}>
                                            {athleteDetails
                                                ? trans('coach.personal.update')
                                                : trans('form.addSportProfileType.add')}
                                        </Theme.UpdateButton>
                                    </WithRole>
                                </Theme.StatusContainer3>

                                <Theme.ContainersWrap>
                                    <Theme.StatusContainer3>
                                        <Theme.StatusTitle2>
                                            {trans('form.editAthleteProfile.emergency')}
                                        </Theme.StatusTitle2>
                                        {athleteDetails?.emergencyContact && (
                                            <>
                                                {athleteDetails?.emergencyContact?.name && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {trans('form.editAthleteProfile.name')}:
                                                        </Theme.Label>{' '}
                                                        {athleteDetails?.emergencyContact?.name}
                                                    </Theme.InfoRow>
                                                )}
                                                {athleteDetails.emergencyContact?.relationship && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {trans(
                                                                'form.editAthleteProfile.relationship',
                                                            )}
                                                            :
                                                        </Theme.Label>{' '}
                                                        {trans(
                                                            `form.editAthleteProfile.${athleteDetails?.emergencyContact?.relationship}`,
                                                        )}
                                                    </Theme.InfoRow>
                                                )}
                                                {athleteDetails?.emergencyContact?.phoneNumber && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {trans(
                                                                'form.editAthleteProfile.contactNumber',
                                                            )}
                                                            :
                                                        </Theme.Label>{' '}
                                                        {
                                                            athleteDetails?.emergencyContact
                                                                ?.phoneNumber
                                                        }
                                                    </Theme.InfoRow>
                                                )}
                                                {athleteDetails?.emergencyContact
                                                    ?.nationalNumber && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {trans(
                                                                'athlete.personal.nationalNumber',
                                                            )}
                                                            :
                                                        </Theme.Label>{' '}
                                                        {
                                                            athleteDetails?.emergencyContact
                                                                ?.nationalNumber
                                                        }
                                                    </Theme.InfoRow>
                                                )}
                                            </>
                                        )}
                                        <WithRole blockRoles={[UserRole.COACH]}>
                                            <Theme.UpdateButton onClick={handleAddEmergency}>
                                                {athleteDetails?.emergencyContact
                                                    ? trans('coach.personal.update')
                                                    : trans('form.addSportProfileType.add')}
                                            </Theme.UpdateButton>
                                        </WithRole>
                                    </Theme.StatusContainer3>

                                    <Theme.StatusContainer3>
                                        <Theme.StatusTitle2>
                                            {trans('athlete.clothsData')}
                                        </Theme.StatusTitle2>
                                        {athleteDetails?.athleteClothing && (
                                            <>
                                                {athleteDetails.athleteClothing.tShirtSize && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {trans('athlete.tshirtSize')}:
                                                        </Theme.Label>{' '}
                                                        {athleteDetails.athleteClothing.tShirtSize}
                                                    </Theme.InfoRow>
                                                )}
                                                {athleteDetails.athleteClothing.pantSize && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {' '}
                                                            {trans('athlete.pantSize')}:
                                                        </Theme.Label>{' '}
                                                        {athleteDetails.athleteClothing.pantSize}
                                                    </Theme.InfoRow>
                                                )}
                                                {athleteDetails.athleteClothing.shoeSize && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {trans('athlete.shoesSize')}:
                                                        </Theme.Label>{' '}
                                                        {athleteDetails.athleteClothing.shoeSize}
                                                    </Theme.InfoRow>
                                                )}
                                                {athleteDetails.athleteClothing.driFitSize && (
                                                    <Theme.InfoRow>
                                                        <Theme.Label>
                                                            {trans('athlete.driFit')}:
                                                        </Theme.Label>{' '}
                                                        {athleteDetails.athleteClothing.driFitSize}
                                                    </Theme.InfoRow>
                                                )}
                                            </>
                                        )}
                                        <WithRole blockRoles={[UserRole.COACH]}>
                                            <Theme.UpdateButton onClick={handleAddClothing}>
                                                {athleteDetails?.athleteClothing
                                                    ? trans('coach.personal.update')
                                                    : trans('form.addSportProfileType.add')}
                                            </Theme.UpdateButton>
                                        </WithRole>
                                    </Theme.StatusContainer3>
                                </Theme.ContainersWrap>
                            </Theme.WrapRecords>

                            <Theme.StatusContainer3>
                                <Theme.StatusTitle2>{trans('athlete.bankData')}</Theme.StatusTitle2>
                                {athleteDetails?.bankDetails && (
                                    <>
                                        {athleteDetails.bankDetails.iban && (
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.ibanNumber')}:
                                                </Theme.Label>
                                                {athleteDetails.bankDetails.iban}
                                            </Theme.InfoRow>
                                        )}
                                        {athleteDetails.bankDetails.bank && (
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.bankName')}:
                                                </Theme.Label>{' '}
                                                {trans(`bank.${athleteDetails.bankDetails.bank}`)}
                                            </Theme.InfoRow>
                                        )}
                                        {athleteDetails.bankDetails.accountHolder && (
                                            <Theme.InfoRow>
                                                <Theme.Label>
                                                    {trans('athlete.accountOwner')}:
                                                </Theme.Label>{' '}
                                                {athleteDetails.bankDetails.accountHolder}
                                            </Theme.InfoRow>
                                        )}
                                    </>
                                )}
                                <WithRole blockRoles={[UserRole.COACH]}>
                                    <Theme.UpdateButton onClick={handleAddBank}>
                                        {athleteDetails?.bankDetails
                                            ? trans('coach.personal.update')
                                            : trans('form.addSportProfileType.add')}
                                    </Theme.UpdateButton>
                                </WithRole>
                            </Theme.StatusContainer3>
                        </Theme.InfoWrap>
                    )}
                    {activeTab === 'personal-documents' && (
                        <div>
                            {' '}
                            <WithRole blockRoles={[UserRole.COACH]}>
                                <Theme.UpdateButton onClick={handleAddDocs}>
                                    {trans('form.addSportProfileType.add')}
                                </Theme.UpdateButton>
                            </WithRole>
                            <Theme.documentsContainer>
                                {athleteDoccument?.payload.map((doc, index) => (
                                    <DocumentCard
                                        item={doc}
                                        key={doc.id}
                                        type={doc.type}
                                        url={doc.url}
                                        lastUpdated={doc.lastUpdated}
                                    />
                                ))}
                            </Theme.documentsContainer>
                        </div>
                    )}
                    {activeTab === 'health' && (
                        <Theme.HealethWrap>
                            <Theme.StatusContainer3>
                                <Theme.StatusTitle2>
                                    {trans('athlete.medicalInformation')}
                                </Theme.StatusTitle2>

                                <Theme.InfoRowHealth>
                                    <Theme.Label>{trans('athlete.medical.allergies')}</Theme.Label>{' '}
                                    {trans(
                                        `athlete.truthyValue.${athleteMedicalInfo?.medicalInfo?.allergies}`,
                                    )}
                                </Theme.InfoRowHealth>

                                <Theme.InfoRowHealth>
                                    <Theme.Label>
                                        {trans('athlete.medical.foodAllergies')}
                                    </Theme.Label>{' '}
                                    {athleteMedicalInfo?.medicalInfo?.foodAllergies
                                        ? trans(
                                              `foodAllergies.${athleteMedicalInfo?.medicalInfo?.foodAllergies}`,
                                          )
                                        : '-'}
                                    {athleteMedicalInfo?.medicalInfo?.foodAllergiesUrl && (
                                        <Theme.FileIcon
                                            onClick={() =>
                                                window.open(
                                                    athleteMedicalInfo?.medicalInfo
                                                        ?.foodAllergiesUrl,
                                                    '_blank',
                                                )
                                            }
                                        >
                                            <FaFileAlt />
                                            {trans('athlete.medical.medicalFile')}
                                        </Theme.FileIcon>
                                    )}
                                </Theme.InfoRowHealth>

                                <Theme.InfoRowHealth>
                                    <Theme.Label>{trans('athlete.medical.chronic')}</Theme.Label>
                                    {athleteMedicalInfo?.medicalInfo?.chronic
                                        ? //  trans(
                                          //       `athlete.truthyValue.${athleteMedicalInfo?.medicalInfo?.chronic}`,
                                          //   )
                                          trans(
                                              `athlete.truthyValue.${
                                                  athleteMedicalInfo?.medicalInfo?.chronic?.length >
                                                  0
                                                      ? 'yes'
                                                      : 'no'
                                              }`,
                                          )
                                        : '-'}
                                </Theme.InfoRowHealth>

                                <Theme.InfoRowHealth>
                                    <Theme.Label>
                                        {trans('athlete.medical.consideration')}
                                    </Theme.Label>{' '}
                                    {trans(
                                        `form.editMedicalInfo.${athleteMedicalInfo?.medicalInfo?.consideration}`,
                                    )}
                                    {athleteMedicalInfo?.medicalInfo?.considerationUrl && (
                                        <Theme.FileIcon
                                            onClick={() =>
                                                window.open(
                                                    athleteMedicalInfo?.medicalInfo
                                                        ?.considerationUrl,
                                                    '_blank',
                                                )
                                            }
                                        >
                                            <FaFileAlt />
                                            {trans('athlete.medical.medicalFile')}
                                        </Theme.FileIcon>
                                    )}
                                </Theme.InfoRowHealth>

                                <WithRole blockRoles={[UserRole.COACH]}>
                                    <Theme.UpdateButton onClick={handleUpdateMedical}>
                                        {athlete
                                            ? trans('coach.personal.update')
                                            : trans('form.addSportProfileType.add')}
                                    </Theme.UpdateButton>
                                </WithRole>
                            </Theme.StatusContainer3>
                            <Theme.TableContainer3 id="table-to-export">
                                <Theme.TableFilterContainer3>
                                    <Theme.StatusTitle2>
                                        {trans('athlete.health')}
                                    </Theme.StatusTitle2>

                                    <Theme.ReportButton
                                        onClick={() => exportPDF(athlete?.firstName)}
                                    >
                                        {trans('athlete.profiles.report')}
                                    </Theme.ReportButton>
                                </Theme.TableFilterContainer3>
                                <Theme.Table2>
                                    <thead>
                                        <tr>
                                            <Theme.TableHeader2>
                                                {trans('athlete.medical.updating')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('athlete.medical.type')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('athlete.medical.description')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('athlete.medical.startDay')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('athlete.medical.endDay')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('athlete.medical.medicalRecommendation')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>{''}</Theme.TableHeader2>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {athleteHealthRecords?.records?.map((record, index) => (
                                            <Theme.TableRow2 id={`row-${record.id}`} key={index}>
                                                <Theme.TableData2>
                                                    <strong>
                                                        {' '}
                                                        {new Date(
                                                            record?.dateOfUpdating,
                                                        ).toLocaleDateString()}
                                                    </strong>
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    {trans(`session.${record?.type}`)}
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    {record?.description}
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    {record?.startDate}
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    {record?.endDate}
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    {record?.medicalRecommendation}
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    <WithRole blockRoles={[UserRole.COACH]}>
                                                        <Theme.UpdateButtonSmall
                                                            onClick={() =>
                                                                handleEditHtealthRecord(record)
                                                            }
                                                        >
                                                            {trans('coach.personal.update')}{' '}
                                                        </Theme.UpdateButtonSmall>
                                                    </WithRole>
                                                    <Theme.UpdateButtonSmall
                                                        onClick={() => handleExportRow(record)}
                                                    >
                                                        {trans('athlete.profiles.report')}
                                                    </Theme.UpdateButtonSmall>
                                                </Theme.TableData2>
                                            </Theme.TableRow2>
                                        ))}
                                    </tbody>
                                </Theme.Table2>
                                <WithRole blockRoles={[UserRole.COACH]}>
                                    <Theme.UpdateButton onClick={handleAddHealthRecord}>
                                        {trans('form.addSportProfileType.add')}
                                    </Theme.UpdateButton>
                                </WithRole>
                            </Theme.TableContainer3>
                        </Theme.HealethWrap>
                    )}
                    {activeTab === 'sport-profile' && (
                        <Theme.InfoWrap>
                            <ProfilesCard athlete={athlete} profiles={athleteProfilesArray} />

                            {/* <h3>{trans('athlete.battery')}</h3> */}
                            <FitnessBatteryTable athleteBatteryArray={athleteBatteryArray} />

                            <FitnessBatteryChart batteryData={athleteBatteryArray} />
                            <DashboardCharts />
                            <BodyInfoTable athleteBioArray={athleteBioArray} athlete={athlete} />

                            <BmiCharts />
                        </Theme.InfoWrap>
                    )}
                    {activeTab === 'punctuality' && (
                        <Theme.InfoWrap>
                            <Dashboard2 />
                            <Theme.TableContainer3>
                                <Theme.Table2>
                                    <thead>
                                        <tr>
                                            <Theme.TableHeader2>
                                                {trans('form.addFitnessBattery.date')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('session.athleteStatus')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {' '}
                                                {trans('session.type')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('session.scale')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {' '}
                                                {trans('session.exertion')}
                                            </Theme.TableHeader2>
                                            <Theme.TableHeader2>
                                                {trans('session.comment')}
                                            </Theme.TableHeader2>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {athleteSessionRecords?.records.map((record, index) => (
                                            <Theme.TableRow2 key={record.id}>
                                                <Theme.TableData2>
                                                    <strong>
                                                        {new Date(
                                                            record.session.date,
                                                        ).toLocaleDateString()}
                                                    </strong>
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    <StatusIndicator
                                                        key={`${index}${record.status}`}
                                                        isActive={true}
                                                    />
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    {trans(
                                                        `session.${record.session.type}`,
                                                        record.session.type,
                                                    )}
                                                </Theme.TableData2>
                                                <Theme.TableData2> {record.scale}</Theme.TableData2>
                                                <Theme.TableData2>
                                                    <Theme.TableData2>
                                                        {' '}
                                                        {trans(
                                                            `session.${getScaleExertion(
                                                                String(record.scale),
                                                            )}`,
                                                        )}
                                                    </Theme.TableData2>
                                                </Theme.TableData2>
                                                <Theme.TableData2>
                                                    {record.comment || '-'}
                                                </Theme.TableData2>
                                            </Theme.TableRow2>
                                        ))}
                                    </tbody>
                                </Theme.Table2>
                            </Theme.TableContainer3>
                        </Theme.InfoWrap>
                    )}
                </Theme.TabContent>
            </Theme.TabsContainer>

            {/* <div> */}

            {/* </div> */}
            {/* <AthletePersonalInfoTable athlete={athlete} /> */}

            {/* <MedicalInfoTable athlete={athlete} /> */}

            {/* <ProfilesCard athlete={athlete} profiles={athleteProfilesArray} />

            <Theme.SectionDivider>
                <FitnessBatteryTable athleteBatteryArray={athleteBatteryArray} />
                <FitnessBatteryChart batteryData={athleteBatteryArray} />
            </Theme.SectionDivider>

            <BodyInfoTable athleteBioArray={athleteBioArray} athlete={athlete} /> */}
        </Theme.Body>
    );
};
