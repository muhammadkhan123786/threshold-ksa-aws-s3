import { ActiveTab, UserRole } from 'libs/enums';

export const ASIDE_TABS: {
    name: ActiveTab;
    iconPath: string;
    roles: UserRole[];
}[] = [
    {
        name: ActiveTab.DASHBOARD,
        iconPath: '/assets/icons/dashboard-aside-icon.svg',
        roles: [UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN, UserRole.ADMIN_MANAGER],
    },
    {
        name: ActiveTab.SCHEDULE,
        iconPath: '/assets/icons/calendar.svg',
        roles: [UserRole.COACH],
    },
    {
        name: ActiveTab.ATHLETE_LIST,
        iconPath: '/assets/icons/athlete-list-icon.png',
        roles: [UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER, UserRole.COACH],
    },
    {
        name: ActiveTab.COACH_LIST,
        iconPath: '/assets/icons/coach-list-icon.png',
        roles: [UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER],
    },
    {
        name: ActiveTab.TEAM_LIST,
        iconPath: '/assets/icons/teams-list-icon.png',
        roles: [UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER, UserRole.COACH],
    },
    {
        name: ActiveTab.BRANCH,
        iconPath: '/assets/icons/feedbacks-icon.png',
        roles: [UserRole.ACADEMY_ADMIN],
    },
    {
        name: ActiveTab.ACADEMY_PROFILE,
        iconPath: '/assets/icons/academy-icon.png',
        roles: [UserRole.ACADEMY_ADMIN, UserRole.CLUB_ADMIN],
    },

    {
        name: ActiveTab.CONTACTS,
        iconPath: '/assets/icons/contacts-icon.png',
        roles: [UserRole.ACADEMY_ADMIN, UserRole.COACH],
    },
    {
        name: ActiveTab.PUBLIC_ATHLETE_LINKS,
        iconPath: '/assets/icons/feedbacks-icon.png',
        roles: [UserRole.ACADEMY_COORDINATOR],
    },
    {
        name: ActiveTab.APPROVAL_USERS,
        iconPath: '/assets/icons/feedbacks-icon.png',
        roles: [UserRole.ACADEMY_COORDINATOR],
    },
    {
        name: ActiveTab.FEEDBACKS,
        iconPath: '/assets/icons/feedbacks-icon.png',
        roles: [UserRole.ACADEMY_COORDINATOR],
    },
    {
        name: ActiveTab.ADMIN_PROFILE,
        iconPath: '/assets/icons/profile-icon.png',
        roles: [
            UserRole.ACADEMY_ADMIN,
            UserRole.ADMIN_MANAGER,
            UserRole.ACADEMY_COORDINATOR,
            UserRole.COACH,
        ],
    },
];
