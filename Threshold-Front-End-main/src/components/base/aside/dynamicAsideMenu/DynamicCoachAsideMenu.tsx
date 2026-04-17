import React, { useEffect, useState } from 'react';
import * as Theme from './theme';
import { useLocales } from 'hooks/locales';
import { useRoute } from 'react-router5';
import { Divider } from 'components/modal-windows';
import { router } from 'routers';
import { useDispatch } from 'react-redux';
import { setBreadCrumps, switchActiveTab } from 'store/controlsSlice';
import { ActiveTab } from 'libs/enums';

interface MenuItem {
    name: string;
    iconPath: string;
    path: string;
    id: string;
    children?: MenuItem[];
    sportId: string;
}

interface DynamicCoachAsideMenuProps {
    menuData: MenuItem[];
    onMenuSelect: (name: string, sportId: string) => void;
    menuOpen?: boolean;
}

export const DynamicCoachAsideMenu: React.FC<DynamicCoachAsideMenuProps> = ({
    menuData,
    menuOpen,
    onMenuSelect,
}) => {
    const { route } = useRoute();
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    const [selectedMenu, setSelectedMenu] = useState<any>(null);
    const [selectedMenuId, setSelectedMenuId] = useState<any>(null);
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();
    // Load expanded menus from localStorage on component mount
    useEffect(() => {
        const storedExpandedMenus = localStorage.getItem('expandedMenus');
        if (storedExpandedMenus) {
            setExpandedMenus(JSON.parse(storedExpandedMenus));
        }
    }, []);

    // Save expanded menus to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('expandedMenus', JSON.stringify(expandedMenus));
    }, [expandedMenus]);

    const toggleMenu = (menuName: string) => {
        setExpandedMenus((prevState) => ({
            [menuName]: !prevState[menuName],
        }));
    };

    useEffect(() => {
        if (route?.path) {
            // Only update if we're not already on team-details
            if (!selectedMenu?.includes('team-details')) {
                setSelectedMenu(route.path.split('/'));
                setSelectedMenuId(route?.params?.id); // Change from sportId to id
            }
        }
    }, [route]);

    const handleMenuClick = (menuPath: string, menuId: string) => {
        setSelectedMenu(menuPath);
        onMenuSelect(menuPath, menuId);
        handleSwitchTab(menuPath);
    };

    const handleContactUsClick = () => {
        router.navigate('contact-us', { replace: true });
    };
    const handleTeamDetailsClick = (menuItem: MenuItem) => {
        // Update states before navigation
        setSelectedMenu(['team-details']);
        setSelectedMenuId(menuItem.id);
        // Navigate after state updates
        setTimeout(() => {
            router.navigate(`team-details`, { id: menuItem.id, sportId: menuItem.sportId });
        }, 0);
    };

    const handleCalendarClick = () => {
        router.navigate('overview', { replace: true });
        handleSwitchTab(ActiveTab.OVERVIEW);
    };

    const handleScheduleClick = () => {
        router.navigate('schedule', { replace: true });
        handleSwitchTab(ActiveTab.SCHEDULE);
    };

    const handleSwitchTab = (activeTab: any) => {
        dispatch(switchActiveTab({ activeTab }));
        dispatch(setBreadCrumps({ breadCrumps: [activeTab] }));
    };

    return (
        <Theme.ContentWrapper>
            <Theme.MenuContainer>
                <Theme.MenuItem
                    onClick={handleCalendarClick}
                    style={{
                        backgroundColor: selectedMenu?.includes('overview')
                            ? '#c0d33030'
                            : 'transparent',
                    }}
                >
                    <Theme.MenuIcon
                        src="/assets/icons/menu/overview-icon.svg"
                        alt="calender-icon"
                        style={{
                            filter: selectedMenu?.includes('overview')
                                ? 'brightness(0) saturate(100%) invert(76%) sepia(43%) saturate(456%) hue-rotate(29deg) brightness(90%) contrast(86%)'
                                : 'none',
                        }}
                    />
                    {menuOpen && (
                        <Theme.MenuText
                            style={{
                                color: selectedMenu?.includes('overview') ? '#c0d330' : '',
                            }}
                        >
                            {trans('menu.overview')}
                        </Theme.MenuText>
                    )}
                </Theme.MenuItem>
                <Theme.MenuItem
                    onClick={handleScheduleClick}
                    style={{
                        backgroundColor: selectedMenu?.includes('schedule')
                            ? '#c0d33030'
                            : 'transparent',
                    }}
                >
                    <Theme.MenuIcon
                        src="/assets/icons/menu/schedule.svg"
                        alt="tasks-icon"
                        style={{
                            filter: selectedMenu?.includes('schedule')
                                ? 'brightness(0) saturate(100%) invert(76%) sepia(43%) saturate(456%) hue-rotate(29deg) brightness(90%) contrast(86%)'
                                : 'none',
                        }}
                    />
                    {menuOpen && (
                        <Theme.MenuText
                            style={{
                                color: selectedMenu?.includes('schedule') ? '#c0d330' : '',
                            }}
                        >
                            {trans('menu.Schedule')}
                        </Theme.MenuText>
                    )}
                </Theme.MenuItem>
                <Divider />
                {menuData?.map((menuItem, index) => (
                    <div key={index}>
                        <Theme.MenuItem
                            onClick={() => handleTeamDetailsClick(menuItem)}
                            style={{
                                backgroundColor:
                                    selectedMenu?.includes('team-details') &&
                                    selectedMenuId === menuItem.id
                                        ? '#c0d33030'
                                        : 'transparent',
                            }}
                        >
                            <Theme.MenuIcon
                                src={menuItem.iconPath}
                                alt={menuItem.name}
                                style={{
                                    filter:
                                        selectedMenu?.includes('team-details') &&
                                        selectedMenuId === menuItem.id
                                            ? 'brightness(0) saturate(100%) invert(76%) sepia(43%) saturate(456%) hue-rotate(29deg) brightness(90%) contrast(86%)'
                                            : 'none',
                                }}
                            />
                            {menuOpen && (
                                <Theme.MenuText
                                    style={{
                                        color:
                                            selectedMenu?.includes('team-details') &&
                                            selectedMenuId === menuItem.id
                                                ? '#c0d330'
                                                : '',
                                    }}
                                >
                                    {menuItem.name}
                                </Theme.MenuText>
                            )}
                        </Theme.MenuItem>
                    </div>
                ))}
            </Theme.MenuContainer>
            {/* Contact Us Tab */}
            <div className="mt-auto w-full">
                <Divider />
                <Theme.MenuItemContact onClick={handleContactUsClick}>
                    <Theme.MenuIcon src="/assets/icons/contact-us.svg" alt="contact-us" />
                    {menuOpen && <Theme.MenuText>{trans('contact.us')}</Theme.MenuText>}
                </Theme.MenuItemContact>
            </div>
        </Theme.ContentWrapper>
    );
};
