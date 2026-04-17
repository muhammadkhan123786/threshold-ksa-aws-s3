import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';
import { SportProfileType, PlayingSessionStatus, PlayingSessionType } from 'libs/enums';
import { getSessionSchema } from './getSessionSchema';

export const useCreateSession = (
    records: any[],
    options: {
        sportType?: SportProfileType;
        sessionType?: PlayingSessionType;
        sessionStatus?: PlayingSessionStatus;
    },
) => {
    const { trans } = useLocales();
    const { sportType, sessionType, sessionStatus } = options;

    const athletesValidators: {
        [key: string]: yup.ObjectSchema<any> | yup.StringSchema<any>;
    } = {};

    records.forEach(({ id }) => {
        athletesValidators[id] = getSessionSchema(sportType, sessionStatus, sessionType);
    });

    const editSessionValidators = {
        status: yup.object().shape(SingleSelectOption),
        ...athletesValidators,
    };

    return yup.object().shape(editSessionValidators);
};

export const EDIT_NEW_TEAM_DEFAULTS = {};
