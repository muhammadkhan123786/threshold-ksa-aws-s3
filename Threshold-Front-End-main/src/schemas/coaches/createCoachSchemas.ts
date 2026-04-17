import * as Yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useCoachValidationSchema = () => {
    const { trans } = useLocales();

    const coachValidationSchema = Yup.object({
        firstName: Yup.string().required(trans('validation.firstNameRequired')),
        lastName: Yup.string().required(trans('validation.lastNameRequired')),
        nationality: Yup.object().required(trans('validation.nationalityRequired')),
        gender: Yup.object().required(trans('validation.genderRequired')),
        type: Yup.object().required(trans('validation.typeRequired')),
        relationship: Yup.object().nullable(),
        birthday: Yup.date().required(trans('validation.birthdayRequired')).nullable(),
        phone: Yup.string().matches(/^\d+$/, trans('validation.phoneMustBeNumeric')),
        emergencyPhone: Yup.string().matches(
            /^\d+$/,
            trans('validation.emergencyPhoneMustBeNumeric'),
        ),
        experience: Yup.number().min(0, trans('validation.experienceCannotBeNegative')),
        joinDate: Yup.date().nullable(),
        username: Yup.string().required(trans('validation.usernameRequired')),
        email: Yup.string()
            .email(trans('validation.invalidEmailFormat'))
            .required(trans('validation.emailRequired')),
        password: Yup.string()
            .min(8, trans('validation.passwordMinLength'))
            .required(trans('validation.passwordRequired')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], trans('validation.passwordsMustMatch'))
            .required(trans('validation.confirmPasswordRequired')),
        avatar: Yup.mixed().nullable(),
    });

    return coachValidationSchema;
};
