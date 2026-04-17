/* eslint-disable no-undef */
import { useDispatch, useSelector } from 'react-redux';
import * as Theme from './Theme';
import { selectControls } from 'store';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';
import { ActiveTab } from 'libs/enums';
import { setBreadCrumps, switchActiveTab } from 'store/controlsSlice';
import { useRoute } from 'react-router5';
import { useEffect, useState } from 'react';

export const TabButton = ({
    item: { name, iconPath },
    last,
    menuOpen,
    setMenuOpen,
    onClick,
    ...rest
}: {
    item: { name: any; iconPath: string };
    onClick?: () => void;
    setMenuOpen?: any;
    last?: boolean;
    menuOpen?: boolean;
}) => {
    const { route } = useRoute();
    const dispatch = useDispatch<any>();
    const { activeTab } = useSelector(selectControls);
    const [routePath, setRoutePath] = useState<Boolean>(false);
    const handleReplaceAllHistoryEntries = () => {
        window.history.replaceState({}, '', 'home');
        router.navigate('home', { replace: true });
    };
    const handleSwitchTab = (activeTab: ActiveTab) => {
        dispatch(switchActiveTab({ activeTab }));
        dispatch(setBreadCrumps({ breadCrumps: [activeTab] }));
        handleReplaceAllHistoryEntries();
    };

    const { trans } = useLocales();
    useEffect(() => {
        if (route?.path) {
            if (route.path === '/') {
                setRoutePath(true);
            } else {
                setRoutePath(false);
            }
        }
    }, [route]);

    return (
        <Theme.Tab
            style={{
                backgroundColor: activeTab === name ? '#c0d33030' : 'transparent',
            }}
            $isActive={activeTab === name}
            $last={last}
            onClick={() => (onClick ? onClick() : handleSwitchTab(name))}
            $isButton={true}
            $menuOpen={menuOpen}
            {...rest}
        >
            <Theme.TabIcon menuOpen={menuOpen} src={iconPath} alt={name} />
            {menuOpen && <Theme.TabText variant="p" value={trans(`home.${name}TR`)} />}
        </Theme.Tab>
    );
};
