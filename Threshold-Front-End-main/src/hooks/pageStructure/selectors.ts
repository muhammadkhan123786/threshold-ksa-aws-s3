import { createSelector } from 'reselect';

export const selectAuth = (state: any) => state.auth;
export const selectUserRole = createSelector([selectAuth], (auth) => auth.entities?.role);
