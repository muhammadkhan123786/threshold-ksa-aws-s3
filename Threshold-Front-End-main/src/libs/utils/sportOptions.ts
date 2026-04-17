import { sportMapping, SportType } from './sportIcons';
import { useLocales } from 'hooks/locales';

export const useSportOptions = () => {
    const { trans } = useLocales();

    return Object.entries(sportMapping).map(([sport, icon]) => ({
        label: trans(`sport.${sport}`),
        value: sport as SportType,
        icon,
    }));
};
