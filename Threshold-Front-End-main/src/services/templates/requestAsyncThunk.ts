import { AxiosError } from 'axios';
import axios from './axios';
import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';

interface RequestParams {
    _url: string;
    exact?: string;
    storeName: string;
    method: string;
}

interface ThunkApiConfig {
    rejectWithValue: (value: RejectValue) => any;
}

interface RejectValue {
    status: number | undefined;
    message: string | undefined;
    id: string;
    payload: any;
}

const request = ({ _url, exact, ...rest }: RequestParams) =>
    createAsyncThunk(_url + exact, async (params: any, { rejectWithValue }: ThunkApiConfig) => {
        const url = params?.urlParams ? `${_url}${params?.urlParams}` : _url;

        try {
            return await axios({ url, ...rest, params });
        } catch (err: unknown) {
            const error = err as AxiosError;

            const { status, data, statusText } = error.response || {};
            return rejectWithValue({
                status,
                message: statusText,
                payload: data,
                id: nanoid(),
            });
        }
    });

export default request;
