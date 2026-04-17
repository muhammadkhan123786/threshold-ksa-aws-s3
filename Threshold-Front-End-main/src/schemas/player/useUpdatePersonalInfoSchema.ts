import { useMemo } from 'react';
import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { Education, Gender, Nationality } from 'libs/enums';

export const useUpdatePersonalInfoSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                avatar: yup.mixed().nullable(),
                firstName: yup.string().required(trans('form.validation.firstNameRequired')),
                lastName: yup.string().required(trans('form.validation.lastNameRequired')),
                joinDate: yup.date().required(trans('form.validation.joinDateRequired')),
                level: yup
                    .mixed()
                    .test(
                        'is-valid-level',
                        trans('form.validation.levelRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.levelRequired')),
                experience: yup.string().required(trans('form.validation.experienceRequired')),
                education: yup
                    .mixed()
                    .test(
                        'is-valid-education',
                        trans('form.validation.educationRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.educationRequired')),
                schoolName: yup.string().required(trans('form.validation.schoolNameRequired')),
                dateOfBirth: yup.date().required(trans('form.validation.dateOfBirthRequired')),
                gender: yup
                    .mixed()
                    .test(
                        'is-valid-gender',
                        trans('form.validation.genderRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.genderRequired')),
                nationality: yup
                    .mixed()
                    .test(
                        'is-valid-nationality',
                        trans('form.validation.nationalityRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.nationalityRequired')),
                nin: yup
                    .string()
                    .required(trans('validation.add.nin.ninRequired'))
                    .matches(/^\d{10}$/, trans('validation.add.nin.ninInvalid'))
                    .test(
                        'nationality-validation',
                        trans('validation.add.nin.ninNationalityValidation'),
                        function (value: string) {
                            const { nationality }: { nationality?: { value: Nationality } } =
                                this.parent;

                            if (nationality?.value === Nationality.SA) {
                                return /^10/.test(value);
                            }
                            return /^20/.test(value);
                        },
                    ),
                ninExpirationDate: yup
                    .date()
                    .required(trans('form.validation.ninExpirationDateRequired'))
                    .typeError(trans('form.validation.invalidDateFormat')),
                weight: yup.number().required(trans('form.validation.weightRequired')).default(0),
                height: yup.number().required(trans('form.validation.heightRequired')).default(0),
            }),
        [trans],
    );

    return schema;
};
