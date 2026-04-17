import { PaginationQuery } from 'libs/types/app';
import { requestAsyncThunk } from 'services/templates';

export const toggleApprovalStatus = (id: string) => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/users/toggle-approval/${id}`,
        method: 'PATCH',
    });
};

export const getPendingApprovalUsers = ({ academyId, sortBy = 'createdAt' }: PaginationQuery) => {
    const queryParams = new URLSearchParams({
        sortBy,
    });

    if (academyId) {
        queryParams.append('academyId', academyId);
    }

    const queryString = queryParams.toString();
    const endpoint = `/users/pending-approvals?${queryString}`;

    return requestAsyncThunk({
        storeName: 'auth',
        _url: endpoint,
        method: 'GET',
    });
};

export const getUserById = (id: string) => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/users/${id}`,
        method: 'GET',
    });
};

export const getUsers = () => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/users`,
        method: 'GET',
    });
};

export const signIn = () => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/auth/login`,
        method: 'POST',
    });
};

export const signUp = () => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/auth/register`,
        method: 'POST',
    });
};

export const updateUser = (id: string): any => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/users/${id}`,
        method: 'PATCH',
    });
};

export const refreshToken = () => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/auth/refresh`,
        method: 'POST',
    });
};

export const forgetPassword = () => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/auth/forget_password`,
        method: 'POST',
    });
};

export const resetPassword = () => {
    return requestAsyncThunk({
        storeName: 'auth',
        _url: `/auth/reset_password`,
        method: 'POST',
    });
};
