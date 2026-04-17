import { UserRole } from 'libs/enums';
import { Academy } from './academy';

export type AuthState = {
    entities?: {
        access_token: string;
    } & User;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    currentRequestId: number | undefined;
    error: any[] | undefined;
    status?: number;
    tempToken?: any | undefined;
    refreshCounter?: boolean | undefined;
};

export type User = {
    userId?: string;
    email?: string;
    username?: string;
    role: UserRole;
    phoneNumber?: string;
    avatar?: string;
    language?: string;
    notification?: boolean;
    academy: Academy;
};

export interface ApprovalUser extends User {
    id: string;
    isApproved: boolean;
}

export interface AdminManager {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
