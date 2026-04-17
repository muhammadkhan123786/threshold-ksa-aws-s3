import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { Nationality } from 'libs/enums';
import { MAX_FILE_SIZE } from 'libs/types/athlete';

export const useAthleteSchema = () => {
    const { trans } = useLocales();

    return yup.object().shape({
        firstName: yup
            .string()
            .required(trans('validation.editAthleteProfile.firstNameRequired'))
            .default(undefined),
        lastName: yup
            .string()
            .required(trans('validation.editAthleteProfile.lastNameRequired'))
            .default(undefined),
        avatar: yup
            .string()
            .nullable()
            .test('is-base64', trans('validation.editAthleteProfile.uploadImage'), (value) => {
                if (!value) return true; // If value is null or undefined, it's considered valid
                return /^data:image\/(png|jpe?g|gif);base64,/.test(value);
            })
            .test('file-size', trans('validation.editAthleteProfile.uploadImageSize'), (value) => {
                if (!value) return true;
                const sizeInBytes =
                    (value.length * 3) / 4 -
                    (value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0);
                return sizeInBytes <= MAX_FILE_SIZE;
            })
            .default(undefined),
        relationship: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editAthleteProfile.relationshipRequired'))
            .default(undefined),
        nationality: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editAthleteProfile.nationalityRequired'))
            .default(undefined),
        contactNumber: yup
            .string()
            .required(trans('validation.editAthleteProfile.contactNumberRequired'))
            .matches(/^(05)\d{8}$/, trans('validation.editAthleteProfile.contactNumberInvalid'))
            .default(undefined),
        dateOfBirth: yup
            .string()
            .required(trans('validation.editAthletePersonalInfo.dateOfBirthRequired'))
            .default(undefined),
        // joinDate: yup
        //     .string()
        //     .required(trans('validation.editAthletePersonalInfo.joinDateRequired'))
        //     .default(undefined),
        education: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editAthletePersonalInfo.educationRequired'))
            .default(undefined),
        gender: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editAthletePersonalInfo.genderRequired'))
            .default(undefined),
        nin: yup
            .string()
            .required(trans('validation.add.nin.ninRequired'))
            .matches(/^\d{10}$/, trans('validation.add.nin.ninInvalid'))
            .test(
                'nationality-validation',
                trans('validation.add.nin.ninNationalityValidation'),
                function (value: string) {
                    const { nationality }: { nationality?: { value: Nationality } } = this.parent;

                    if (nationality?.value === Nationality.SA) {
                        return /^[12]/.test(value);
                    }

                    return true;
                },
            )
            .default(undefined),
        // dateOfUpdating: yup
        //     .string()
        //     .required(trans('validation.editMedicalInfo.dateOfUpdatingRequired'))
        //     .default(undefined),
        allergies: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editMedicalInfo.allergiesRequired'))
            .default(undefined),
        chronic: yup.array().of(yup.object().shape(SingleSelectOption)).default(undefined),
        injury: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editMedicalInfo.injuryRequired'))
            .default(undefined),
        consideration: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editMedicalInfo.considerationRequired'))
            .default(undefined),
        paymentMethod: yup
            .object()
            .shape(SingleSelectOption)
            // .required(trans('validation.editAthletePersonalInfo.paymentMethodRequired'))
            .optional()
            .default(undefined),
        cashValue: yup
            .number()
            .min(0)
            // .required(trans('validation.editAthletePersonalInfo.cashValueRequired'))
            .optional()
            .default(undefined),
        remainingValue: yup.number().min(0).optional().default(undefined),
    });
};

export const COMBINED_ATHLETE_DEFAULTS = {
    firstName: undefined,
    lastName: undefined,
    avatar: '',
    contactNumber: undefined,
    dateOfBirth: undefined,
    joinDate: undefined,
    nin: undefined,
    dateOfUpdating: undefined,
    allergies: undefined,
    chronic: undefined,
    injury: undefined,
    consideration: undefined,
    paymentMethod: undefined,
    cashValue: undefined,
    remainingValue: undefined,
    nationality: undefined,
    education: undefined,
    gender: undefined,
    relationship: undefined,
};
