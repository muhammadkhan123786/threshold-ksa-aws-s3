import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getCoaches = ({
    academyId,
    page = 0,
    capacity = 5,
    sortBy = 'firstName',
}: DataPayload & { academyId: string }) => {
    return requestAsyncThunk({
        storeName: 'coach',
        _url: `/coaches?page=1&limit=100000&sortBy=${sortBy}&${
            academyId ? `academy=${academyId}&` : ''
        }page=${page}&capacity=${capacity}&descendants=teams&`,
        method: 'GET',
    });
};

export const deleteCoach = (id: string) => {
    return requestAsyncThunk({
        storeName: 'coach',
        _url: `/coaches/${id}`,
        method: 'DELETE',
    });
};

export const getCoachById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'coach',
        _url: `/coaches/${id}`,
        method: 'GET',
    });
};

export const createCoach = (): any => {
    return requestAsyncThunk({
        storeName: 'coach',
        _url: `/coaches`,
        method: 'POST',
    });
};

export const updateCoach = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'coach',
        _url: `/coaches/${id}`,
        method: 'PATCH',
    });
};

export const getSessionsByCoach = (query: { date?: string }) => {
    const queryParams = new URLSearchParams(query).toString();
    return requestAsyncThunk({
        storeName: 'sessions',
        _url: `/coaches/sessions?${queryParams}`,
        method: 'GET',
    });
};
