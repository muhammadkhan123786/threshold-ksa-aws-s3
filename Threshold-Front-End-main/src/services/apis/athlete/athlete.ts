import { AthleteLevel } from 'libs/enums/athlete';
import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getAthleteById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes/${id}`,
        method: 'GET',
    });
};

export const getAthletes = ({
    academyId,
    teamId,
    page = 1,
    capacity = 5,
    sortBy = 'createdAt',
    subscriptionStatus = [],
    firstName,
    level, // Add the level parameter here
}: DataPayload & {
    academyId?: string;
    teamId?: string;
    subscriptionStatus?: any;
    firstName?: any;
    level?: AthleteLevel; // Accept the level filter
}) => {
    const subscriptionStatusQuery = subscriptionStatus.length
        ? subscriptionStatus.map((status: any) => `subscriptionStatus=${status}`).join('&')
        : '';

    const levelQuery = level ? `&level=${level}` : ''; // Construct level query

    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes?page=1&limit=100000&sortBy=${sortBy}&${
            academyId ? `academy=${academyId}&` : ''
        }${teamId ? `teams=${teamId}&` : ''}capacity=${capacity}${
            firstName ? `&firstName=${firstName}` : ''
        }&descendants=athleteProfiles&descendants=teams${
            subscriptionStatusQuery ? `&${subscriptionStatusQuery}` : ''
        }${levelQuery}`, // Include the level filter in the URL
        method: 'GET',
    });
};

export const createAthlete = (): any => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes`,
        method: 'POST',
    });
};

export const updateAthlete = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes/${id}`,
        method: 'PATCH',
    });
};
export const updateAthleteRecord = (id: string, recordId: string): any => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes/${id}/records/${recordId}`,
        method: 'PATCH',
    });
};

export const addAthleteRecord = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes/${id}/records`,
        method: 'POST',
    });
};

export const addAthleteBankData = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes/${id}/bank-data`,
        method: 'POST',
    });
};

export const updateAthleteBankData = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes/${id}/bank-data`,
        method: 'PATCH',
    });
};

export const deleteAthlete = (id: string) => {
    return requestAsyncThunk({
        storeName: 'athlete',
        _url: `/athletes/${id}`,
        method: 'DELETE',
    });
};

export const getAthleteDetailsById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'athleteDetails',
        _url: `/athletes/${id}/details`,
        method: 'GET',
    });
};

export const getAthleteRecordsById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'athleteRecords',
        _url: `/athletes/${id}/records`,
        method: 'GET',
    });
};
