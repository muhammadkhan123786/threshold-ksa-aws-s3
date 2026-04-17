import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';

export const useWeeklySessionSchema = () => {
    const { trans } = useLocales();

    return yup.object().shape({
        title: yup
            .string()
            .required(trans('validation.session.titleRequired'))
            .max(100, trans('validation.session.titleMaxLength'))
            .default(''),

        description: yup
            .string()
            .optional()
            .max(500, trans('validation.session.descriptionMaxLength'))
            .default(''),

        target: yup
            .number()
            .required(trans('validation.session.targetRequired'))
            .min(1, trans('validation.session.targetMin'))
            .max(1000, trans('validation.session.targetMax'))
            .default(0),

        weekDate: yup
            .date()
            .required(trans('validation.session.weekDateRequired'))
            .typeError(trans('validation.session.invalidDateFormat'))
            .default(new Date()),

        days: yup
            .array()
            .min(1, trans('validation.session.atLeastOneDay'))
            .required(trans('validation.session.daysRequired'))
            .default([]),
    });
};
