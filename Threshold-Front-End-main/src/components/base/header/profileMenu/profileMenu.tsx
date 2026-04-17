import { useDispatch, useSelector } from 'react-redux';
import { getAvatarPlaceholder } from 'libs/constants';
import { StoreState } from 'libs/types';
import { Gender, UserRole } from 'libs/enums';
import { router } from 'routers';
import { resetAction, switchActiveTab } from 'store/controlsSlice';
import { authSlice, selectAuth } from 'store/authSlice';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useCallback, useState } from 'react';
import { useLayer } from 'react-laag';
import { WithRole } from 'hooks/roles';
import { resetLocalesAction } from 'store/localesSlice';
import { resetAction as resetActionAcademy } from 'store/academySlice';

export const ProfileMenu = () => {
    const { entities } = useSelector(selectAuth);
    const user = useSelector((state: StoreState) => state.auth?.entities);
    const dispatch = useDispatch<any>();
    const { isRTL, trans } = useLocales();
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(true);
    const { triggerProps, layerProps, renderLayer } = useLayer({
        isOpen,
        onOutsideClick: () => setIsOpen(false),
        onDisappear: () => setIsOpen(false),
        auto: true,
        placement: 'bottom-end',
        triggerOffset: 10,
    });

    const handleLogout = useCallback(() => {
        dispatch(authSlice.actions.clearAuthData());
        dispatch(resetLocalesAction());
        dispatch(resetAction());
        dispatch(resetActionAcademy());
        window.history.replaceState({}, '', 'home');
        router.navigate('signin', {}, { reload: true });
    }, [dispatch]);

    const handleAvatarClick = () => {
        if (entities?.userId) {
            dispatch(switchActiveTab({ activeTab: 'adminProfile' }));
            router.navigate('profile', { id: entities?.userId }, { replace: true });
        }
        setIsOpen(false);
    };
    console.log(user);
    console.log(isRTL);
    return (
        <Theme.DropdownContainer>
            <button
                type="button"
                className="flex w-full justify-center items-center h-full"
                {...triggerProps}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div className="flex w-full justify-center items-center">
                    <Theme.AvatarImage
                        alt="avatar"
                        src={user?.avatar || getAvatarPlaceholder(Gender.MALE)}
                    />
                    <div className="flex w-full items-end flex-col">
                        <div className="text-gray-900 text-[20px] font-semibold capitalize">
                            {user?.username || ''}
                        </div>
                        <div className="text-zinc-500 text-[12px] font-normal capitalize w-full text-start">
                            {trans(user?.role || '')}
                        </div>
                    </div>
                </div>
                <img
                    src="/assets/icons/arrow-down-icon.svg"
                    alt="dropdown icon"
                    width={16}
                    height={16}
                    className="ms-[16px]"
                />
            </button>

            {isOpen &&
                renderLayer(
                    <Theme.DropdownContent {...layerProps} isOpen={isOpen}>
                        <Theme.MenuItem
                            className="flex w-full items-center justify-start"
                            onClick={handleAvatarClick}
                        >
                            <img className="me-[10px]" src="/assets/icons/email-icon.svg" alt="" />
                            {user?.email}
                        </Theme.MenuItem>
                        <Theme.MenuItem
                            className="flex w-full items-center justify-start"
                            onClick={handleAvatarClick}
                        >
                            <img className="me-[10px]" src="/assets/icons/phone-icon.svg" alt="" />
                            {user?.academy?.contactNumber}
                        </Theme.MenuItem>
                        <Theme.MenuItem onClick={handleAvatarClick}>
                            {trans('profile.editPersonalData')}
                        </Theme.MenuItem>
                        <Theme.MenuLine />
                        <Theme.MenuItem
                            className="flex w-full items-center justify-between"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEnglish(!isEnglish);
                            }}
                        >
                            {trans('profile.language')}
                            <div className="relative inline-flex items-center cursor-pointer">
                                {/* Track */}
                                <div
                                    className={`w-18 h-6 ${
                                        isEnglish ? 'bg-[#C0D330]' : 'bg-gray-200'
                                    } rounded-full transition-colors duration-300 flex items-center px-0.5`}
                                >
                                    {/* Language Text */}
                                    <span
                                        className={`text-xs font-semibold mx-1 transition-colors duration-300 ${
                                            isEnglish ? 'text-white' : 'text-[#C0D330]'
                                        } ${isEnglish ? 'order-1' : 'order-0'}`}
                                    >
                                        {isEnglish ? 'English' : 'العربية'}
                                    </span>
                                    {/* Thumb */}
                                    <div
                                        className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                            isEnglish ? 'translate-x-0' : 'translate-x-0'
                                        }`}
                                    ></div>
                                </div>
                            </div>
                        </Theme.MenuItem>
                        <Theme.MenuItem
                            className="flex w-full items-center justify-between"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDarkMode(!isDarkMode);
                            }}
                        >
                            {trans('profile.darkmode')}
                            <div className="relative inline-flex items-center cursor-pointer">
                                {/* Track */}
                                <div
                                    className={`w-16 h-6 ${
                                        isDarkMode ? 'bg-[#C0D330]' : 'bg-gray-200'
                                    } rounded-full transition-colors duration-300 flex items-center px-0.5`}
                                >
                                    {/* Language Text */}
                                    <span
                                        className={`text-xs font-semibold mx-1 transition-colors duration-300 ${
                                            isDarkMode ? 'text-white' : 'text-[#C0D330]'
                                        } ${isDarkMode ? 'order-1' : 'order-0'}`}
                                    >
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                    {/* Thumb */}
                                    <div
                                        className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                            isDarkMode ? 'translate-x-0' : 'translate-x-0'
                                        }`}
                                    ></div>
                                </div>
                            </div>
                        </Theme.MenuItem>
                        <Theme.MenuLine />
                        <WithRole allowRoles={[UserRole.CLUB_ADMIN]}>
                            <Theme.MenuItem
                                className="flex w-full items-center justify-between"
                                onClick={() => {
                                    router.navigate('clubProfile');
                                    setIsOpen(false);
                                }}
                            >
                                {trans('profile.clubProfile')}
                                {isRTL ? (
                                    <Theme.Icon
                                        src="/assets/icons/left-arrow.svg"
                                        className="me-[10px]"
                                        alt="left Icon"
                                    />
                                ) : (
                                    <Theme.Icon
                                        src="/assets/icons/next-icon.svg"
                                        className="me-[10px]"
                                        alt="right Icon"
                                    />
                                )}
                            </Theme.MenuItem>
                        </WithRole>
                        <Theme.MenuLine />
                        <Theme.MenuItem
                            className="flex w-full items-center justify-between"
                            onClick={handleLogout}
                        >
                            {trans('home.logout')}
                            <img className="me-[10px]" src="/assets/icons/logout.svg" alt="" />
                        </Theme.MenuItem>
                    </Theme.DropdownContent>,
                )}
        </Theme.DropdownContainer>
    );
};
