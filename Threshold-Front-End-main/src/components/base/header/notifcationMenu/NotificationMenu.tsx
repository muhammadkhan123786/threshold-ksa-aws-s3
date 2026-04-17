import React, { useEffect } from 'react';
import * as Theme from './Theme';
import { useFetchNotifications } from 'services/hooks';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { toast } from 'react-toastify';
import { useRouter } from 'react-router5';

const NotificationMenu: React.FC = () => {
    const { academy } = useSelector(selectAcademy);
    const router = useRouter();
    const { data: result = { notifications: [] } } = useFetchNotifications(academy.id);

    const unseenNotifications = (result.notifications || []).filter(
        (notification) => !notification.seen,
    );

    const unseenCount = unseenNotifications.length;

    const toggleMenu = () => {
        router.navigate('notification');
    };

    useEffect(() => {
        if (unseenNotifications?.length) {
            toast.info(unseenNotifications[unseenNotifications?.length - 1].message);
        }
    }, [unseenNotifications?.length]);

    return (
        <Theme.Body>
            <Theme.NotificationIcon onClick={toggleMenu} badgeNumber={unseenCount}>
                <img src="/assets/icons/notification-icon.svg" alt="notification-icon" />
            </Theme.NotificationIcon>
        </Theme.Body>
    );
};

export default NotificationMenu;
