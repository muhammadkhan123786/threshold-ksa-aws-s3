import React, { useEffect } from 'react';
import * as Theme from './ThemeMobile';
import { TabButton } from '../tabButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from 'store/authSlice';
import { router } from 'routers';
import { setModalContent } from 'store/controlsSlice';
import useFilteredTabs from 'hooks/filterTabs/useFilteredTabs';
import { WithRole } from 'hooks/roles';
import { UserRole } from 'libs/enums';
import { Loader } from 'components/loader';
import { DynamicAsideMenuMobile } from './dynamicAsideMenu/DynamicAsideMenuMobile';
import { useRemapClubProfilesToMenuItems } from './dynamicAsideMenu/useRemapClubProfilesToMenuItems';
import { isEmpty } from 'lodash';

interface AsideProps {
    toggleMenu: () => void;
    menuOpen: boolean;
}

export const AsideMobile: React.FC<AsideProps> = ({ toggleMenu, menuOpen }) => {
    const dispatch = useDispatch();
    const { entities, academy, modalContent, isRTL } = useSelector((state: any) => ({
        entities: selectAuth(state).entities,
        academy: state.academy.academy,
        modalContent: state.controls.modalContent,
        isRTL: state.locales.isRTL,
    }));

    const { result, loading } = useRemapClubProfilesToMenuItems(academy.id);
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
            <Theme.Logo onClick={toggleMenu} src={'/assets/icons/close-icon.svg'} alt="logo" />
            <Theme.Body isRTL={isRTL}>
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
                        <DynamicAsideMenuMobile
                            menuOpen={menuOpen}
                            menuData={(result as any) || []}
                            onMenuSelect={handleOnClickAction}
                        />
                    )}
                </WithRole>
            </Theme.Body>
        </Theme.Container>
    );
};
