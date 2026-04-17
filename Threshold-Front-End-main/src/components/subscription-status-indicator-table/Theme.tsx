import styled from 'styled-components';
import { SubscriptionStatus } from 'libs/enums/athlete';

const statusColors = {
    [SubscriptionStatus.ACTIVE]: '#28a745',
    [SubscriptionStatus.INACTIVE]: '#6c757d',
    [SubscriptionStatus.PENDING]: '#ffc107',
    [SubscriptionStatus.EXPIRED]: '#dc3545',
};

const textColors = {
    [SubscriptionStatus.ACTIVE]: '#fff',
    [SubscriptionStatus.INACTIVE]: '#fff',
    [SubscriptionStatus.PENDING]: '#000',
    [SubscriptionStatus.EXPIRED]: '#fff',
};

export const StatusButton = styled.div<{ status: SubscriptionStatus }>`
    background-color: ${({ status }) => statusColors[status]};
    color: ${({ status }) => textColors[status]};
    padding: 5px 10px;
    border-radius: 15px;
    width: 8rem;
    font-size: 0.7em;
    text-align: center;
`;
