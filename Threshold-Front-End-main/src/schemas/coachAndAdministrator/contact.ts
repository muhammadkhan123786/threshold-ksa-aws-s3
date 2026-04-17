import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { SubscriptionStatus, SubscriptionPeriod } from 'libs/enums/athlete';

export interface EditContactForm {
    phone: string;
    emergencyPhone: string;
    nationalId: string;
    nationalIdExpiration: Date;
    joinDate: Date;
    notes: string | null;
    durationPeriod: any[];
}

export const useContactSchema = () => {
    const { trans } = useLocales();
    return yup.object({
        phone: yup
            .string()
            .matches(/^05\d{8}$/, trans('validation.player.contactNumberInvalid'))
            .required(trans('validation.player.contactNumberRequired')),
        emergencyPhone: yup
            .string()
            .matches(/^05\d{8}$/, trans('validation.player.emergencyPhoneInvalid'))
            .required(trans('validation.player.emergencyPhoneRequired')),
        nationalId: yup
            .string()
            .matches(/^\d{10}$/, trans('validation.player.ninInvalid'))
            .required(trans('validation.player.ninRequired')),
        nationalIdExpiration: yup
            .date()
            .required(trans('validation.nationalIdExpirationDateRequired'))
            .typeError(trans('validation.nationalIdExpirationDateRequired')),
        relationship: yup
            .mixed()
            .test(
                'is-valid-relationship',
                trans('form.validation.relationshipRequired'),
                (value) =>
                    typeof value === 'string' || (typeof value === 'object' && value !== null),
            )
            .required(trans('form.validation.relationshipRequired')),
    });
};
