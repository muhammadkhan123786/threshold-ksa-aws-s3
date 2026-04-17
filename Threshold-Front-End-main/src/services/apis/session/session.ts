import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getSessions = ({
    academyId,
    teamId,
    page = 1,
    capacity = 5,
    sortBy = 'date',
}: DataPayload & { academyId?: string; teamId?: string }) => {
    return requestAsyncThunk({
        storeName: 'session',
        _url: `/sessions?page=1&limit=100000&sortBy=${sortBy}&reverse=true${
            academyId ? `academy=${academyId}&` : '&'
        }${teamId ? `teamId=${teamId}&` : '&'}capacity=${capacity}&descendants=sessionRecords`,
        method: 'GET',
    });
};

export const getSessionById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'session',
        _url: `/sessions/${id}?descendants=sessionRecords`,
        method: 'GET',
    });
};

export const createSession = (): any => {
    return requestAsyncThunk({
        storeName: 'session',
        _url: `/sessions`,
        method: 'POST',
    });
};

export const updateSession = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'session',
        _url: `/sessions/${id}`,
        method: 'PATCH',
    });
};

export const createRecordSession = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'session',
        _url: `/sessions/record/${id}`,
        method: 'PATCH',
    });
};

export const saveSession = (id: string) => {
    return requestAsyncThunk({
        storeName: 'session',
        _url: `/sessions/upsert/${id}`,
        method: 'POST',
    });
};
