import React, { useEffect } from 'react';
import * as Theme from './Theme';
import { TabButton } from '../tabButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from 'store/authSlice';
import { router } from 'routers';
import { setModalContent } from 'store/controlsSlice';
import useFilteredTabs from 'hooks/filterTabs/useFilteredTabs';
import { WithRole } from 'hooks/roles';
import { UserRole } from 'libs/enums';
import { Loader } from 'components/loader';
import { DynamicAsideMenu } from './dynamicAsideMenu/DynamicAsideMenu';
import { useRemapClubProfilesToMenuItems } from './dynamicAsideMenu/useRemapClubProfilesToMenuItems';
import { isEmpty } from 'lodash';
import { DynamicCoachAsideMenu } from './dynamicAsideMenu/DynamicCoachAsideMenu';
import { ManagerAsideMenu } from './dynamicAsideMenu/ManagerAsideMenu';

interface AsideProps {
    toggleMenu: () => void;
    menuOpen: boolean;
}

const fakeTeamData = [
    {
        id: 'team1',
        sportId: 'sport1',
        name: 'Team A',
        iconPath: '/assets/icons/menu/teams-icon.svg',
        path: 'teams',
    },
    {
        id: 'team2',
        sportId: 'sport2',
        name: 'Team B',
        iconPath: '/assets/icons/menu/teams-icon.svg',
        path: 'teams',
    },
];

export const Aside: React.FC<AsideProps> = ({ toggleMenu, menuOpen }) => {
    const dispatch = useDispatch();
    const { entities, academy, modalContent, isRTL } = useSelector((state: any) => ({
        entities: selectAuth(state).entities,
        academy: state.academy.academy,
        modalContent: state.controls.modalContent,
        isRTL: state.locales.isRTL,
    }));

    const { result, loading } = useRemapClubProfilesToMenuItems(academy?.id);
    const filteredTabs = useFilteredTabs(entities?.role, academy);
    const handleOnClickAction = (path: string, sportId: string) => {
        if (isEmpty(path)) {
            alert('حالياً غير متاح، وسيتم إضافته في القريب العاجل');
        }
        router.navigate(path, { sportId }, { replace: true });
    };
    useEffect(() => {
        if (modalContent.type === 'none' && modalContent.redirect?.condition) {
            const { id, path } = modalContent.redirect;
            router.navigate(path, id ? { id } : {});
            dispatch(setModalContent({ modalContent: { redirect: undefined } }));
        }
    }, [modalContent.type, modalContent.redirect, dispatch]);

    return (
        <Theme.Container $menuOpen={menuOpen} isRTL={isRTL}>
            <Theme.Body isRTL={isRTL}>
                <Theme.Logo
                    onClick={toggleMenu}
                    src={menuOpen ? '/assets/icons/aside-logo-black.png' : '/assets/icons/logo.svg'}
                    alt="logo"
                />
                <WithRole
                    allowRoles={[
                        UserRole.CLUB_COACH_HEAD,
                        UserRole.CLUB_COACH_ASSISTANT,
                        UserRole.CLUB_COACH_TRAINER,
                        UserRole.CLUB_COACH_ANALYST,
                    ]}
                >
                    {/* {isPending ? (
                        <Loader />
                    ) : ( */}
                    <DynamicCoachAsideMenu
                        menuOpen={menuOpen}
                        menuData={fakeTeamData}
                        onMenuSelect={handleOnClickAction}
                    />
                    {/* )} */}
                </WithRole>
                <WithRole
                    allowRoles={[
                        UserRole.CLUB_EXECUTIVE_MANAGER,
                        UserRole.CLUB_TECHNICAL_DIRECTOR,
                        UserRole.CLUB_SPORT_PROFILE_MANAGER,
                        UserRole.CLUB_ADMIN_ASSISTANT,
                        UserRole.CLUB_ADMIN_MANAGER,
                    ]}
                >
                    <ManagerAsideMenu menuOpen={menuOpen} onMenuSelect={handleOnClickAction} />
                </WithRole>
                {filteredTabs.slice(0, -1).map((item, index) => (
                    <TabButton
                        item={item}
                        setMenuOpen={toggleMenu}
                        key={`ListOption key: ${index}`}
                        menuOpen={menuOpen}
                    />
                ))}
                <WithRole allowRoles={[UserRole.CLUB_ADMIN]}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <DynamicAsideMenu
                            menuOpen={menuOpen}
                            menuData={result as any}
                            onMenuSelect={handleOnClickAction}
                        />
                    )}
                </WithRole>
            </Theme.Body>
        </Theme.Container>
    );
};
