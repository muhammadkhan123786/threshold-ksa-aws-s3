import { useLocales } from 'hooks/locales';
import * as yup from 'yup';
export enum Bank {
    al_rajhi_bank = 'al_rajhi_bank',
    national_commercial_bank = 'national_commercial_bank',
    samba_financial_group = 'samba_financial_group',
    riyad_bank = 'riyad_bank',
    alinma_bank = 'alinma_bank',
    saudi_british_bank = 'saudi_british_bank',
    bank_albilad = 'bank_albilad',
    bank_aljazira = 'bank_aljazira',
    arab_national_bank = 'arab_national_bank',
    saudi_investment_bank = 'saudi_investment_bank',
    banque_saudi_fransi = 'banque_saudi_fransi',
}
const YES_NO_OPTIONS = ['yes', 'no'];
const FOOD_ALLERGIES_OPTIONS = [
    '--',
    'peanuts',
    'tree_nuts',
    'milk',
    'eggs',
    'wheat',
    'soy',
    'fish',
    'shellfish',
    'sesame',
    'gluten',
    'corn',
    'berries',
    'soybeans',
    'mustard',
    'sulfites',
    'chocolate',
    'citrus_fruits',
    'strawberries',
    'bananas',
    'tomatoes',
    'garlic',
    'onions',
    'apples',
    'peaches',
    'mushrooms',
    'alcohol',
    'caffeine',
    'aspartame',
    'food_coloring',
    'other',
];
const CONSIDERATION_OPTIONS = [
    'none',
    'attention',
    'autistic',
    'down_syndrome',
    'visual_impairment',
    'hearing_impairment',
    'physical_disability',
    'anxiety',
    'intellectual_disability',
    'adhd',
    'dyslexia',
    'epilepsy',
    'depression',
    'bipolar_disorder',
    'ptsd',
    'chronic_pain',
    'learning_disability',
    'physical_injury',
    'asthma',
    'diabetes',
    'heart_condition',
    'cancer',
    'pregnancy',
    'obesity',
    'immune_disorder',
    'sensory_processing_disorder',
    'other',
];
import * as Yup from 'yup';
import { useMemo } from 'react';
import { SingleSelectOption } from 'libs/constants';
import { Nationality } from 'libs/enums';

export const useCreateClothingDataSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                tShirtSize: yup.object().shape(SingleSelectOption).notRequired(),
                pantSize: yup.object().shape(SingleSelectOption).notRequired(),
                shoeSize: yup.object().shape(SingleSelectOption).notRequired(),
                driFitSize: yup.object().shape(SingleSelectOption).notRequired(),
            }),
        [trans],
    );

    return schema;
};

export const useUpdateClothingDataSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                tShirtSize: yup.object().shape(SingleSelectOption).notRequired(),
                pantSize: yup.object().shape(SingleSelectOption).notRequired(),
                shoeSize: yup.object().shape(SingleSelectOption).notRequired(),
                driFitSize: yup.object().shape(SingleSelectOption).notRequired(),
            }),
        [trans],
    );

    return schema;
};

export const useCreateEmergencyContactSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                name: yup
                    .string()
                    .min(2, trans('Name must be at least 2 characters'))
                    .required(trans('Name is required')),
                relation: yup
                    .object()
                    .shape(SingleSelectOption)
                    .required(trans('validation.editAthleteProfile.relationshipRequired'))
                    .default(undefined),

                phoneNumber: yup
                    .string()
                    .required(trans('validation.editAthleteProfile.contactNumberRequired'))
                    .matches(
                        /^(05)\d{8}$/,
                        trans('validation.editAthleteProfile.contactNumberInvalid'),
                    )
                    .default(undefined),
                nationalNumber: yup
                    .string()
                    .required(trans('validation.editAthletePersonalInfo.ninRequired'))
                    .matches(
                        /^(1|2)(\d{9})$/,
                        trans('validation.editAthletePersonalInfo.ninInvalid'),
                    ),
            }),
        [trans],
    );

    return schema;
};

export const useUpdatePersonalInfoSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                firstName: yup
                    .string()
                    .nullable()
                    .notRequired() // Explicitly mark as not required
                    .default(undefined),
                lastName: yup
                    .string()
                    .nullable()
                    .notRequired() // Explicitly mark as not required
                    .default(undefined),
                nin: yup
                    .string()
                    .nullable()
                    .notRequired() // Explicitly mark as not required
                    .matches(
                        /^(1|2)(\d{9})$/,
                        trans('validation.editAthletePersonalInfo.ninInvalid'),
                    )
                    .default(undefined),
                weight: yup
                    .string()
                    .nullable()
                    .notRequired() // Explicitly mark as not required
                    .matches(
                        /^\d{1,3}(\.\d{1,5})?$/,
                        trans('validation.addBodyComposition.weightInvalid'),
                    )
                    .default(undefined),
                height: yup
                    .string()
                    .nullable()
                    .notRequired() // Explicitly mark as not required
                    .matches(
                        /^[12]{1}(\.\d{1,5})?$/,
                        trans('validation.addBodyComposition.heightInvalid'),
                    )
                    .default(undefined),
            }),
        [trans],
    );

    return schema;
};
export const useCreateBankDataSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                iban: yup
                    .string()
                    .test('valid-iban', trans('invalid_iban'), function (value) {
                        if (!value) return this.createError({ message: trans('iban_required') });

                        // Check if the IBAN starts with "SA"
                        if (!value.startsWith('SA')) {
                            return this.createError({ message: trans('iban_missing_sa') });
                        }

                        // Check for spaces
                        if (/\s/.test(value)) {
                            return this.createError({ message: trans('iban_no_spaces') });
                        }

                        // Check for length (24 characters for SA IBAN)
                        if (value.length !== 24) {
                            return this.createError({ message: trans('iban_incorrect_length') });
                        }

                        // Validate against the IBAN pattern
                        const ibanPattern = /^SA\d{2}\d{2}\d{18}$/;
                        if (!ibanPattern.test(value)) {
                            return this.createError({ message: trans('invalid_iban') });
                        }

                        return true;
                    })
                    .required(trans('iban_required')),
                bank: yup.object().required(trans('bank_required')),
                accountHolder: yup.string().required(trans('account_holder_required')),
            }),
        [trans],
    );

    return schema;
};

export const useUpdateBankDataSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                iban: yup
                    .string()
                    .test('valid-iban', trans('invalid_iban'), function (value) {
                        if (!value) return this.createError({ message: trans('iban_required') });

                        // Check if the IBAN starts with "SA"
                        if (!value.startsWith('SA')) {
                            return this.createError({ message: trans('iban_missing_sa') });
                        }

                        // Check for spaces
                        if (/\s/.test(value)) {
                            return this.createError({ message: trans('iban_no_spaces') });
                        }

                        // Check for length (24 characters for SA IBAN)
                        if (value.length !== 24) {
                            return this.createError({ message: trans('iban_incorrect_length') });
                        }

                        // Validate against the IBAN pattern
                        const ibanPattern = /^SA\d{2}\d{2}\d{18}$/;
                        if (!ibanPattern.test(value)) {
                            return this.createError({ message: trans('invalid_iban') });
                        }

                        return true;
                    })
                    .required(trans('iban_required')),
                bank: yup.object().required(trans('bank_required')),
                accountHolder: yup.string().required(trans('account_holder_required')),
            }),
        [trans],
    );

    return schema;
};
export const useUpdateMedicalInfoSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                // allergies: yup.object().shape(SingleSelectOption).default(undefined),
                // chronicDisease: yup.object().shape(SingleSelectOption).default(undefined),
                // foodAllergies: yup.object().shape(SingleSelectOption).default(undefined),
                // consideration: yup.object().shape(SingleSelectOption).default(undefined),
            }),
        [trans],
    );

    return schema;
};

export const useDocumentUploadSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                file: yup
                    .mixed<File>()
                    .required(trans('form.file_required'))
                    .test('fileSize', trans('form.file_size_exceeds_limit'), (value) => {
                        return value instanceof File && value.size <= 3 * 1024 * 1024;
                    }),
            }),
        [trans],
    );

    return schema;
};

export const useAddAthleteHealthRecordSchema = () => {
    const { trans } = useLocales();

    const editHealthInfoValidators = {
        type: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editHealthInfo.typeRequired')),
        description: yup.string().required(trans('validation.editHealthInfo.startDateRequired')),
        startDate: yup
            .date()
            .required(trans('validation.editHealthInfo.startDateRequired'))
            .typeError(trans('validation.editHealthInfo.startDateInvalid')),
        endDate: yup.date().nullable().typeError(trans('validation.editHealthInfo.endDateInvalid')),
        medicalRecommendation: yup
            .string()
            .required(trans('validation.editHealthInfo.startDateRequired')),
    };

    return yup.object().shape(editHealthInfoValidators);
};

export const useEditAthleteHealthRecordSchema = () => {
    const { trans } = useLocales();

    const editHealthInfoValidators = {
        type: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editHealthInfo.typeRequired')),
        description: yup.string().required(trans('validation.editHealthInfo.startDateRequired')),
        startDate: yup
            .date()
            .required(trans('validation.editHealthInfo.startDateRequired'))
            .typeError(trans('validation.editHealthInfo.startDateInvalid')),
        endDate: yup.date().nullable().typeError(trans('validation.editHealthInfo.endDateInvalid')),
        medicalRecommendation: yup
            .string()
            .required(trans('validation.editHealthInfo.startDateRequired')),
    };

    return yup.object().shape(editHealthInfoValidators);
};
