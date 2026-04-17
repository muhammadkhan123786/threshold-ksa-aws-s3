import styled from 'styled-components';
import { SubscriptionStatus } from 'libs/enums';

const statusColors = {
    [SubscriptionStatus.ACTIVE]: '#28a745',
    [SubscriptionStatus.INACTIVE]: '#6c757d',
    [SubscriptionStatus.PENDING]: '#ffc107',
    [SubscriptionStatus.EXPIRED]: '#dc3545',
};

export const StatusButton = styled.button<{ status: SubscriptionStatus }>`
    background-color: ${({ status }) => statusColors[status]};
    margin-inline-start: 20px;
    font-size: 15px;
    padding: 10px 16px;
    background-color: transparent;
    border-radius: 8px;
    color: ${({ status }) => statusColors[status]};
    border: ${({ status }) => `1px solid ${statusColors[status]}`};
    font-size: 1em;
    &:hover {
        opacity: 0.8;
    }
`;
