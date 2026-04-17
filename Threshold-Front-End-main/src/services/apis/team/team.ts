import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const getTeams = ({
    academyId,
    coachId,
    page = 0,
    capacity = 5,
    sortBy = 'name',
}: DataPayload & { academyId?: string; coachId?: string }) => {
    return requestAsyncThunk({
        storeName: 'team',
        _url: `/teams?page=1&limit=100000&sortBy=${sortBy}&${
            academyId ? `academy=${academyId}&` : ''
        }${
            coachId ? `coach=${coachId}&` : ''
        }page=${page}&capacity=${capacity}&descendants=athletes`,
        method: 'GET',
    });
};

export const getTeamById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'team',
        _url: `/teams/${id}?descendants=athletes`,
        method: 'GET',
    });
};

export const createTeam = (): any => {
    return requestAsyncThunk({
        storeName: 'team',
        _url: `/teams`,
        method: 'POST',
    });
};

export const updateTeam = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'team',
        _url: `/teams/${id}`,
        method: 'PATCH',
    });
};
