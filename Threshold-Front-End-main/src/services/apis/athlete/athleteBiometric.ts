import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getAthleteBiometrics = ({
    athleteId,
    page = 0,
    capacity = 5,
    sortBy = 'createdAt',
}: DataPayload & { athleteId?: string }) => {
    return requestAsyncThunk({
        storeName: 'athleteBiometric',
        _url: `/athleteBiometrics?sortBy=${sortBy}&${
            athleteId ? `athlete[id]=${athleteId}&` : ''
        }page=${page}&capacity=${capacity}`,
        method: 'GET',
    });
};

export const addAthleteBiometric = (): any => {
    return requestAsyncThunk({
        storeName: 'athleteBiometric',
        _url: `/athleteBiometrics`,
        method: 'POST',
    });
};
