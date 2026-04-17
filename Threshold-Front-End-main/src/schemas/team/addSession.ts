import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { Athlete } from 'libs/types';
import * as yup from 'yup';

export const useAddSessionSchema = (athletes: Athlete[]) => {
    const { trans } = useLocales();

    const athletesValidators: {
        [key: string]: yup.ObjectSchema<any> | yup.StringSchema<any>;
    } = {};

    athletes &&
        athletes.forEach(({ id }) => {
            athletesValidators[`status@${id}`] = yup.object().shape(SingleSelectOption);
            athletesValidators[`comment@${id}`] = yup.string();
        });

    const addSessionValidators = {
        date: yup.string().required(trans('validation.addSession.dateRequired')),
        from: yup
            .string()
            .required(trans('validation.addSession.timeRequired'))
            .matches(
                /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm|A\.M|P\.M|a\.m|p\.m)$/,
                trans('validation.addSession.invalidTimeFormat'),
            ),
        to: yup
            .string()
            .required(trans('validation.addSession.timeRequired'))
            .matches(
                /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm|A\.M|P\.M|a\.m|p\.m)$/,
                trans('validation.addSession.invalidTimeFormat'),
            ),
        type: yup.object().shape(SingleSelectOption),
        ...athletesValidators,
    };

    return yup.object().shape(addSessionValidators);
};
export const EDIT_NEW_TEAM_DEFAULTS = {};
