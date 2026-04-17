import * as Yup from 'yup';
import { useLocales } from 'hooks/locales';
import { Nationality } from 'libs/enums';

export const useManagerValidationSchemas = (activeStep: string) => {
    const { trans } = useLocales();

    const personalInformationSchema = Yup.object({
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
    });
    const fileInformationSchema = Yup.object({
        position: Yup.object().required(trans('validation.positionRequired')),
        relationship: Yup.object().required(trans('validation.relationshipRequired')),
        phone: Yup.string()
            .matches(/^05\d{8}$/, trans('validation.player.emergencyPhoneInvalid'))
            .required(trans('validation.player.emergencyPhoneRequired'))
            .default(undefined),
        emergencyPhone: Yup.string()
            .matches(/^05\d{8}$/, trans('validation.player.emergencyPhoneInvalid'))
            .required(trans('validation.player.emergencyPhoneRequired'))
            .default(undefined),
    });
    const accountInformationSchema = Yup.object({
        avatar: Yup.mixed().nullable(),
        firstName: Yup.string().required(trans('validation.firstNameRequired')),
        lastName: Yup.string().required(trans('validation.lastNameRequired')),
        nationality: Yup.object().required(trans('validation.nationalityRequired')),
        gender: Yup.object().required(trans('validation.genderRequired')),
        birthday: Yup.date().required(trans('validation.birthdayRequired')),
        experience: Yup.number()
            .min(0, trans('validation.experienceCannotBeNegative'))
            .required(trans('validation.experienceRequired')),
        nationalId: Yup.string()
            .required(trans('validation.add.nin.ninRequired'))
            .matches(/^\d{10}$/, trans('validation.add.nin.ninInvalid'))
            .test(
                'nationality-validation',
                trans('validation.add.nin.ninNationalityValidation'),
                function (value: string) {
                    const { nationality }: { nationality?: { value: Nationality } } = this.parent;

                    if (nationality?.value === Nationality.SA) {
                        return /^10/.test(value);
                    }
                    return /^20/.test(value);
                },
            ),
        nationalIdExpirationDate: Yup.date().required(
            trans('validation.nationalIdExpirationDateRequired'),
        ),
    });

    const schemas: Record<string, Yup.ObjectSchema<any>> = {
        account: accountInformationSchema,
        file: fileInformationSchema,
        personal: personalInformationSchema,
    };

    return schemas[activeStep] || accountInformationSchema;
};
