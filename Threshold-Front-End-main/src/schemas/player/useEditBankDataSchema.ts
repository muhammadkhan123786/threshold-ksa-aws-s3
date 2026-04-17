import { useLocales } from 'hooks/locales';
import { useMemo } from 'react';
import * as yup from 'yup';
export const useEditBankDataSchema = () => {
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
                bank: yup
                    .mixed()
                    .test(
                        'is-valid-bank',
                        trans('bank_required'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('bank_required')),
                accountHolder: yup.string().required(trans('account_holder_required')),
            }),
        [trans],
    );

    return schema;
};
