import React, { useEffect, useState } from 'react';
import * as Theme from './theme';
import { useLocales } from 'hooks/locales';
import { useRoute } from 'react-router5';
import { Divider } from 'components/modal-windows';
import { router } from 'routers';
import { useDispatch } from 'react-redux';
import { setBreadCrumps, switchActiveTab } from 'store/controlsSlice';
import { ActiveTab } from 'libs/enums';
import { replace } from 'lodash';

interface MenuItem {
    name: string;
    iconPath: string;
    path: string;
    id: string;
    children?: MenuItem[];
}

interface DynamicAsideMenuProps {
    menuData: MenuItem[];
    onMenuSelect: (name: string, sportId: string) => void;
    menuOpen?: boolean;
}

export const DynamicAsideMenu: React.FC<DynamicAsideMenuProps> = ({
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
            setSelectedMenu(route.path.split('/'));
            setSelectedMenuId(route?.params?.sportId);
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
    const handleSwitchTab = (activeTab: any) => {
        dispatch(switchActiveTab({ activeTab }));
        dispatch(setBreadCrumps({ breadCrumps: [activeTab] }));
    };
    return (
        <Theme.ContentWrapper>
            <Theme.MenuContainer>
                <Divider />
                {menuData?.map((menuItem, index) => (
                    <div key={index}>
                        <Theme.MenuItem
                            onClick={() => {
                                toggleMenu(menuItem.name);
                                router.navigate(
                                    'overview',
                                    { sportId: menuItem.id },
                                    { replace: true },
                                );
                            }}
                            style={{
                                backgroundColor:
                                    selectedMenuId === menuItem.id ? '#c0d33030' : 'transparent',
                            }}
                        >
                            <Theme.MenuIcon src={menuItem.iconPath} alt={menuItem.name} />
                            {menuOpen && (
                                <Theme.MenuText>{trans(`sport.${menuItem.name}`)}</Theme.MenuText>
                            )}
                            {menuOpen && menuItem.children && (
                                <img
                                    src={
                                        expandedMenus[menuItem.name]
                                            ? '/assets/icons/side-down-icon.svg'
                                            : '/assets/icons/side-up-icon.svg'
                                    }
                                    alt="dropdown icon"
                                    width={16}
                                    height={16}
                                />
                            )}
                        </Theme.MenuItem>
                        {menuItem?.children && expandedMenus?.[menuItem?.name] && (
                            <Theme.SubMenu>
                                {menuItem?.children?.map((childItem, childIndex) => (
                                    <Theme.SubMenuItem
                                        key={childIndex}
                                        onClick={() =>
                                            handleMenuClick(childItem?.path, menuItem?.id)
                                        }
                                    >
                                        <Theme.MenuIcon
                                            src={childItem.iconPath}
                                            alt={childItem.name}
                                            style={{
                                                filter:
                                                    childItem?.path &&
                                                    selectedMenu.includes(childItem.path) &&
                                                    selectedMenuId === menuItem.id
                                                        ? 'brightness(0) saturate(100%) invert(76%) sepia(43%) saturate(456%) hue-rotate(29deg) brightness(90%) contrast(86%)'
                                                        : 'none',
                                            }}
                                        />
                                        {menuOpen && (
                                            <Theme.MenuNestedText
                                                style={{
                                                    color:
                                                        childItem?.path &&
                                                        selectedMenu.includes(childItem.path) &&
                                                        selectedMenuId === menuItem.id
                                                            ? '#c0d330'
                                                            : '',
                                                }}
                                            >
                                                {trans(childItem.name, {
                                                    defaultValue: childItem.name,
                                                })}
                                            </Theme.MenuNestedText>
                                        )}
                                    </Theme.SubMenuItem>
                                ))}
                            </Theme.SubMenu>
                        )}
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
