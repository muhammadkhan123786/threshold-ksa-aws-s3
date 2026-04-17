import { AuthState } from './auth';

export type Payload<PayloadType> = {
    payload?: {
        data?: {
            [x: string]: any;
            payload?: PayloadType;
        };
    };
};

export type StoreState = {
    auth?: AuthState;
};

export type BackendResponse = {
    error: null | { message: string };
    payload: {
        payload: any;
        message: string;
        status: number;
    };
};

export type DataPayload = {
    page?: number;
    capacity?: number;
    sortBy?: string;
};

export interface PaginationQuery {
    academyId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}
