// schemas/links/createPublicAthleteLinkSchema.ts
import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useCreatePublicAthleteLinkSchema = () => {
    const { trans } = useLocales();

    return yup.object().shape({
        academyId: yup.string().required(trans('validation.academyIdRequired')).default(undefined),
        expirationDate: yup
            .date()
            .required(trans('validation.expirationDateRequired'))
            .min(new Date(), trans('validation.expirationDateInFuture'))
            .default(undefined),
        limitNumber: yup
            .number()
            .required(trans('validation.limitNumberRequired'))
            .min(1, trans('validation.limitNumberMin'))
            .default(undefined),
    });
};

export const CREATE_PUBLIC_ATHLETE_LINK_DEFAULTS = {
    academyId: undefined,
    expirationDate: undefined,
    limitNumber: undefined,
};
