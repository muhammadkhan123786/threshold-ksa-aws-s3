import { selectControls } from 'store';
import * as Theme from './Theme';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import {
    Dashboard,
    AthleteList,
    TeamsList,
    CoachList,
    AcademyProfile,
    Contacts,
    Feedbacks,
    ApprovalUsers,
    SchedulePage,
    PublicAthleteLinks,
    BranchList,
    AddSessionPage,
    SessionTemplates,
    TemplateSettings,
    Clothes,
    StockClothes,
    Manager,
    Players,
    PlayersDetails,
    Coaches,
    Teams,
    Administrator,
    TeamDetails,
    SessionInvitedPlayer,
    CoachDetails,
    AdministratorDetails,
    SessionDetails,
    ContactUs,
    ManagerDetails,
} from 'pages';
import { Overview } from 'pages/overview';

export const Home = () => {
    const { activeTab } = useSelector(selectControls);

    const ComponentMap: { [key: string]: ReactNode } = {
        dashboard: <Dashboard />,
        schedule: <SchedulePage />,
        athleteList: <AthleteList />,
        teamList: <TeamsList />,
        coachList: <CoachList />,
        academyProfile: <AcademyProfile />,
        adminProfile: <></>,
        contacts: <Contacts />,
        feedbacks: <Feedbacks />,
        'approval-users': <ApprovalUsers />,
        'public-athlete-links': <PublicAthleteLinks />,
        branch: <BranchList />,
        'add-sesstion-page': <AddSessionPage />,
        'add-sesstion-page/templates': <SessionTemplates />,
        'add-sesstion-page/templates/template-settings': <TemplateSettings />,
        clothes: <Clothes />,
        'stock-clothes': <StockClothes />,
        manager: <Manager />,
        Players: <Players />,
        'players-details': <PlayersDetails />,
        coaches: <Coaches />,
        teams: <Teams />,
        administrator: <Administrator />,
        'team-details': <TeamDetails />,
        'invited-player': <SessionInvitedPlayer />,
        'coach-details': <CoachDetails />,
        'manager-details': <ManagerDetails />,
        'administrator-details': <AdministratorDetails />,
        'session-details': <SessionDetails />,
        'contact-us': <ContactUs />,
        overview: <Overview />,
    };

    return <Theme.Body>{ComponentMap[activeTab]}</Theme.Body>;
};
