import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getSessionRecords = ({
    academyId,
    sessionId,
    page = 0,
    capacity = 5,
    sortBy = 'createdAt',
    status,
}: DataPayload & { academyId?: string; sessionId?: string; status?: string }) => {
    return requestAsyncThunk({
        storeName: 'sessionRecord',
        _url: `/sessionRecords?sortBy=${sortBy}&${academyId ? `academy[id]=${academyId}&` : '&'}${
            sessionId ? `session[id]=${sessionId}&` : '&'
        }page=${page}&capacity=${capacity}${status ? `&status=${status}` : ''}&descendants=athlete`, // Include status parameter in the URL if provided
        method: 'GET',
    });
};

export const getSessionRecordById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'sessionRecord',
        _url: `/sessionRecords/${id}`,
        method: 'GET',
    });
};

export const createSessionRecord = (): any => {
    return requestAsyncThunk({
        storeName: 'sessionRecord',
        _url: `/sessionRecords`,
        method: 'POST',
    });
};

export const updateSessionRecord = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'sessionRecord',
        _url: `/sessionRecords/${id}`,
        method: 'PATCH',
    });
};
