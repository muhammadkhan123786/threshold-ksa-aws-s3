import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import localforage from 'localforage';
import lockLoaderReducer from './lockLoaderSlice';
import localesReducers from './localesSlice';
import { controlsSlice } from './controlsSlice';
import { authSlice } from './authSlice';
import { academySlice } from './academySlice';
import { notificationsSlice } from './notificationsSlice';
import { persistedFilterReducer } from './filterSlice';
import breadcrumbsReducer from './breadcrumbsSlice';

const authPersistConfig = {
    key: 'auth',
    storage: localforage,
    whiteList: ['entities'],
};

const localesPersistConfig = {
    key: 'locales',
    storage: localforage,
    whiteList: ['lang'],
};

const controlsPersistConfig = {
    key: 'controls',
    storage: localforage,
    whitelist: ['activeTab', 'breadCrumps'],
};

const notificationsPersistConfig = {
    key: 'notifications',
    storage: localforage,
    whitelist: ['notifications'],
};

// const academyPersistConfig = {
//     key: 'academy',
//     storage: localforage,
// };

const localesPersistReducer = persistReducer(localesPersistConfig, localesReducers);
const authPersistReducer = persistReducer(authPersistConfig, authSlice.reducer);
const controlsPersistReducer = persistReducer(controlsPersistConfig, controlsSlice.reducer);
// const academyPersistReducer = persistReducer(academyPersistConfig, academySlice.reducer);
const notificationsPersistReducer = persistReducer(
    notificationsPersistConfig,
    notificationsSlice.reducer,
);

const reducers = combineReducers({
    auth: authPersistReducer,
    lockLoader: lockLoaderReducer,
    locales: localesPersistReducer,
    controls: controlsPersistReducer,
    notifications: notificationsPersistReducer,
    academy: academySlice.reducer,
    filters: persistedFilterReducer,
    breadcrumbs: breadcrumbsReducer,
});

export default reducers;
