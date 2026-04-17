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

interface ManagerAsideMenuProps {
    onMenuSelect: (name: string, sportId: string) => void;
    menuOpen?: boolean;
}

export const ManagerAsideMenu: React.FC<ManagerAsideMenuProps> = ({ menuOpen, onMenuSelect }) => {
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

    const handleCalendarClick = () => {
        router.navigate('calendar', { replace: true });
        handleSwitchTab(ActiveTab.CALENDAR);
    };

    const handleTasksClick = () => {
        router.navigate('tasks', { replace: true });
        handleSwitchTab(ActiveTab.TASKS);
    };

    const handleSwitchTab = (activeTab: any) => {
        dispatch(switchActiveTab({ activeTab }));
        dispatch(setBreadCrumps({ breadCrumps: [activeTab] }));
    };

    return (
        <>
            <Theme.MenuContainer>
                <Theme.MenuItem
                    onClick={handleCalendarClick}
                    style={{
                        backgroundColor: selectedMenu?.includes('calendar')
                            ? '#c0d33030'
                            : 'transparent',
                    }}
                >
                    <Theme.MenuIcon
                        src="/assets/icons/menu/calender.svg"
                        alt="calendar-icon"
                        style={{
                            filter: selectedMenu?.includes('calendar')
                                ? 'brightness(0) saturate(100%) invert(76%) sepia(43%) saturate(456%) hue-rotate(29deg) brightness(90%) contrast(86%)'
                                : 'none',
                        }}
                    />
                    {menuOpen && (
                        <Theme.MenuText
                            style={{
                                color: selectedMenu?.includes('calendar') ? '#c0d330' : '',
                            }}
                        >
                            {trans('menu.calendar')}
                        </Theme.MenuText>
                    )}
                </Theme.MenuItem>
                <Theme.MenuItem
                    onClick={handleTasksClick}
                    style={{
                        backgroundColor: selectedMenu?.includes('tasks')
                            ? '#c0d33030'
                            : 'transparent',
                    }}
                >
                    <Theme.MenuIcon
                        src="/assets/icons/menu/tasks.svg"
                        alt="tasks-icon"
                        style={{
                            filter: selectedMenu?.includes('tasks')
                                ? 'brightness(0) saturate(100%) invert(76%) sepia(43%) saturate(456%) hue-rotate(29deg) brightness(90%) contrast(86%)'
                                : 'none',
                        }}
                    />
                    {menuOpen && (
                        <Theme.MenuText
                            style={{
                                color: selectedMenu?.includes('tasks') ? '#c0d330' : '',
                            }}
                        >
                            {trans('menu.tasks')}
                        </Theme.MenuText>
                    )}
                </Theme.MenuItem>
            </Theme.MenuContainer>
        </>
    );
};
