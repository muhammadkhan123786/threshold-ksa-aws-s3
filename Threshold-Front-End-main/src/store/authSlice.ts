import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from 'libs/types';
import { merge } from 'lodash';
import { signIn } from 'services/apis/auth';
import { responseAsyncThunk } from 'services/templates';

const initialState = {
    loading: 'idle',
    entities: undefined,
    currentRequestId: undefined,
    error: undefined,
    status: 0,
    refreshCounter: false,
} as AuthState;

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAction: () => {
            return initialState;
        },
        setAuthData: (state, action) => {
            state.entities = { ...state.entities, ...action.payload };
        },
        setAvatarAction: (state, { payload }) => {
            const newD = { ...(state?.entities || {}), avatar: payload } as any;
            state.entities = newD;

            return state;
        },
        setAccessToken: (state, { payload: { accessToken, refreshToken } }) => {
            const tempEntities = merge({}, state.entities, {
                payload: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                },
            });

            state.entities = tempEntities;
            return state;
        },
        clearAuthData: (state) => {
            state.entities = undefined;
        },
    },
    extraReducers: responseAsyncThunk(signIn()),
});

export const { resetAction, setAuthData, clearAuthData } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
