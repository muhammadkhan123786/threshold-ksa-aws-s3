import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BreadcrumbItem {
    label: string;
    path?: string;
    params?: any;
}

export interface BreadcrumbsState {
    breadcrumbs: BreadcrumbItem[];
}

const initialState: BreadcrumbsState = {
    breadcrumbs: [],
};

const breadcrumbsSlice = createSlice({
    name: 'breadcrumbs',
    initialState,
    reducers: {
        setBreadcrumbs(state, action: PayloadAction<BreadcrumbItem[]>) {
            state.breadcrumbs = action.payload;
        },
        addBreadcrumb(state, action: PayloadAction<BreadcrumbItem>) {
            state.breadcrumbs.push(action.payload);
        },
        clearBreadcrumbs(state) {
            state.breadcrumbs = [];
        },
    },
});

export const selectBreadcrumbs = (state: any) => state.breadcrumbs.breadcrumbs;

export const { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs } = breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;
