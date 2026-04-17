import { useLocales } from 'hooks/locales';
import * as yup from 'yup';
export const useRegisterSchema = () => {
    const { trans } = useLocales();

    return yup.object().shape({
        name: yup
            .string()
            .required(trans('signup.validation.register.academyNameRequired'))
            .default(''),

        organizationType: yup
            .mixed()
            .oneOf(['academy', 'club'], trans('signup.validation.register.academyOrClubRequired'))
            .required(trans('signup.validation.register.academyOrClubRequired'))
            .default('academy'),
        registrationNumber: yup
            .string()
            .required(trans('signup.validation.register.commercialRegistrationNumberRequired'))
            .matches(
                /^\d{10}$/,
                trans('signup.validation.register.commercialRegistrationNumberInvalid'),
            )
            .default(''),
        phoneNumbers: yup
            .array()
            .of(
                yup
                    .string()
                    .matches(
                        /^(05)\d{8}$/,
                        trans('signup.validation.register.academyContactNumberInvalid'),
                    ),
            )
            .min(1, trans('signup.validation.register.atLeastOneContactNumberRequired'))
            .default([])
            .notRequired(),
        contactNumber: yup
            .string()
            .required(trans('signup.validation.register.academyContactNumberRequired'))
            .matches(/^(05)\d{8}$/, trans('signup.validation.register.academyContactNumberInvalid'))
            .default(''),
        username: yup
            .string()
            .required(trans('signup.validation.register.adminNameRequired'))
            .default(''),
        email: yup
            .string()
            .required(trans('signup.validation.register.adminEmailRequired'))
            .matches(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                trans('signup.validation.register.adminEmailInvalid'),
            )
            .default(''),
        password: yup
            .string()
            .required(trans('signup.validation.register.passwordRequired'))
            .matches(/.{6,}$/, trans('signup.validation.register.passwordMinLength'))
            .default(''),
        // .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        //     trans('validation.register.passwordComplexity'),
        // ),
        address: yup
            .string()
            .required(trans('signup.validation.register.addressRequired'))
            .default(''),
    });
};
