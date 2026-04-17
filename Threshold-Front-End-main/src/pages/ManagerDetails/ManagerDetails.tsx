import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { router } from 'routers';

import HeaderSection from './components/HeaderSection/HeaderSection';
import { ProfileSection } from './components/ProfileSection/ProfileSection';

import { Loader } from 'components';
import {
    useFetchPersonalInfoById,
    useFetchContactInfoById,
    useFetchMedicalInfoById,
    useFetchDocumentsById,
    useFetchManagerDetailsById,
    useFetchManagerContractDetails,
    useGetBankData,
} from 'services/hooks/managerDetails';
import { useFetchTeamsTable } from 'services/hooks/teams/useFetchTeamsList';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { WorkHistory } from './components/workHistory/WorkHistory';
import { useBreadcrumbs } from 'hooks/breadcrumbs';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

export const ManagerDetails = () => {
    const { trans } = useLocales();
    const [columns, setColumns] = useState<Column[]>([]);
    const [columnsTwo, setColumnsTwo] = useState<any>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [activeTab, setActiveTab] = useState('profile');
    const { academy } = useSelector(selectAcademy);
    const {
        params: { academyId, id },
    } = router.getState();

    const {
        data: managerDetails,
        isLoading: managerDetailsLoading,
        error: managerDetailsError,
    } = useFetchManagerDetailsById(academyId, id);

    const {
        data: personalInfo,
        isLoading: personalInfoLoading,
        error: personalInfoError,
    } = useFetchPersonalInfoById(academyId, id);
    const {
        data: contactInfo,
        isLoading: contactInfoLoading,
        error: contactInfoError,
    } = useFetchContactInfoById(academyId, id);

    const {
        data: medicalInfo,
        isLoading: medicalInfoLoading,
        error: medicalInfoError,
    } = useFetchMedicalInfoById(academyId, id);

    const {
        data: documents,
        isLoading: documentsLoading,
        error: documentsError,
    } = useFetchDocumentsById(academyId, id);
    const {
        data: contractDate,
        isLoading: contractIsLoading,
        error: contractError,
    } = useFetchManagerContractDetails(academyId, id);
    const {
        data: bankData,
        isLoading: bankDataLoading,
        error: bankDataError,
    } = useGetBankData(academyId, id);
    // const {
    //     data: teamsData,
    //     isLoading: teamIsLoading,
    //     error,
    // } = useFetchTeamsTable(sportId, page, limit);
    // const { data } = useClubList(academy?.id);
    // const filteredSport: any = data?.payload?.find((club: any) => club?.id === sportId);

    useEffect(() => {
        setColumns([
            {
                key: 'startDate',
                label: trans('manager.profile.details.startDate'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'endDate',
                label: trans('manager.profile.details.endDate'),
                width: '15%',
                sortable: false,
            },
            {
                key: 'manageType',
                label: trans('manager.profile.details.manageType'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'sportType',
                label: trans('manager.profile.details.sportType'),
                width: '15%',
                sortable: true,
            },
            {
                key: 'contractStatus',
                label: trans('manager.profile.details.contractStatus'),
                width: '15%',
                sortable: true,
            },
        ]);
    }, [trans, activeTab]);

    // if (
    //     coachDetailsLoading ||
    //     personalInfoLoading ||
    //     contactInfoLoading ||
    //     medicalInfoLoading ||
    //     documentsLoading ||
    //     teamIsLoading
    // ) {
    //     return <Loader />;
    // }
    useBreadcrumbs(
        [
            { label: trans('breadcrumbs.home'), path: 'home' },
            { label: trans('breadcrumbs.manager'), path: 'manager', params: { academyId } },
            {
                label: id,
                path: `/manager-details`,
                params: { academyId, id },
            },
        ],
        trans,
    );
    return (
        <Theme.CoachDetailsBody>
            <HeaderSection
                managerDetails={managerDetails}
                // contractStatus={contactInfo?.payload?.contractDetails?.status}
                // sport={filteredSport?.sport}
                // academyName={academy?.name}
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
                        className={activeTab === 'workHistory' ? 'active' : ''}
                        onClick={() => setActiveTab('workHistory')}
                    >
                        {trans('manager.profile.details.workHistory')}
                    </Theme.Tabs>
                </Theme.TabsWrapper>
                <Theme.TabContent>
                    {activeTab === 'profile' && (
                        <ProfileSection
                            personalInfo={personalInfo?.payload}
                            contactInfo={contactInfo?.payload}
                            documents={documents?.payload}
                            contractDate={contractDate?.payload}
                            bankData={bankData?.data?.payload}
                            managerDetails={managerDetails}
                        />
                    )}
                    {activeTab === 'workHistory' && <WorkHistory columns={columns} />}
                </Theme.TabContent>
            </Theme.TabsContainer>
        </Theme.CoachDetailsBody>
    );
};
