import { createSlice } from '@reduxjs/toolkit';
import { ACADEMY_INITIAL_VALUES } from 'libs/constants';
import { Academy, Athlete, AthleteProfile, SessionPlayingType, Team } from 'libs/types';
import { SessionRecord } from 'libs/types/session';

export interface initialStateProps {
    academy: Academy;
    currentAthlete: Athlete;
    currentTeam: Team;
    currentProfile: AthleteProfile;
    currentSession: SessionPlayingType;
    currentSessionRecords: SessionRecord[];
}

const initialState = {
    academy: ACADEMY_INITIAL_VALUES,
} as initialStateProps;

export const academySlice = createSlice({
    name: 'academy',
    initialState,
    reducers: {
        setAcademy: (state: { academy: Academy }, { payload: { academy } }) => {
            state.academy = academy;
        },
        setCurrentAthlete: (
            state: { currentAthlete: Athlete },
            { payload: { currentAthlete } },
        ) => {
            state.currentAthlete = currentAthlete;
        },
        setCurrentProfile: (
            state: { currentProfile: AthleteProfile },
            { payload: { currentProfile } },
        ) => {
            state.currentProfile = currentProfile;
        },
        setCurrentSession: (
            state: { currentSession: SessionPlayingType },
            { payload: { currentSession } },
        ) => {
            state.currentSession = currentSession;
        },
        setCurrentSessionRecords: (
            state: { currentSessionRecords: SessionRecord[] },
            { payload: { currentSessionRecords } },
        ) => {
            state.currentSessionRecords = currentSessionRecords;
        },
        setCurrentTeam: (state: { currentTeam: Team }, { payload: { currentTeam } }) => {
            state.currentTeam = currentTeam;
        },
        resetAction: () => initialState,
    },
});

export const {
    setAcademy,
    setCurrentAthlete,
    setCurrentProfile,
    setCurrentTeam,
    setCurrentSession,
    setCurrentSessionRecords,
    resetAction,
} = academySlice.actions;

export const selectAcademy = (state: { academy: initialStateProps }) => state.academy;
