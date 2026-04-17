import { DataPayload } from 'libs/types';
import { requestAsyncThunk } from 'services/templates';

export const updateAcademy = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'academy',
        _url: `/academies/${id}`,
        method: 'PATCH',
    });
};

export const getAcademy = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'academy',
        _url: `/academies/${id}`,
        method: 'GET',
    });
};

export const getFeedbacks = ({
    academyId,
    page = 0,
    capacity = 5,
    sortBy = 'createdAt',
}: DataPayload & { academyId?: string }) => {
    return requestAsyncThunk({
        storeName: 'academy',
        _url: `/feedbacks?sortBy=${sortBy}&${
            academyId ? `academy[id]=${academyId}&` : ''
        }page=${page}&capacity=${capacity}&descendants=academy`,
        method: 'GET',
    });
};

export const getFeedbackById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'team',
        _url: `/feedbacks/${id}?descendants=academy`,
        method: 'GET',
    });
};

export const createFeedback = (): any => {
    return requestAsyncThunk({
        storeName: 'academy',
        _url: `/feedbacks`,
        method: 'POST',
    });
};
