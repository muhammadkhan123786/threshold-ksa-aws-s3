import { createSlice } from '@reduxjs/toolkit';

interface initialStateProps {
    loader: boolean;
}
const initialState = {
    loader: false,
} as initialStateProps;

export const lockLoaderSlice = createSlice({
    name: 'lockLoader',
    initialState,
    reducers: {
        loader(state: any, action: any) {
            state.loader = action.payload === 'pending';
        },
    },
});

export const { loader } = lockLoaderSlice.actions;

export const selectLoader = (state: any) => state.loader;

export default lockLoaderSlice.reducer;
