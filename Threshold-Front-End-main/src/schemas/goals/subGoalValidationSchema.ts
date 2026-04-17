import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useNewSubGoalSchema = () => {
    const { trans } = useLocales();
    const newSubGoalValidators = {
        months: yup
            .mixed<any>()
            .required(trans('validation.updatePersonalInfo.monthNumber'))
            .test(
                'is-valid-nationality',
                trans('validation.updatePersonalInfo.monthNumber'),
                (value) =>
                    (typeof value === 'string' && value.trim() !== '') ||
                    (typeof value === 'object' &&
                        value !== null &&
                        typeof value.label === 'string' &&
                        value.label.trim() !== '' &&
                        typeof value.value === 'string' &&
                        value.value.trim() !== ''),
            ),
        title: yup
            .string()
            .required(trans('validation.newSubGoal.title'))
            .max(500, trans('validation.newSubGoal.title')),
    };

    return yup.object().shape(newSubGoalValidators);
};
