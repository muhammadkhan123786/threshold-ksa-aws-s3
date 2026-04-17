import { useEffect } from 'react';
import { usePageStructure } from 'hooks';
import { LockLoader } from 'pages';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getI18n } from 'react-i18next';
import * as AppTheme from './Theme';
import { useRouter } from 'react-router5';
import { ActiveTab, UserRole } from 'libs/enums';
import { setBreadCrumps } from 'store/controlsSlice';
import { setDeviceId } from 'store/localesSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreState } from 'libs/types';

function App() {
    const queryClient = new QueryClient();
    const I18n = getI18n();
    const { lang, isRTL } = useSelector<any>((state) => state?.locales) as any;

    const { Layout, Page } = usePageStructure();
    const dispatch = useDispatch();
    const router = useRouter();
    const { name } = router.getState();
    const user = useSelector((state: StoreState) => state.auth?.entities);

    const routeNameMapping: { [key: string]: string[] } = {
        home: [],
        profile: [],
        addAthlete: [ActiveTab.ATHLETE_LIST, 'Add Athlete'],
        athlete: [ActiveTab.ATHLETE_LIST, 'Athlete Details'],
        Players: [ActiveTab.PLAYERS, 'Players'],
        addTeam: [ActiveTab.TEAM_LIST, 'Add Team'],
        addCoach: [ActiveTab.COACH_LIST, 'Add Coach'],
        team: [ActiveTab.TEAM_LIST, 'Team Details'],
        session: [ActiveTab.TEAM_LIST, 'Team Details', 'Session Details'],
        coach: [ActiveTab.COACH_LIST, 'Coach Details'],
        branch: [ActiveTab.BRANCH_LIST, 'Branch Details'],
    };

    useEffect(() => {
        dispatch(
            setBreadCrumps({
                breadCrumps: routeNameMapping[name],
            }),
        );
        dispatch(setDeviceId());

        // Handle initial routing after login
        if (name === 'home') {
            // Redirect coach roles to overview page
            const coachRoles = [
                UserRole.CLUB_COACH_HEAD,
                UserRole.CLUB_COACH_ASSISTANT,
                UserRole.CLUB_COACH_TRAINER,
                UserRole.CLUB_COACH_ANALYST,
            ];

            if (user?.role && coachRoles.includes(user.role as UserRole)) {
                router.navigate('overview');
            } else {
                // For other roles, redirect to dashboard/home
                router.navigate('dashboard');
            }
        }
    }, [user?.role, name]);
    useEffect(() => {
        I18n.changeLanguage(lang);
    }, [lang]);

    return (
        <AppTheme.Body>
            <HelmetProvider>
                <Helmet>
                    <html lang={lang} dir={isRTL ? 'rtl' : 'ltr'} />
                    <title>Threshold</title>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100..900&family=Passion+One:wght@400;700;900&display=swap"
                        rel="stylesheet"
                    />
                    <link rel="icon" href="/assets/icons/logo.png" sizes="any" />
                </Helmet>
            </HelmetProvider>
            <AppTheme.Body>
                <QueryClientProvider client={queryClient}>
                    <LockLoader />
                    <Layout>
                        <Page />
                    </Layout>
                </QueryClientProvider>
            </AppTheme.Body>
            <ToastContainer rtl={isRTL} style={{ zIndex: 10123132132 }} />
        </AppTheme.Body>
    );
}

export default App;
