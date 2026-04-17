import { useLocales } from 'hooks/locales';
import { useMemo } from 'react';
import * as yup from 'yup';
export const useCreateContractPlayerSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                joinDate: yup.date().required(trans('form.validation.joinDateRequired')),
                type: yup
                    .mixed()
                    .test(
                        'is-valid-relationship',
                        trans('form.validation.relationshipRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.contractType')),

                contractDuration: yup
                    .mixed()
                    .test(
                        'is-valid-relationship',
                        trans('form.validation.relationshipRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.contractDuration')),

                status: yup
                    .mixed()
                    .test(
                        'is-valid-relationship',
                        trans('form.validation.relationshipRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.contractStatus')),

                contractFile: yup.mixed().nullable(),
            }),
        [trans],
    );

    return schema;
};
