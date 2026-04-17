import React from 'react';
import { SubscriptionStatus } from 'libs/enums/athlete';
import { useLocales } from 'hooks/locales';
import { StatusButton } from './Theme';

interface SubscriptionStatusButtonProps {
    status?: SubscriptionStatus;
    onClick?: () => void;
}

export const SubscriptionStatusTableIndicator: React.FC<SubscriptionStatusButtonProps> = ({
    status = SubscriptionStatus.INACTIVE,
    onClick,
}) => {
    const { trans } = useLocales();

    const statusMessages = {
        [SubscriptionStatus.ACTIVE]: trans('form.subscriptionManagement.status.active'),
        [SubscriptionStatus.INACTIVE]: trans('form.subscriptionManagement.status.inactive'),
        [SubscriptionStatus.PENDING]: trans('form.subscriptionManagement.status.pending'),
        [SubscriptionStatus.EXPIRED]: trans('form.subscriptionManagement.status.expired'),
    };

    return (
        <StatusButton status={status} onClick={onClick}>
            {trans('form.subscriptionManagement.statusMessage', { status: statusMessages[status] })}
        </StatusButton>
    );
};
