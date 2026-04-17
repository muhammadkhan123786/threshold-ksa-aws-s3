import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getAthleteBatteries = ({
    athleteId,
    page = 0,
    capacity = 5,
    sortBy = 'createdAt',
}: DataPayload & { athleteId?: string }) => {
    return requestAsyncThunk({
        storeName: 'athleteBattery',
        _url: `/athleteBatteries?sortBy=${sortBy}&${
            athleteId ? `athlete[id]=${athleteId}&` : ''
        }page=${page}&capacity=${capacity}`,
        method: 'GET',
    });
};

export const addAthleteBattery = (): any => {
    return requestAsyncThunk({
        storeName: 'athleteBattery',
        _url: `/athleteBatteries`,
        method: 'POST',
    });
};
