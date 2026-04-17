import { createSlice } from '@reduxjs/toolkit';
import { ActiveTab } from 'libs/enums';
import { ModalContentType } from 'libs/types';
import { router } from 'routers';

export interface initialStateProps {
    activeTab: ActiveTab;
    modalContent: ModalContentType;
    breadCrumps: string[];
}

const initialState = {
    activeTab: 'dashboard',
    modalContent: {
        title: '',
        subtitle: '',
        type: 'none',
        defaults: {},
        redirect: undefined,
    },
    breadCrumps: [],
} as initialStateProps;

export const controlsSlice = createSlice({
    name: 'controls',
    initialState,
    reducers: {
        switchActiveTab: (state: { activeTab: string }, { payload: { activeTab } }) => {
            state.activeTab = activeTab;
        },
        setModalContent: (
            state: { modalContent: Partial<ModalContentType> },
            { payload: { modalContent } }: { payload: { modalContent: Partial<ModalContentType> } },
        ) => {
            state.modalContent = { ...state.modalContent, ...modalContent };
        },
        closeModal: (state: { modalContent: ModalContentType }) => {
            state.modalContent = {
                type: 'none',
                title: '',
                subtitle: '',
            };
        },
        setBreadCrumps: (
            state: { breadCrumps: string[] },
            { payload: { breadCrumps } }: { payload: { breadCrumps: string[] } },
        ) => {
            state.breadCrumps = breadCrumps;
        },
        breadCrumpPush: (state: { breadCrumps: string[] }, { payload: { breadCrump } }) => {
            state.breadCrumps.push(breadCrump);
        },
        breadCrumpPop: (state: { breadCrumps: string[] }) => {
            state.breadCrumps.pop();
        },
        resetAction: () => initialState,
    },
});

export const {
    switchActiveTab,
    setModalContent,
    breadCrumpPush,
    breadCrumpPop,
    setBreadCrumps,
    closeModal,
    resetAction,
} = controlsSlice.actions;
export const selectControls = (state: { controls: initialStateProps }) => state.controls;
