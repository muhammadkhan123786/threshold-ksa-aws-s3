import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { MAX_FILE_SIZE } from 'libs/types/athlete';
import { SingleSelectOption } from 'libs/constants';
import { Nationality } from 'libs/enums';

export const useAddBranchManagerSchema = () => {
    const { trans } = useLocales();

    return yup.object({
        avatar: yup
            .string()
            .nullable()
            .test('is-base64', trans('validation.editAthleteProfile.uploadImage'), (value) => {
                if (!value) return true;
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

        username: yup
            .string()
            .required(trans('validation.editAdminPersonalInfo.nameRequired'))
            .default(''),

        email: yup
            .string()
            .required(trans('validation.editCoachAccountInfo.emailRequired'))
            .email(trans('validation.editCoachAccountInfo.emailInvalid'))
            .default(''),
        password: yup
            .string()
            .required(trans('validation.editCoachAccountInfo.passwordRequired'))
            .min(6, trans('validation.editCoachAccountInfo.passwordTooShort'))
            .default(''),
        confirmPassword: yup
            .string()
            .required(trans('validation.editCoachAccountInfo.confirmPasswordRequired'))
            .oneOf(
                [yup.ref('password')],
                trans('validation.editCoachAccountInfo.passwordsMustMatch'),
            )
            .default(''),
        nationality: yup.object().shape(SingleSelectOption).default(undefined),
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
                        return /^10/.test(value);
                    }
                    return /^20/.test(value);
                },
            ),
        phoneNumber: yup
            .string()
            .required(trans('validation.editAthleteProfile.contactNumberRequired'))
            .matches(/^(05)\d{8}$/, trans('validation.editAthleteProfile.contactNumberInvalid'))
            .default(''),
    });
};
