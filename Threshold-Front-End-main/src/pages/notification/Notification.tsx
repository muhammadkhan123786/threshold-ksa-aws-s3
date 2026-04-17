import React, { useEffect } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useFetchNotifications, useMarkAllAsSeen } from 'services/hooks';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { Loader } from 'components';

export const Notification: React.FC = () => {
    const { trans } = useLocales();
    const { academy } = useSelector(selectAcademy);
    const academyId = academy.id;
    const { data: result = { notifications: [] }, isLoading } = useFetchNotifications(academy.id);
    const { mutate: markAllAsSeen } = useMarkAllAsSeen();

    const reversedNotifications = [...(result.notifications || [])].reverse();

    useEffect(() => {
        return () => {
            if (academyId) {
                markAllAsSeen(academyId);
            }
        };
    }, []);

    if (isLoading) return <Loader />;

    return (
        <Theme.Body>
            <Theme.NotificationMenuContainer>
                {reversedNotifications.length > 0 ? (
                    reversedNotifications.map((notification) => (
                        <Theme.NotificationItemWrapper
                            key={notification.id}
                            seen={notification.seen}
                        >
                            <Theme.TitleWrapper>
                                <Theme.TitleAvatarWrapper>
                                    <Theme.AvatarWrapper>
                                        <img src="/assets/icons/add-square.svg" alt="avatar" />
                                    </Theme.AvatarWrapper>
                                    <Theme.NotificationTitleWrapper>
                                        <Theme.NotificationItemTitle>
                                            {notification?.title}
                                        </Theme.NotificationItemTitle>
                                        <Theme.NotificationItemDate>
                                            {notification.createdAt}
                                        </Theme.NotificationItemDate>
                                    </Theme.NotificationTitleWrapper>
                                </Theme.TitleAvatarWrapper>
                                {!notification.seen && (
                                    <Theme.TitleStatus>
                                        {trans('notifications.new')}
                                    </Theme.TitleStatus>
                                )}
                            </Theme.TitleWrapper>
                            <Theme.NotificationItemBody>
                                {notification.message}
                            </Theme.NotificationItemBody>
                        </Theme.NotificationItemWrapper>
                    ))
                ) : (
                    <Theme.NotificationItemBody>
                        {trans('notifications.empty')}
                    </Theme.NotificationItemBody>
                )}
            </Theme.NotificationMenuContainer>
        </Theme.Body>
    );
};

export default Notification;
