import { useLocales } from 'hooks/locales';
import { useMemo } from 'react';
import * as yup from 'yup';

export const useEditCoachContractSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                joinDate: yup
                    .date()
                    .required(trans('validation.addAthleteBiometrics.dateRequired'))
                    .typeError(trans('validation.addAthleteBiometrics.dateInvalid')),

                contract: yup
                    .mixed()
                    .test(
                        'is-valid-contract',
                        trans('form.validation.contract'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.contract')),

                expirationDate: yup
                    .date()
                    .required(trans('validation.addAthleteBiometrics.dateRequired'))
                    .typeError(trans('validation.addAthleteBiometrics.dateInvalid')),
            }),
        [trans],
    );

    return schema;
};
