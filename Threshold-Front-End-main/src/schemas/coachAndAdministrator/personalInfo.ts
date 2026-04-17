import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const usePersonalInfoSchema = () => {
    const { trans } = useLocales();

    return yup.object().shape({
        firstName: yup
            .string()
            .required(trans('validation.club-admin.updatePersonalInfo.firstNameRequired'))
            .default(''),

        lastName: yup
            .string()
            .required(trans('validation.club-admin.updatePersonalInfo.lastNameRequired'))
            .default(''),

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

        birthday: yup
            .date()
            .required(trans('validation.club-admin.player.dateOfBirthRequired'))
            .typeError(trans('validation.club-admin.player.dateOfBirthInvalid'))
            .nullable()
            .default(undefined),

        height: yup
            .number()
            .required(trans('validation.club-admin.updatePersonalInfo.heightRequired'))
            .min(0, trans('validation.club-admin.updatePersonalInfo.heightMin'))
            .typeError(trans('validation.club-admin.updatePersonalInfo.heightInvalid'))
            .default(undefined),

        weight: yup
            .number()
            .required(trans('validation.club-admin.updatePersonalInfo.weightRequired'))
            .min(0, trans('validation.club-admin.updatePersonalInfo.weightMin'))
            .typeError(trans('validation.club-admin.updatePersonalInfo.weightInvalid'))
            .default(undefined),

        schoolName: yup
            .string()
            .required(trans('validation.club-admin.updatePersonalInfo.schoolNameRequired'))
            .default(''),

        joinDate: yup
            .date()
            .required(trans('validation.club-admin.player.dateOfBirthRequired'))
            .typeError(trans('validation.club-admin.player.dateOfBirthInvalid'))
            .nullable()
            .default(undefined),

        experience: yup
            .number()
            .required(trans('validation.club-admin.updatePersonalInfo.experienceRequired'))
            .min(0, trans('validation.club-admin.updatePersonalInfo.experienceMin'))
            .typeError(trans('validation.club-admin.updatePersonalInfo.experienceInvalid'))
            .default(undefined),
    });
};

export const UPDATE_PERSONAL_INFO_DEFAULTS = {
    firstName: '',
    lastName: '',
    gender: undefined,
    birthday: undefined,
    height: undefined,
    weight: undefined,
    nationality: undefined,
    levelEducation: undefined,
    schoolName: '',
    joinDate: undefined,
    experience: undefined,
    playingFor: undefined,
};
