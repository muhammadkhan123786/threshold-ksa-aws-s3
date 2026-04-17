// schemas/club-coaches/useValidationSchemas.ts
import * as yup from 'yup';
import { Nationality, Gender, Education, Language } from 'libs/enums';
import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { ObjectSchema } from 'yup';

type PersonalInformationSchema = ObjectSchema<{
    firstName: string;
    lastName: string;
    avatar: any;
    nationality: any;
    gender: any;
    birthday: Date | null;
    country: any;
    schoolName: string;
    languages: { label: string; value: string }[];
}>;

type FileInformationSchema = ObjectSchema<{
    joinDate: any;
    contractDuration: any;
    playingFor: any;
    experience: number;
    type: any;
}>;

type ValidationSchema = PersonalInformationSchema | FileInformationSchema;

export const useValidationSchemas = (stepKey: string) => {
    const { trans } = useLocales();

    const personalInformationSchema = yup.object().shape({
        firstName: yup
            .string()
            .required(trans('validation.club-admin.updatePersonalInfo.firstNameRequired')),
        lastName: yup
            .string()
            .required(trans('validation.club-admin.updatePersonalInfo.lastNameRequired')),
        avatar: yup.mixed().test('fileType', trans('validation.invalidFileType'), (value) => {
            if (!value) return true;
            return value instanceof File && ['image/jpeg', 'image/png'].includes(value.type);
        }),
        nationality: yup
            .mixed<any>()
            .required(trans('validation.club-admin.updatePersonalInfo.nationalityRequired'))
            .test(
                'is-valid-nationality',
                trans('validation.club-admin.updatePersonalInfo.nationalityRequired'),
                (value) =>
                    (typeof value === 'string' && value.trim() !== '') || // Valid string
                    (typeof value === 'object' &&
                        value !== null &&
                        typeof value.label === 'string' &&
                        value.label.trim() !== '' &&
                        typeof value.value === 'string' &&
                        value.value.trim() !== ''), // Valid object
            ),
        gender: yup
            .mixed<any>()
            .required(trans('validation.club-admin.updatePersonalInfo.genderRequired'))
            .test(
                'is-valid-gender',
                trans('validation.club-admin.updatePersonalInfo.genderRequired'),
                (value) =>
                    (typeof value === 'string' && value.trim() !== '') || // Valid string
                    (typeof value === 'object' &&
                        value !== null &&
                        typeof value.label === 'string' &&
                        value.label.trim() !== '' &&
                        typeof value.value === 'string' &&
                        value.value.trim() !== ''), // Valid object
            ),
        birthday: yup.date().required(trans('validation.club-admin.player.dateOfBirthRequired')),
        country: yup
            .mixed<any>()
            .required(trans('validation.club-admin.updatePersonalInfo.countryRequired'))
            .test(
                'is-valid-country',
                trans('validation.club-admin.updatePersonalInfo.countryRequired'),
                (value) =>
                    (typeof value === 'string' && value.trim() !== '') || // Valid string
                    (typeof value === 'object' &&
                        value !== null &&
                        typeof value.label === 'string' &&
                        value.label.trim() !== '' &&
                        typeof value.value === 'string' &&
                        value.value.trim() !== ''), // Valid object
            ),
        levelEducation: yup
            .mixed<any>()
            .required(trans('validation.club-admin.updatePersonalInfo.educationRequired'))
            .test(
                'is-valid-levelEducation',
                trans('validation.club-admin.updatePersonalInfo.educationRequired'),
                (value) =>
                    (typeof value === 'string' && value.trim() !== '') || // Valid string
                    (typeof value === 'object' &&
                        value !== null &&
                        typeof value.label === 'string' &&
                        value.label.trim() !== '' &&
                        typeof value.value === 'string' &&
                        value.value.trim() !== ''), // Valid object
            ),
        schoolName: yup
            .string()
            .required(trans('validation.club-admin.updatePersonalInfo.schoolNameRequired')),
        // languages: yup
        //     .array()
        //     .of(
        //         yup.object().shape({
        //             label: yup.string().required(),
        //             value: yup.string().required(),
        //         }),
        //     )
        //     .required(trans('validation.required')),
    });

    const fileInformationSchema = yup.object().shape({
        joinDate: yup
            .date()
            .transform((value, originalValue) => (originalValue === '' ? null : value))
            .required(trans('validation.club-admin.player.joinDateRequired')),
        playingFor: yup
            .mixed<any>()
            .required(trans('validation.club-admin.updatePersonalInfo.playingForRequired'))
            .test(
                'is-valid-playingFor',
                trans('validation.club-admin.updatePersonalInfo.playingForRequired'),
                (value) =>
                    (typeof value === 'string' && value.trim() !== '') || // Valid string
                    (typeof value === 'object' &&
                        value !== null &&
                        typeof value.label === 'string' &&
                        value.label.trim() !== '' &&
                        typeof value.value === 'string' &&
                        value.value.trim() !== ''), // Valid object
            ),
        experience: yup
            .number()
            .required(trans('validation.club-admin.updatePersonalInfo.experienceRequired'))
            .min(0, trans('validation.club-admin.updatePersonalInfo.experienceMin'))
            .typeError(trans('validation.club-admin.updatePersonalInfo.experienceInvalid'))
            .default(undefined),
        roleType: yup
            .mixed<any>()
            .required(trans('validation.typeRequired'))
            .test(
                'is-valid-type',
                trans('validation.typeRequired'),
                (value) =>
                    (typeof value === 'string' && value.trim() !== '') || // Valid string
                    (typeof value === 'object' &&
                        value !== null &&
                        typeof value.label === 'string' &&
                        value.label.trim() !== '' &&
                        typeof value.value === 'string' &&
                        value.value.trim() !== ''), // Valid object
            ),
    });

    const schemas = {
        personalInformation: personalInformationSchema,
        fileInformation: fileInformationSchema,
    };

    return schemas[stepKey as keyof typeof schemas];
};
