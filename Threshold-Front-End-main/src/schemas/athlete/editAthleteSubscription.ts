import { useLocales } from 'hooks/locales';
import * as yup from 'yup';
import { SubscriptionStatus, SubscriptionPeriod } from 'libs/enums/athlete';
import { SingleSelectOption } from 'libs/constants';

export const useEditAthleteSubscriptionSchema = () => {
    const { trans } = useLocales();

    const editAthleteSubscriptionValidators = {
        subscriptionDate: yup
            .date()
            .required(trans('validation.subscriptionManagement.dateRequired')),
        status: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.subscriptionManagement.statusRequired')),
        periodSubscription: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.subscriptionManagement.periodSubscriptionRequired')),
    };

    return yup.object().shape(editAthleteSubscriptionValidators);
};

export const EDIT_ATHLETE_SUBSCRIPTION_DEFAULTS = {
    date: new Date(),
    status: SubscriptionStatus.ACTIVE,
    periodSubscription: SubscriptionPeriod.ONE_MONTH,
};
