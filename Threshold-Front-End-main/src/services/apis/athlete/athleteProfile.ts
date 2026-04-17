import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getAthleteProfile = (id: string) => {
    return requestAsyncThunk({
        storeName: 'athleteProfile',
        _url: `/athleteProfiles/${id}`,
        method: 'GET',
    });
};

export const getAthleteProfiles = ({
    athleteId,
    academyId,
    page = 0,
    capacity = 5,
    sortBy = 'createdAt',
}: DataPayload & { athleteId?: string; academyId?: string }) => {
    return requestAsyncThunk({
        storeName: 'athleteProfile',
        _url: `/athleteProfiles?sortBy=${sortBy}&${athleteId ? `athlete[id]=${athleteId}&` : ''}${
            academyId ? `academy[id]=${academyId}&` : ''
        }page=${page}&capacity=${capacity}`,
        method: 'GET',
    });
};

export const getProfileColumns = ({
    profileId,
    page = 0,
    capacity = 5,
    sortBy = 'createdAt',
}: DataPayload & { profileId?: string }) => {
    return requestAsyncThunk({
        storeName: 'profileColumn',
        _url: `/profileColumns?sortBy=${sortBy}&${
            profileId ? `profile[id]=${profileId}&` : ''
        }page=${page}&capacity=${capacity}`,
        method: 'GET',
    });
};

export const createSportProfileType = (): any => {
    return requestAsyncThunk({
        storeName: 'athleteProfile',
        _url: `/athleteProfiles`,
        method: 'POST',
    });
};

export const updateSportProfileType = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'athleteProfile',
        _url: `/athleteProfiles/${id}`,
        method: 'PATCH',
    });
};
