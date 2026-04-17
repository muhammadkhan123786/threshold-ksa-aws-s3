import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { MAX_FILE_SIZE } from 'libs/types/athlete';
import * as yup from 'yup';

export const useEditAthleteProfileSchema = () => {
    const { trans } = useLocales();

    const editAthleteProfileValidators = {
        firstName: yup.string().required(trans('validation.editAthleteProfile.firstNameRequired')),
        lastName: yup.string().required(trans('validation.editAthleteProfile.lastNameRequired')),
        avatar: yup
            .string()
            .optional()
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
            }),
        relationship: yup.object().shape(SingleSelectOption),
        nationality: yup.object().shape(SingleSelectOption),
        contactNumber: yup
            .string()
            .required(trans('validation.editAthleteProfile.contactNumberRequired'))
            .matches(/^(05)\d{8}$/, trans('validation.editAthleteProfile.contactNumberInvalid')),
    };

    return yup.object().shape(editAthleteProfileValidators);
};

export const EDIT_ATHLETE_PROFILE_DEFAULTS = {
    firstName: '',
    lastName: '',
    avatar: '',
    contactNumber: '',
};
