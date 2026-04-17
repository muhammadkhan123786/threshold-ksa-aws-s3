import { useTranslation, Trans } from 'react-i18next';
import 'moment/locale/ar';
import moment from 'moment-timezone';
import { store } from 'store';

const isValidDate = (date: any): boolean => {
    return moment(date).isValid();
};

const getEnvSettings = () => {
    const dateFormat = process.env.REACT_APP_DATE_FORMAT || 'YYYY-MM-DD';
    const timeZone = process.env.REACT_APP_TIME_ZONE || 'UTC';
    return { dateFormat, timeZone };
};

const getSetting = () => {
    const state = store?.getState?.();
    return {
        lang: state?.locales?.lang || 'en',
        isRTL: state?.locales?.isRTL || false,
        deviceId: state?.locales?.deviceId,
    };
};

const getSettings = () => {
    const { dateFormat, timeZone } = getEnvSettings();
    const { lang, isRTL, deviceId } = getSetting();
    return { lang, dateFormat, deviceId, isRTL, timeZone };
};

export function formatDate(value: any, fmt?: string): string | undefined {
    try {
        const { lang, dateFormat, timeZone } = getSettings();
        moment.locale(lang);

        const hasArabicNumerals = typeof value === 'string' && /[٠-٩]/.test(value);
        const normalizedValue = hasArabicNumerals
            ? value.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
            : value;

        const parsedDate = moment.tz(normalizedValue, timeZone);

        if (!parsedDate.isValid()) {
            throw new Error('Invalid date value provided to formatDate.');
        }

        return parsedDate.format(fmt || dateFormat);
    } catch (error) {
        return undefined;
    }
}

export function timezonDate(value: any): Date | undefined {
    try {
        const { lang, timeZone } = getSettings();
        moment.locale(lang);
        const parsedDate = moment.tz(value, timeZone);

        if (!isValidDate(parsedDate)) {
            throw new Error('Invalid date value provided to timezonDate.');
        }

        return parsedDate.endOf('day').toDate();
    } catch (error) {
        return undefined;
    }
}
export function isFutureDateSelected(selectedDate: string | Date) {
    if (!selectedDate) return false;

    const { timeZone } = getSettings();
    const selectedMoment = moment.tz(selectedDate, timeZone).startOf('day');
    const currentMoment = moment.tz(timeZone).startOf('day');

    const isFutureDate = selectedMoment.isAfter(currentMoment);

    return isFutureDate;
}

export const useLocales = () => {
    const { t, i18n } = useTranslation();
    const { isRTL, deviceId, lang } = getSettings();
    return {
        formatDate,
        deviceId,
        timezonDate,
        isFutureDateSelected,
        isRTL,
        trans: t,
        Trans,
        i18n,
        lang,
    };
};
