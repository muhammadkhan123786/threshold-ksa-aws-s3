import { createSlice } from '@reduxjs/toolkit';
import { lowerCase } from 'lodash';
import { getI18n } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

type Langs = {
    [key: string]: string;
};

const langs: Langs = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    arabic: 'ar',
};

const initialState = {
    lang: 'en',
    isRTL: false,
    deviceId: '',
};

const langRTL = ['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'];

export const localesSlice = createSlice({
    name: 'locales',
    initialState,
    reducers: {
        setLang: (state, { payload }) => {
            const i18n = getI18n();

            const langCode = langs[lowerCase(payload as string)] || payload;
            i18n.changeLanguage(langCode);
            state.lang = langCode;
            state.isRTL = langRTL.includes(langCode);

            return state;
        },
        setDeviceId: (state) => {
            if (!state.deviceId) {
                state.deviceId = uuidv4();
                return state;
            }
        },
        resetLocalesAction: () => {
            return initialState;
        },
    },
});

export const { setLang, resetLocalesAction, setDeviceId } = localesSlice.actions;

export default localesSlice.reducer;
