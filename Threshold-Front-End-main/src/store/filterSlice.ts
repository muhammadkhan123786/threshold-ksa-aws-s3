import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import localforage from 'localforage';

interface FilterState {
    [filterName: string]: {
        [key: string]: any;
    };
}

const initialState: FilterState = {};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilter: (
            state,
            action: PayloadAction<{ filterName: string; key: string; value: any }>,
        ) => {
            if (!state[action.payload.filterName]) {
                state[action.payload.filterName] = {};
            }
            state[action.payload.filterName][action.payload.key] = action.payload.value;
        },
        clearFilter: (state, action: PayloadAction<{ filterName: string; key: string }>) => {
            if (state[action.payload.filterName]) {
                delete state[action.payload.filterName][action.payload.key];
            }
        },
        clearAllFilters: (state, action: PayloadAction<{ filterName: string }>) => {
            if (state[action.payload.filterName]) {
                state[action.payload.filterName] = {};
            }
        },
        clearAllFiltersForAll: () => initialState,
    },
});

export const { setFilter, clearFilter, clearAllFilters, clearAllFiltersForAll } =
    filterSlice.actions;

const filterPersistConfig = {
    key: 'filters',
    storage: localforage,
};

export const persistedFilterReducer = persistReducer(filterPersistConfig, filterSlice.reducer);

export default filterSlice.reducer;
