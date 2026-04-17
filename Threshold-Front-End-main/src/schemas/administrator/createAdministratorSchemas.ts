import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { MAX_FILE_SIZE } from 'libs/types/athlete';

export const useValidationSchemas = (activeTab: string) => {
    const { trans } = useLocales();

    // Personal Information Schema (unchanged)
    const personalInformationSchema = yup.object({
        firstName: yup.string().required(trans('validation.player.firstNameRequired')),
        lastName: yup.string().required(trans('validation.player.lastNameRequired')),
        avatar: yup.string().nullable().default(undefined),
        nationality: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.nationalityRequired'))
            .default(undefined),
        gender: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.genderRequired'))
            .default(undefined),
        birthday: yup
            .date()
            .required(trans('validation.player.dateOfBirthRequired'))
            .typeError(trans('validation.player.dateOfBirthInvalid')),
        joinDate: yup
            .date()
            .required(trans('validation.player.dateOfBirthRequired'))
            .typeError(trans('validation.player.dateOfBirthInvalid')),
        phone: yup
            .string()
            .matches(/^05\d{8}$/, trans('validation.player.contactNumberInvalid'))
            .required(trans('validation.player.contactNumberRequired')),
        emergencyPhone: yup
            .string()
            .matches(/^05\d{8}$/, trans('validation.player.emergencyPhoneInvalid'))
            .required(trans('validation.player.emergencyPhoneRequired'))
            .default(undefined),
        relationship: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.relationshipRequired'))
            .default(undefined),
        type: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.typeRequired'))
            .default(undefined),
        experience: yup
            .number()
            .required(trans('validation.player.ninRequired'))
            .min(0, trans('validation.player.ninInvalid'))
            .max(40, trans('validation.player.ninInvalid')),
    });

    // Account Information Schema (updated)
    const accountInformationSchema = yup.object({
        username: yup
            .string()
            .required(trans('validation.account.usernameRequired'))
            .min(3, trans('validation.account.usernameMin'))
            .max(20, trans('validation.account.usernameMax')),
        email: yup
            .string()
            .required(trans('validation.account.emailRequired'))
            .email(trans('validation.account.emailInvalid')),
        password: yup
            .string()
            .min(8, trans('validation.passwordMinLength'))
            .required(trans('validation.passwordRequired')),
        confirmPassword: yup
            .string()
            .required(trans('validation.account.confirmPasswordRequired'))
            .oneOf([yup.ref('password')], trans('validation.account.confirmPasswordMismatch')),
    });

    const schemas: Record<string, yup.ObjectSchema<any>> = {
        personalInformation: personalInformationSchema,
        accountInformation: accountInformationSchema,
    };

    return schemas[activeTab] || personalInformationSchema;
};
export const DEFAULT_ADMINS_VALUES = {
    // Personal Information Defaults
    firstName: undefined,
    lastName: undefined,
    avatar: undefined,
    nationality: undefined, // Object with `label` and `value`
    gender: undefined, // Object with `label` and `value`
    birthday: undefined, // Date
    joinDate: undefined, // Date
    phone: undefined,
    emergencyPhone: undefined,
    relationship: undefined, // Object with `label` and `value`
    type: undefined, // Object with `label` and `value`
    experience: undefined,
    // Account Information Defaults
    username: undefined, // String
    email: undefined, // String
    password: undefined, // String
};
