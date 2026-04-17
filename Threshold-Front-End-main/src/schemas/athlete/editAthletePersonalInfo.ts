import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { Nationality } from 'libs/enums';
import * as yup from 'yup';

export const useEditAthletePersonalInfoSchema = (
    nationalityValue: { value: string; label: string } | null = null,
) => {
    const { trans } = useLocales();

    const editAthletePersonalInfoValidators = {
        dateOfBirth: yup
            .string()
            .required(trans('validation.editAthletePersonalInfo.dateOfBirthRequired')),
        joinDate: yup
            .string()
            .required(trans('validation.editAthletePersonalInfo.joinDateRequired')),
        education: yup.object().shape(SingleSelectOption),
        gender: yup.object().shape(SingleSelectOption),
        nin: yup
            .string()
            .required(trans('validation.editAthletePersonalInfo.ninRequired'))
            .matches(/^(1|2)(\d{9})$/, trans('validation.editAthletePersonalInfo.ninInvalid'))
            .test(
                'nationality-validation',
                trans('validation.editAthletePersonalInfo.ninNationalityValidation'),
                function (value: string) {
                    if (nationalityValue) {
                        return nationalityValue.value === Nationality.SA
                            ? /^1(\d{9})$/.test(value)
                            : /^2(\d{9})$/.test(value);
                    } else {
                        const {
                            nationality,
                        }: {
                            nationality?: { value: Nationality };
                        } = this.parent;
                        return nationality?.value === Nationality.SA
                            ? /^1(\d{9})$/.test(value)
                            : /^2(\d{9})$/.test(value);
                    }
                },
            ),
    };

    return yup.object().shape(editAthletePersonalInfoValidators);
};

export const EDIT_ATHLETE_PERSONAL_INFO_DEFAULTS = {
    dateOfBirth: false,
    joinDate: new Date().toLocaleDateString(),
    nin: '',
};
