import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useNewYearGoalSchema = () => {
    const { trans } = useLocales();

    const newYearGoalValidators = {
        title: yup
            .string()
            .required(trans('validation.newYearGoal.titleRequired'))
            .max(100, trans('validation.newYearGoal.titleTooLong')),
        description: yup
            .string()
            .required(trans('validation.newYearGoal.descriptionRequired'))
            .max(500, trans('validation.newYearGoal.descriptionTooLong')),
        year: yup.string().required(trans('validation.newYearGoal.yearRequired')),
        startDate: yup
            .date()
            .required(trans('validation.newYearGoal.startDateRequired'))
            .typeError(trans('validation.newYearGoal.invalidStartDate')),
        endDate: yup
            .date()
            .min(yup.ref('startDate'), trans('validation.newYearGoal.endDateAfterStart'))
            .required(trans('validation.newYearGoal.endDateRequired'))
            .typeError(trans('validation.newYearGoal.invalidEndDate')),
    };

    return yup.object().shape(newYearGoalValidators);
};
