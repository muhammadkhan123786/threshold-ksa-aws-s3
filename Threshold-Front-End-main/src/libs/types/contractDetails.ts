import { ContractDuration, ContractStatus } from 'libs/enums/contract';

export type ContractDetails = {
    id: string;
    joinDate: string;
    durationPeriod: ContractDuration;
    status: ContractStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
};
