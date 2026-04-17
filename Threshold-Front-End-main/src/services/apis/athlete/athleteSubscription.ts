import { requestAsyncThunk } from 'services/templates';

export const getAthleteSubscription = (id: string) => {
    return requestAsyncThunk({
        storeName: 'athleteSubscription',
        _url: `/athleteSubscription/${id}`,
        method: 'GET',
    });
};

export const updateAthleteSubscription = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'athleteSubscription',
        _url: `/athleteSubscription/${id}`,
        method: 'PATCH',
    });
};
