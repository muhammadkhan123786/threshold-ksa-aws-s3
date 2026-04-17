import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { router } from 'routers';

import HeaderSection from './components/HeaderSection/HeaderSection';
import { ProfileSection } from './components/ProfileSection/ProfileSection';
import SessionHistory from './components/SessionHistory/SessionHistory';
import { useFetchCoachDetailsById } from 'services/hooks';
import { Loader } from 'components';
import {
    useFetchPersonalInfoById,
    useFetchContactInfoById,
    useFetchMedicalInfoById,
    useFetchDocumentsById,
} from 'services/hooks/coachDetails';
import { useFetchTeamsTable } from 'services/hooks/teams/useFetchTeamsList';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { useFetchCoachContractDetails } from 'services/hooks/coach/useFetchCoachContractDetails';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const CoachDetails = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [columnsTwo, setColumnsTwo] = useState<any>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [activeTab, setActiveTab] = useState('profile');
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();

    const {
        data: coachDetails,
        isLoading: coachDetailsLoading,
        error: coachDetailsError,
    } = useFetchCoachDetailsById(sportId, id);

    const {
        data: personalInfo,
        isLoading: personalInfoLoading,
        error: personalInfoError,
    } = useFetchPersonalInfoById(sportId, id);
    const {
        data: contactInfo,
        isLoading: contactInfoLoading,
        error: contactInfoError,
    } = useFetchContactInfoById(sportId, id);

    const {
        data: medicalInfo,
        isLoading: medicalInfoLoading,
        error: medicalInfoError,
    } = useFetchMedicalInfoById(sportId, id);

    const {
        data: documents,
        isLoading: documentsLoading,
        error: documentsError,
    } = useFetchDocumentsById(sportId, id);

    const {
        data: teamsData,
        isLoading: teamIsLoading,
        error,
    } = useFetchTeamsTable(sportId, page, limit);
    const {
        data: contractDate,
        isLoading: contractIsLoading,
        error: contractError,
    } = useFetchCoachContractDetails(sportId, id);
    const { data } = useClubList(academy?.id);
    const filteredSport: any = data?.payload?.find((club: any) => club?.id === sportId);

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
        } else if (activeTab === 'sessionHistory') {
            setColumns([
                {
                    key: 'date',
                    label: trans('coach.table.date'),
                    width: '15%',
                    sortable: false,
                },
                {
                    key: 'type',
                    label: trans('coach.table.teamCategory'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'level',
                    label: trans('coach.table.sessionType'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'position',
                    label: trans('coach.table.attendance'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'avg',
                    label: trans('coach.table.avgPE'),
                    width: '15%',
                    sortable: true,
                },
                {
                    key: 'comment',
                    label: trans('coach.table.status'),
                    width: '15%',
                    sortable: true,
                },
            ]);
        }
    }, [trans, activeTab]);

    if (
        coachDetailsLoading ||
        personalInfoLoading ||
        contactInfoLoading ||
        medicalInfoLoading ||
        documentsLoading ||
        teamIsLoading
    ) {
        return <Loader />;
    }

    return (
        <Theme.CoachDetailsBody>
            <HeaderSection
                coachDetails={coachDetails}
                contractStatus={contactInfo?.payload?.contractDetails?.status}
                sport={filteredSport?.sport}
                academyName={academy?.name}
                personalInfo={personalInfo?.payload}
            />
            <Theme.TabsContainer>
                <Theme.TabsWrapper>
                    <Theme.Tabs
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        {trans('coach.profile')}
                    </Theme.Tabs>
                    <Theme.Tabs
                        className={activeTab === 'sessionHistory' ? 'active' : ''}
                        onClick={() => setActiveTab('sessionHistory')}
                    >
                        {trans('coach.sessionHistory')}
                    </Theme.Tabs>
                </Theme.TabsWrapper>
                <Theme.TabContent>
                    {activeTab === 'profile' && (
                        <ProfileSection
                            coachDetails={coachDetails}
                            personalInfo={personalInfo?.payload}
                            contactInfo={contactInfo?.payload}
                            documents={documents?.payload}
                            teamsData={teamsData}
                            contractDate={contractDate?.payload}
                        />
                    )}
                    {activeTab === 'sessionHistory' && (
                        <SessionHistory columns={columns} coachDetails={coachDetails} />
                    )}
                </Theme.TabContent>
            </Theme.TabsContainer>
        </Theme.CoachDetailsBody>
    );
};
