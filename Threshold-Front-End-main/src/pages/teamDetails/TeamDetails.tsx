import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { router } from 'routers';
import { Vision } from 'components/teamsDetailsTabsAndComponants/Vision';
import { Gallery } from 'components/teamsDetailsTabsAndComponants/Gallery';
import { Players } from 'components/teamsDetailsTabsAndComponants/Players';
import { Sessions } from 'components/teamsDetailsTabsAndComponants/Sessions';
import { NextSesstion } from 'components/teamsDetailsTabsAndComponants/nextSesstion';
import { HeaderTeam } from 'components/teamsDetailsTabsAndComponants/headerTeamComponant';
import { useFetchTeamSession } from 'services/hooks/teamSession/useFetchTeamSession';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { useFetchClubTeamsIdDetails } from 'services/hooks/teams/useFetchClubTeamsIdDetails';

export const TeamDetails = () => {
    const { trans } = useLocales();
    const [activeTab, setActiveTab] = useState<string>('Vision');
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    const { data: TeamSession, isLoading, error } = useFetchTeamSession(id);
    const {
        data: TeamDetails,
        isLoading: loadingDetails,
        error: errorDetails,
    } = useFetchClubTeamsIdDetails(sportId, id);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Vision':
                return <Vision data={TeamSession || []} />;
            // case 'Gallery':
            //     return <Gallery />;
            case 'Players':
                return <Players />;
            case 'Sessions':
                return <Sessions />;
            default:
                return <Vision data={TeamSession || []} />;
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              { label: trans('breadcrumbs.teams'), path: 'teams', params: { sportId } },
              {
                  label: id,
                  path: `/team-details`,
                  params: { sportId, id },
              },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    return (
        <div>
            <HeaderTeam teamDetails={TeamDetails?.data} />
            {/* NextSesstion */}
            {/* <NextSesstion /> */}
            <Theme.TabsWrapper style={{ display: 'flex', cursor: 'pointer' }}>
                <Theme.Tabs
                    className={activeTab === 'Vision' ? 'active' : ''}
                    onClick={() => handleTabChange('Vision')}
                    role="tab"
                    aria-selected={activeTab === 'Vision'}
                >
                    {trans('tab.vision')}
                </Theme.Tabs>
                {/* <Theme.Tabs
                    className={activeTab === 'Gallery' ? 'active' : ''}
                    onClick={() => handleTabChange('Gallery')}
                    role="tab"
                    aria-selected={activeTab === 'Gallery'}
                >
                    {trans('tab.gallery')}
                </Theme.Tabs> */}
                <Theme.Tabs
                    className={activeTab === 'Players' ? 'active' : ''}
                    onClick={() => handleTabChange('Players')}
                    role="tab"
                    aria-selected={activeTab === 'Players'}
                >
                    {trans('tab.players')}
                </Theme.Tabs>
                <Theme.Tabs
                    className={activeTab === 'Sessions' ? 'active' : ''}
                    onClick={() => handleTabChange('Sessions')}
                    role="tab"
                    aria-selected={activeTab === 'Sessions'}
                >
                    {trans('tab.sessions')}
                </Theme.Tabs>
            </Theme.TabsWrapper>
            {renderTabContent()}
        </div>
    );
};
