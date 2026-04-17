import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useUpdatePersonalInfoSchema = () => {
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
            .object()
            .nullable()
            .shape({
                label: yup
                    .string()
                    .required(trans('validation.club-admin.updatePersonalInfo.genderRequired')),
                value: yup
                    .string()
                    .required(trans('validation.club-admin.updatePersonalInfo.genderRequired')),
            })
            .required(trans('validation.club-admin.updatePersonalInfo.genderRequired'))
            .default(undefined),

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

        nationality: yup
            .object()
            .nullable()
            .shape({
                label: yup
                    .string()
                    .required(
                        trans('validation.club-admin.updatePersonalInfo.nationalityRequired'),
                    ),
                value: yup
                    .string()
                    .required(
                        trans('validation.club-admin.updatePersonalInfo.nationalityRequired'),
                    ),
            })
            .required(trans('validation.club-admin.updatePersonalInfo.nationalityRequired'))
            .default(undefined),

        levelEducation: yup
            .object()
            .nullable()
            .shape({
                label: yup
                    .string()
                    .required(trans('validation.club-admin.updatePersonalInfo.educationRequired')),
                value: yup
                    .string()
                    .required(trans('validation.club-admin.updatePersonalInfo.educationRequired')),
            })
            .required(trans('validation.club-admin.updatePersonalInfo.educationRequired'))
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

        playingFor: yup
            .object()
            .nullable()
            .shape({
                label: yup
                    .string()
                    .required(trans('validation.club-admin.updatePersonalInfo.playingForRequired')),
                value: yup
                    .string()
                    .required(trans('validation.club-admin.updatePersonalInfo.playingForRequired')),
            })
            .required(trans('validation.club-admin.updatePersonalInfo.playingForRequired'))
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
