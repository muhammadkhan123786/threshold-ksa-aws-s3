import * as yup from 'yup';
import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { MAX_FILE_SIZE } from 'libs/types/athlete';
import { Nationality } from 'libs/enums';

export const useValidationSchemas = (activeTab: string) => {
    const { trans } = useLocales();

    // Personal Information Schema
    const personalInformationSchema = yup.object({
        firstName: yup.string().required(trans('validation.player.firstNameRequired')),
        lastName: yup.string().required(trans('validation.player.lastNameRequired')),
        avatar: yup.mixed().optional().nullable(),
        nationality: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.nationalityRequired'))
            .default(undefined),
        gender: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.genderRequired'))
            .default(undefined),

        dateOfBirth: yup
            .date()
            .required(trans('validation.player.dateOfBirthRequired'))
            .typeError(trans('validation.player.dateOfBirthInvalid'))
            .default(undefined),

        contactNumber: yup
            .string()
            .matches(/^05\d{8}$/, trans('validation.player.contactNumberInvalid'))
            .required(trans('validation.player.contactNumberRequired'))
            .default(undefined),

        emergencyPhone: yup
            .string()
            .matches(/^05\d{8}$/, trans('validation.player.emergencyPhoneInvalid'))
            .required(trans('validation.player.emergencyPhoneRequired'))
            .default(undefined),

        relationship: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.relationshipRequired'))
            .default(undefined),

        education: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.educationRequired'))
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
        ninExpirationDate: yup
            .date()
            .required(trans('validation.player.ninExpirationDateRequired'))
            .typeError(trans('validation.player.ninExpirationDateInvalid'))
            .default(undefined),
    });

    // File Information Schema
    const fileInformationSchema = yup.object({
        joinDate: yup
            .date()
            .required(trans('validation.player.joinDateRequired'))
            .typeError(trans('validation.player.joinDateInvalid')),
        position: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.positionRequired'))
            .default(undefined),

        clublevel: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.levelRequired'))
            .default(undefined),

        periodOfSubscription: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.periodOfSubscriptionRequired'))
            .default(undefined),

        category: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.player.categoryRequired')),
        weight: yup.string().required(trans('validation.player.weightRequired')).default(undefined),
    });

    // Account Information Schema
    const medicalInformationSchema = yup.object({
        dateOfUpdating: yup
            .date()
            .required(trans('validation.player.dateOfUpdatingRequired'))
            .typeError(trans('validation.player.dateOfUpdatingInvalid')),
        chronicConditions: yup
            .array()
            .of(yup.object().shape(SingleSelectOption))
            .required(trans('must.select.value')),
        allergyDetails: yup
            .array()
            .of(yup.object().shape(SingleSelectOption))
            .required(trans('must.select.value')),
        healthFactors: yup
            .array()
            .of(yup.object().shape(SingleSelectOption))
            .required(trans('must.select.value')),
    });

    // Map schemas to tabs
    const schemas: Record<string, yup.ObjectSchema<any>> = {
        personalInformation: personalInformationSchema,
        fileInformation: fileInformationSchema,
        medicalInformation: medicalInformationSchema,
    };

    return schemas[activeTab] || personalInformationSchema;
};

export const DEFAULT_PLAYER_VALUES = {
    // Personal Information Defaults
    firstName: undefined,
    lastName: undefined,
    avatar: undefined,
    nationality: undefined, // Object with `label` and `value`
    gender: undefined, // Object with `label` and `value`
    dateOfBirth: undefined, // Date
    contactNumber: undefined,
    emergencyPhone: undefined,
    relationship: undefined, // Object with `label` and `value`
    education: undefined, // Object with `label` and `value`
    nin: undefined,
    ninExpirationDate: undefined, // Date

    // File Information Defaults
    joinDate: undefined, // Date
    position: undefined, // Object with `label` and `value`
    clublevel: undefined, // Object with `label` and `value`
    periodOfSubscription: undefined, // Object with `label` and `value`
    category: undefined, // Object with `label` and `value`
    weight: undefined, // String

    // Medical Information Defaults
    dateOfUpdating: undefined, // Date
    chronicConditions: undefined, // Array of objects with `label` and `value`
    allergyDetails: undefined, // Array of objects with `label` and `value`
    healthFactors: undefined, // Array of objects with `label` and `value`
};
